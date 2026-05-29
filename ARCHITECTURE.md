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
│   │   ├── EcosystemRoutes.js      # Geo, Conexiones, Solicitudes, Métricas
│   │   ├── CommunicationRoutes.js  # Mensajes, Consultas IA, Contacto
│   │   ├── NotificationRoutes.js
│   │   ├── ChatbotRoutes.js        # J.A.R.V.I.S. asistente IA
│   │   ├── IdentityRoutes.js       # Consulta cédula Hacienda
│   │   ├── DashboardRoutes.js      # Paneles por rol
│   │   ├── ConvocatoriaRoutes.js   # Convocatorias aceleradoras
│   │   ├── KpiRoutes.js            # KPIs de startups
│   │   ├── DemodayRoutes.js        # Demo Day reuniones
│   │   ├── PerksRoutes.js          # Perks y mentorías
│   │   ├── StartupFeedRoutes.js    # Red social startups
│   │   ├── AceleradoraFeedRoutes.js# Red social aceleradoras
│   │   ├── InversorFeedRoutes.js   # Red social inversores
│   │   ├── ExchangeRateRoutes.js   # Tipo de cambio BCCR
│   │   └── SupportRoutes.js        # Reportes de soporte
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
│       │   ├── Chatbot/       # J.A.R.V.I.S. widget flotante
│       │   ├── Dashboard/     # Vistas de dashboard
│       │   ├── Common/        # CRUD, Pagination, ExchangeRatePanel
│       │   ├── EntityProfile/ # Perfiles de entidades
│       │   ├── Explorer/      # Explorador del ecosistema
│       │   ├── Footer/        # Footer global
│       │   ├── Publication/   # Publicaciones
│       │   └── ...            # Otros componentes
│       ├── pages/             # Páginas del router
│       │   ├── Auth/          # Login, Register
│       │   ├── Dashboard/     # Admin, Startup, Aceleradora, Inversor
│       │   ├── Landpage/      # Landing page pública
│       │   ├── Profile/       # Perfil de usuario
│       │   └── ...            # Otras páginas
│       ├── routes/            # Configuración de rutas React Router
│       ├── services/          # Llamadas API (apiService, userService, etc.)
│       ├── context/           # AuthContext
│       ├── constants/         # Constantes y helpers
│       └── styles/            # Archivos CSS
├── .gitignore              # Ignora node_modules, .env, dist, coverage, etc.
├── JUSTIFICACION_CHATBOT.md   # Documento de justificación del chatbot
├── ARCHITECTURE.md            # Este archivo
└── README.md                  # Documentación principal
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
        ├─ Extrae token del header o cookie
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

## Seguridad

- **JWT**: Firma HMAC-SHA256 con clave en `JWT_SECRET`.
- **Doble validación de sesión**: JWT verificado criptográficamente + consulta a `sessions`.
- **Roles**: `requireRole(1, 2, ...)` como middleware post-autenticación. Retorna 403 si el `role_id` no está en la lista permitida.
- **Contraseñas**: bcrypt con 10 rondas de sal.
- **Headers**: Helmet para seguridad HTTP.
- **Cookies**: Login setea cookie `access_token` (HttpOnly, SameSite=Lax, Secure en producción).

## Decisiones de Diseño

1. **Dual routing**: Cada recurso tiene rutas REST (`/startups`) y aliases legacy en español (`/obtener-startups`).
2. **Servicios sin estado**: Clases estáticas sin estado entre requests.
3. **Paginación condicional**: Sin parámetros `page/limit`, devuelve array completo (legacy).
4. **Carga de archivos condicional**: Cloudinary si hay credenciales, local `uploads/` si no.
5. **Email condicional**: SMTP si configurado, omisión silenciosa si no.
6. **IA multi-modelo**: Gemini principal → Claude respaldo → reglas locales fallback.
7. **Formato respuesta estandarizado**: `{ status, message, data, meta }`.

## Modelo de Datos (Entidad-Relación)

### Diagrama Relacional

