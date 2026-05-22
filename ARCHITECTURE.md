# Arquitectura del Proyecto

## Stack Tecnológico

```
Frontend (React 19 + Vite 8)  ─── HTTP ───▶  Backend (Node.js + Express 4)
                                                    │
                                                    ▼
                                              Sequelize ORM
                                                    │
                                                    ▼
                                         MySQL (producción)
                                         SQLite (tests)
```

## Estructura de Directorios

```
FULLSTACK/
├── backend/
│   ├── app.js                 # Fábrica Express: middlewares globales, rutas
│   ├── server.js              # Punto de entrada: sincroniza BD, arranca servidor
│   ├── index.js               # Asociaciones entre modelos (relaciones FK)
│   ├── config/
│   │   ├── config.js          # Configuración multi-entorno (dev/test/prod)
│   │   ├── db.js              # Instancia Sequelize + reintentos de conexión
│   │   └── swagger.js         # Especificación OpenAPI 3.0 para Swagger UI
│   ├── routes/                # Definición de rutas HTTP y middlewares
│   │   ├── AuthRoutes.js
│   │   ├── UserRoutes.js
│   │   ├── StartupRoutes.js
│   │   ├── AceleradoraRoutes.js
│   │   ├── InversorRoutes.js
│   │   ├── SectorRoutes.js
│   │   ├── RoleRoutes.js
│   │   ├── SessionRoutes.js
│   │   ├── EcosystemRoutes.js
│   │   ├── CommunicationRoutes.js
│   │   └── NotificationRoutes.js
│   ├── controllers/           # Capa HTTP: recibe req/res, delega en services
│   ├── services/              # Lógica de negocio (pureza, sin req/res)
│   ├── models/                # Definiciones Sequelize de tablas + relaciones
│   ├── middlewares/           # Middlewares reutilizables
│   │   ├── authMiddleware.js  # authRequired + requireRole()
│   │   ├── validators.js      # Validación con express-validator
│   │   └── errorHandler.js    # Manejador global de errores Express
│   ├── tests/                 # Pruebas Jest + Supertest (SQLite in-memory)
│   ├── migrations/            # Migraciones de esquema SQL
│   ├── scripts/               # Scripts utilitarios (sync, migrate)
│   ├── uploads/               # Archivos subidos localmente (fallback)
│   └── coverage/              # Reportes de cobertura de pruebas
├── frontend/
│   └── src/
│       ├── components/        # Componentes React reutilizables
│       ├── pages/             # Páginas del router
│       ├── routes/            # Configuración de rutas React Router
│       └── styles/            # Archivos CSS
└── README.md
```

## Arquitectura en Capas (Backend)

```
HTTP Request
    │
    ▼
┌─────────────┐   routes/        Define URL, método HTTP, middlewares
│   Routes    │                  No contiene lógica de negocio
└──────┬──────┘
       │
       ▼
┌─────────────┐   middlewares/   authRequired (JWT), requireRole (RBAC),
│ Middlewares │                  validators (express-validator)
└──────┬──────┘
       │
       ▼
┌─────────────┐   controllers/   Extrae datos de req (params, body, query),
│ Controllers │                  llama al service, formatea respuesta JSON
└──────┬──────┘
       │
       ▼
┌─────────────┐   services/      Lógica de negocio pura: validaciones,
│  Services   │                  reglas de dominio, transacciones
└──────┬──────┘
       │
       ▼
┌─────────────┐   models/        Definiciones de tablas Sequelize,
│   Models    │                  asociaciones (FK, hasMany, belongsTo)
└──────┬──────┘
       │
       ▼
┌─────────────┐   config/db.js   Instancia Sequelize configurada
│    MySQL    │                  Pool de conexiones, reintentos
└─────────────┘
```

## Flujo de Autenticación

```
1. POST /auth/login
   └─► Valida email+password contra BD (bcrypt.compare)
   └─► Genera JWT (jsonwebtoken.sign)
   └─► Crea registro en sessions (token_jwt, expiracion, es_valido=true)
   └─► Devuelve { token, usuario }

2. Request a ruta protegida (Authorization: Bearer <token>)
   └─► authRequired middleware:
        ├─ Extrae token del header
        ├─ Verifica firma JWT (jwt.verify)
        ├─ Busca sesión activa en BD (token_jwt + es_valido=true)
        ├─ Verifica expiración de la sesión
        └─ Adjunta req.user = { id, email, role_id }

3. POST /auth/logout
   └─► Marca es_valido = false en la sesión
```

## Versionado de API

| Prefijo | Propósito |
|---------|-----------|
| `/api/v1/` | Versión canónica actual |
| `/api/`    | Legacy (backward compatibility) |

Ambos prefijos montan los mismos route handlers. En el futuro, al introducir breaking changes, se creará `/api/v2/` mientras `/api/v1/` sigue funcionando.

## Seguridad

- **JWT**: Firma HMAC-SHA256 con clave en `JWT_SECRET` (default: hardcoded).
- **Doble validación de sesión**: El JWT se verifica criptográficamente + se consulta la tabla `sessions` para soportar revocación (logout).
- **Roles**: `requireRole(1, 2, ...)` como middleware post-autenticación. Retorna 403 si el `role_id` no está en la lista permitida.
- **Contraseñas**: bcrypt con 10 rondas de sal.
- **Headers**: Helmet para seguridad HTTP.

## Decisiones de Diseño

1. **Dual routing**: Cada recurso tiene rutas canónicas REST (`/startups`, `/startups/:id`) y aliases legacy en español (`/obtener-startups`, `/editar-startups/:id_Startup`) para compatibilidad con el frontend existente.

2. **Servicios sin estado**: Todos los servicios son clases estáticas. No almacenan estado entre requests. Fáciles de testear.

3. **Paginación condicional**: Los endpoints GET detectan automáticamente si se solicita paginación (presencia de `page` o `limit`). Sin parámetros, devuelven el array completo (comportamiento legacy).

4. **Carga de archivos condicional**: Si hay credenciales Cloudinary en `.env`, los logos se suben a Cloudinary. Si no, se guardan localmente en `backend/uploads/`.

5. **Email condicional**: Si hay configuración SMTP en `.env`, se envían correos al aprobar/rechazar solicitudes. Si no, la operación continúa silenciosamente.

## Modelo de Datos (Entidad-Relación)

Ver diagrama ER en `README.md` o en `backend/API.md` (sección Modelos de Datos).

14 tablas principales:
- `roles`, `users`, `sessions` — Autenticación y RBAC
- `sectores`, `startups`, `aceleradoras`, `inversores` — Perfiles de negocio
- `geolocalizacion`, `conexiones_grafo`, `solicitudes`, `metricas_dashboard` — Ecosistema
- `mensajes`, `consultas_ia`, `notificaciones`, `mensajes_contacto_publico` — Comunicación