A continuación se presenta el diagrama completo de las 31 tablas del sistema, organizadas por módulos.

### 1. Módulo de Autenticación y Usuarios

```
┌──────────┐       ┌──────────┐       ┌──────────────┐
│  roles   │──1:N──│  users   │──1:N──│   sessions   │
└──────────┘       └────┬─────┘       └──────────────┘
                        │
                        │ 1:1
              ┌─────────┼──────────┐
              ▼         ▼          ▼
        ┌─────────┐ ┌──────────┐ ┌──────────┐
        │ startups│ │aceleradoras││ inversores│
        └────┬────┘ └────┬─────┘ └─────┬────┘
```

### 2. Módulo de Perfiles y Sectores

```
┌──────────┐       ┌──────────┐
│ sectores │──1:N──│ startups │
└──────────┘       └──────────┘
```

### 3. Módulo de Ecosistema

```
┌────────────────┐       ┌────────────────────┐
│  users         │──1:N──│ geolocalizacion    │
└────────────────┘       └────────────────────┘

┌────────────────┐       ┌────────────────────┐
│  users (origen)│──1:N──│ conexiones_grafo   │
└────────────────┘       └────────────────────┘
┌──────────────────┐     └────────────────────┘
│  users (destino) │──1:N──┘
└──────────────────┘

┌────────────────┐       ┌────────────────────┐
│  users         │──1:N──│ solicitudes        │
└────────────────┘       └────────────────────┘

┌────────────────┐       ┌────────────────────┐
│  startups      │──1:N──│ metricas_dashboard │
└────────────────┘       └────────────────────┘
```

### 4. Módulo de Comunicación

```
┌────────────────┐       ┌────────────────────┐
│  users         │──1:N──│ mensajes           │
└────────────────┘       └────────────────────┘

┌────────────────┐       ┌────────────────────┐
│  users         │──1:N──│ consultas_ia       │
└────────────────┘       └────────────────────┘

┌────────────────┐       ┌──────────────────────────┐
│  users         │──1:N──│ notificaciones           │
└────────────────┘       └──────────────────────────┘

┌─────────────────────────────────────────┐
│  mensajes_contacto_publico (sin FK)     │
└─────────────────────────────────────────┘

┌────────────────┐       ┌────────────────────┐
│  users         │──1:N──│ admin_audit_logs   │
└────────────────┘       └────────────────────┘

┌────────────────┐       ┌────────────────────┐
│  users         │──1:N──│ support_reports    │
└────────────────┘       └────────────────────┘
```

### 5. Módulo de Aceleración (Convocatorias - KPIs - Demo Day)

```
┌──────────────┐       ┌────────────────┐       ┌──────────────────┐
│ aceleradoras │──1:N──│ convocatorias  │──1:N──│ postulaciones    │
└──────────────┘       └────────────────┘       └────────┬─────────┘
                                                        │
                                              ┌─────────┴─────────┐
                                              │                   │
                                              ▼                   ▼
                                      ┌──────────────┐   ┌──────────────┐
                                      │  startups    │   │kpi_startups  │
                                      └──────────────┘   └──────┬───────┘
                                                                 │
                                                        ┌────────┴────────┐
                                                        │  convocatorias │
                                                        └────────────────┘

┌──────────────┐       ┌────────────────────┐
│ inversores   │──1:N──│ demoday_solicitudes│
└──────────────┘       └───────┬────────────┘
                               │
                      ┌────────┴────────┐
                      │   startups      │
                      └─────────────────┘
```

### 6. Módulo de Perks y Mentorías

```
┌──────────────┐       ┌────────────┐       ┌────────────────────┐
│ aceleradoras │──1:N──│   perks    │──1:N──│ reclamaciones_perk │
└──────────────┘       └────────────┘       └─────────┬──────────┘
                                                       │
                                              ┌────────┴────────┐
                                              │   startups      │
                                              └─────────────────┘

┌──────────────┐       ┌────────────┐       ┌────────────────────┐
│ aceleradoras │──1:N──│  mentores  │──1:N──│ reservas_mentoria  │
└──────────────┘       └────────────┘       └─────────┬──────────┘
                                                       │
                                              ┌────────┴────────┐
                                              │   startups      │
                                              └─────────────────┘
```

### 7. Módulo de Red Social por Rol (Feeds)

```
┌──────────┐       ┌────────────────┐       ┌──────────────────────┐
│ startups │──1:N──│ startup_posts  │──1:N──│ startup_comentarios  │
└──────────┘       └────────────────┘       └──────────────────────┘

┌──────────────┐       ┌────────────────────┐       ┌──────────────────────────┐
│ aceleradoras │──1:N──│ aceleradora_posts  │──1:N──│ aceleradora_comentarios  │
└──────────────┘       └────────────────────┘       └──────────────────────────┘

┌────────────┐       ┌──────────────────┐       ┌──────────────────────┐
│ inversores │──1:N──│ inversor_posts   │──1:N──│ inversor_comentarios │
└────────────┘       └──────────────────┘       └──────────────────────┘
```

### Listado Completo de Tablas (31)

| # | Tabla | Módulo | Descripción |
|---|-------|--------|-------------|
| 1 | `roles` | Autenticación | Roles del sistema (Admin, Startup, Aceleradora, Inversor) |
| 2 | `users` | Autenticación | Usuarios registrados |
| 3 | `sessions` | Autenticación | Sesiones JWT activas |
| 4 | `sectores` | Perfiles | Sectores de startups (Fintech, Healthtech, etc.) |
| 5 | `startups` | Perfiles | Perfiles de startups |
| 6 | `aceleradoras` | Perfiles | Perfiles de aceleradoras |
| 7 | `inversores` | Perfiles | Perfiles de inversores |
| 8 | `geolocalizacion` | Ecosistema | Ubicaciones geográficas de usuarios |
| 9 | `conexiones_grafo` | Ecosistema | Conexiones entre actores (Inversión, Alianza, Mentoría) |
| 10 | `solicitudes` | Ecosistema | Solicitudes de incorporación al ecosistema |
| 11 | `metricas_dashboard` | Ecosistema | Métricas de startups (empleados, valoración) |
| 12 | `mensajes` | Comunicación | Mensajes de chat entre usuarios |
| 13 | `consultas_ia` | Comunicación | Historial de consultas al asistente IA |
| 14 | `notificaciones` | Comunicación | Notificaciones push in-app |
| 15 | `mensajes_contacto_publico` | Comunicación | Formulario de contacto público |
| 16 | `admin_audit_logs` | Comunicación | Registro de acciones de administradores |
| 17 | `support_reports` | Comunicación | Reportes de soporte técnico |
| 18 | `convocatorias` | Aceleración | Convocatorias de aceleradoras |
| 19 | `postulaciones` | Aceleración | Postulaciones de startups a convocatorias |
| 20 | `kpi_startups` | Aceleración | KPIs registrados por startups |
| 21 | `demoday_solicitudes` | Aceleración | Solicitudes de reunión de inversores a startups |
| 22 | `perks` | Aceleración | Beneficios ofrecidos por aceleradoras |
| 23 | `mentores` | Aceleración | Mentores registrados por aceleradoras |
| 24 | `reclamaciones_perk` | Aceleración | Reclamaciones de perks por startups |
| 25 | `reservas_mentoria` | Aceleración | Reservas de mentoría |
| 26 | `startup_posts` | Feed | Publicaciones del feed de startups |
| 27 | `startup_comentarios` | Feed | Comentarios en posts de startups |
| 28 | `aceleradora_posts` | Feed | Publicaciones del feed de aceleradoras |
| 29 | `aceleradora_comentarios` | Feed | Comentarios en posts de aceleradoras |
| 30 | `inversor_posts` | Feed | Publicaciones del feed de inversores |
| 31 | `inversor_comentarios` | Feed | Comentarios en posts de inversores |

## Módulos Funcionales

| Módulo | Tablas | Endpoints |
|--------|--------|-----------|
| **Autenticación** | roles, users, sessions | `/api/auth/*`, `/api/usuarios/*`, `/api/roles/*`, `/api/sesiones/*` |
| **Perfiles** | sectores, startups, aceleradoras, inversores | `/api/startups/*`, `/api/aceleradoras/*`, `/api/inversores/*`, `/api/sectores/*` |
| **Ecosistema** | geolocalizacion, conexiones_grafo, solicitudes, metricas_dashboard | `/api/ecosistemas/*` |
| **Comunicación** | mensajes, consultas_ia, notificaciones, contacto_publico, admin_audit_logs, support_reports | `/api/communication/*`, `/api/notifications/*`, `/api/support/*` |
| **IA** | consultas_ia | `/api/chatbot/*`, `/api/ai/*` |
| **Aceleración** | convocatorias, postulaciones, kpi_startups, demoday_solicitudes | `/api/convocatorias/*`, `/api/kpis/*`, `/api/demoday/*` |
| **Beneficios** | perks, mentores, reclamaciones_perk, reservas_mentoria | `/api/programas/*` |
| **Red Social** | *_{rol}_posts, *_{rol}_comentarios | `/api/feed/*`, `/api/feed/aceleradora/*`, `/api/feed/inversor/*` |
| **Utilidades** | — | `/api/identity/*`, `/api/indicadores/*`, `/api/dashboard/*` |

## Chatbot J.A.R.V.I.S.

### Arquitectura del Asistente IA

```
Usuario (Frontend React)
       │
       ▼
┌─────────────────────────┐
│  Widget J.A.R.V.I.S.    │
│  - Chat panel           │
│  - Speech-to-Text       │
│  - Text-to-Speech       │
│  - Modo Asesor/Clasif.  │
└────────┬────────────────┘
         │ POST /api/ai/*
         ▼
┌─────────────────────────┐
│  ChatbotController      │
│  - ask()                │
│  - classifyRequest()    │
└────────┬────────────────┘
         ▼
┌─────────────────────────────────────────────┐
│  ChatbotService                             │
│                                             │
│  1. ¿Comando especial? (/recargar-drive)    │
│  2. Cargar base de conocimiento (Drive)     │
│  3. Seleccionar modelo:                     │
│     ├─ Gemini 2.5 Flash (tool calling)      │
│     ├─ Anthropic Claude (respaldo)          │
│     └─ Reglas locales (fallback final)      │
│  4. Ejecutar tool calling si es necesario   │
│  5. Devolver respuesta + datos              │
└─────────────────────────────────────────────┘
```

### Tool Calling (5 herramientas BD)

| Herramienta | Descripción |
|-------------|-------------|
| `buscar_startups` | Busca startups por nombre, fase, sector o descripción |
| `buscar_aceleradoras` | Busca aceleradoras por nombre o programas |
| `buscar_inversores` | Busca inversores por nombre, presupuesto o sectores de interés |
| `buscar_solicitudes` | Consulta solicitudes de incorporación |
| `crear_solicitud` | Crea una nueva solicitud de incorporación |

## Actualizaciones Recientes

- Estandarización de respuestas a `{ status, message, data, meta }` mediante middleware global.
- Login retorna JWT en body y también en cookie `access_token` (HttpOnly, SameSite=Lax, Secure en producción).
- Middleware de autenticación acepta token desde `Authorization: Bearer` o cookie.
- Frontend con manejo centralizado de 401: limpia sesión y redirige a `/Login`.
- Chatbot J.A.R.V.I.S. con Gemini 2.5 Flash + Claude + tool calling + base de conocimiento Google Drive.
- Red social por rol: feeds independientes para startups, aceleradoras e inversores.
- Módulo de aceleración: convocatorias, postulaciones, KPIs, Demo Day, perks y mentorías.
- Documentación API completa en `backend/API.md` y Swagger en `/api/docs`.
