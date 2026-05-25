# Ecosistema Startups — Proyecto Final

API RESTful para la gestión de un ecosistema de startups, aceleradoras, inversores y sus relaciones. Backend en Node.js + Express + Sequelize + MySQL.

---

## Estado del Proyecto frente a Requerimientos

### RF-01 | CRUD Completo — ✅ **CUMPLE**

- Verbos HTTP: POST, GET, PUT, DELETE sobre 11 entidades (usuarios, roles, sectores, sesiones, startups, aceleradoras, inversores, geolocalización, conexiones, solicitudes, métricas, mensajes, consultas IA, notificaciones, contacto público).
- Códigos HTTP correctos (200, 201, 400, 401, 403, 404, 500).
- Validación de entrada con `express-validator` en todos los endpoints de escritura.
- Base de datos MySQL persistente.
- Sin errores 5xx en flujo normal.

### RF-02 | Seguridad y Autenticación — ✅ **CUMPLE**

- Registro público (`POST /api/usuarios`) e inicio de sesión (`POST /api/auth/login`).
- Contraseñas hasheadas con bcrypt.
- Sesiones JWT con doble validación (firma + verificación en BD).
- Middleware `authRequired` protege endpoints sensibles → 401/403.
- Roles: `requireRole(1)` para admin. Niveles: admin, startup, aceleradora, inversor.
- Logout invalida el token (`es_valido = false`).

### RF-03 | API RESTful — ⚠️ **PARCIAL**

| Aspecto | Estado |
|---------|--------|
| Recursos en plural/minúsculas | ✅ `/api/startups`, `/api/usuarios` |
| Métodos HTTP correctos | ✅ GET/POST/PUT/DELETE |
| Respuestas JSON consistentes | ✅ `{ message, ... }` |
| Paginación en listados | ✅ `?page=&limit=` |
| Versionado de API (`/api/v1/`) | ❌ **No implementado** |
| Documentación / Postman / Swagger | ❌ **Solo API.md, falta Swagger o Postman** |

### RF-04 | Base de Datos / Servidor — ⚠️ **PARCIAL**

| Aspecto | Estado |
|---------|--------|
| MySQL con variables de entorno | ✅ |
| Sequelize ORM (sin SQL plano) | ✅ |
| Manejo de errores de conexión | ⚠️ No hay reintentos ni mensajes descriptivos sin exponer detalles |
| Transacciones multi-registro | ❌ **No implementado** |
| Servidor en puerto por variable de entorno | ✅ `PORT=3007` |

### RF-05 | Funcionalidades Avanzadas — ✅ **CUMPLE** (4 implementadas, mínimo 2)

| Funcionalidad | Estado | Cómo activar |
|---------------|--------|-------------|
| Búsqueda por texto | ✅ `?search=` en startups, aceleradoras, inversores | Ver API.md#1 |
| Filtros por campo | ✅ `?sector_id=`, `?fase=`, `?estado=` | Ver API.md#1 |
| Ordenamiento dinámico | ✅ `?sortBy=&order=` | Ver API.md#1 |
| Carga de archivos (logos) | ✅ Multer + Cloudinary | Ver API.md#2 |
| Envío de correos | ✅ Nodemailer en approve/reject | Ver API.md#3 |
| Caché de respuestas | ❌ **No implementado** | — |

### RF-06 | Frontend — ❌ **NO CUMPLE**

| Aspecto | Estado |
|---------|--------|
| Paneles de administración con roles diferenciados | ❌ No implementado |
| Estados de carga, errores, confirmaciones destructivas | ❌ No implementado |
| Vista admin restringida (reportes, usuarios) | ❌ No implementado |
| Validación de token/sesión en frontend | ❌ No implementado |
| Validación cliente en formularios | ❌ No implementado |
| Listados paginados en frontend | ❌ No implementado |
| UI reactiva sin recarga manual | ❌ No implementado |

### RF-07 | Integración de IA — ❌ **NO CUMPLE**

| Aspecto | Estado |
|---------|--------|
| Modelo `ConsultaIA` existe (tabla + endpoints CRUD) | ✅ |
| Skill de IA implementada (LLM, agente, automatización, n8n, Make, Zapier) | ❌ **No implementada** |
| Demostrable durante presentación | ❌ |

**Opciones para cumplir RF-07:**
- **LLM**: Conectar a Gemini/OpenAI para responder consultas (`POST /api/communication/consultas-ia`)
- **Agente**: Chatbot que clasifique startups por sector automáticamente
- **n8n/Make/Zapier**: Workflow que envíe notificaciones al aprobar solicitudes
- **Automatización**: Email + notificación in-app al cambiar estado de solicitud (backend ya soporta el email)

---

## No funcionales

### RNF-01 | Organización del Código — ✅ **CUMPLE**

- Arquitectura en capas: routes → controllers → services → models.
- Configuración separada (`config/`, `.env`).
- Comentarios JSDoc en servicios y middlewares.
- Middlewares reutilizables (`authRequired`, `requireRole`, `validators`).

### RNF-02 | Pruebas — ✅ **CUMPLE**

- Framework: Jest + Supertest.
- 11 suites, 81 tests, todos pasando.
- Cobertura: ~78% statements, ~91% functions.
- Tests en SQLite in-memory (no dependencias externas).
- Comando único: `npm test`.

### RNF-03 | GitHub — ❌ **NO CUMPLE**

| Aspecto | Estado |
|---------|--------|
| Repositorio público | ✅ |
| Ramas: main + develop + feature/* | ❌ No existe rama `develop`. Ramas: `main`, `jorge`, `PRUEBAS`, `gabo` |
| Conventional Commits | ❌ Commits como `ddd`, `aaa`, `erer` |
| Pull Requests con descripción | ❌ No hay evidencia de PRs |
| Progreso incremental | ❌ Muchos commits sin sentido |

### RNF-04 | Documentación — ❌ **NO CUMPLE**

| Aspecto | Estado |
|--------|--------|
| README.md raíz | ✅ Creado |
| Diagrama entidad-relación | ✅ Incluido abajo |
| Postman Collection / Swagger | ✅ `http://localhost:3007/api/v1/docs` |
| ARCHITECTURE.md | ✅ Creado en raíz |
| API.md (documentación endpoints) | ✅ `backend/API.md` |

---

## Stack Tecnológico

| Capa | Tecnología | ¿Obligatorio? |
|------|-----------|---------------|
| Runtime | Node.js + Express | ✅ ✅ |
| Base de Datos | MySQL (relacional) | ✅ ✅ |
| ORM | Sequelize | ✅ ✅ |
| Autenticación | JWT + bcrypt | ✅ ✅ |
| Pruebas | Jest + Supertest | ✅ ✅ |
| Documentación API | ✅ Swagger en `/api/docs` | ✅ ✅ |
| Control de Versiones | Git + GitHub | ✅ ✅ |
| Variables de Entorno | `.env` (en `.gitignore`) | ✅ ✅ |

---

## Checklist de Pendientes Prioritarios

- [x] **RF-03**: Agregar versionado de API (`/api/v1/...`)
- [x] **RF-03**: Crear colección Postman o configurar Swagger (`swagger-jsdoc` + `swagger-ui-express`)
- [x] **RF-04**: Agregar reintentos de conexión a BD con mensajes descriptivos
- [x] **RF-04**: Usar transacciones Sequelize en operaciones multi-tabla (aprobación/rechazo de solicitudes)
- [ ] **RF-06**: Rediseñar frontend con paneles por rol, estados de carga, validaciones, paginación
- [ ] **RF-07**: Implementar skill de IA (LLM, n8n, agente, automatización con IA)
- [ ] **RNF-03**: Crear rama `develop`, adoptar Conventional Commits, usar Pull Requests
- [x] **RNF-04**: Agregar diagrama ER, Swagger/Postman, ARCHITECTURE.md

---

## Diagrama Entidad-Relación

```mermaid
erDiagram
    roles ||--o{ users : "role_id"
    users ||--o| startups : "user_id"
    users ||--o| aceleradoras : "user_id"
    users ||--o| inversores : "user_id"
    users ||--o{ sessions : "user_id"
    users ||--o{ geolocalizacion : "user_id"
    users ||--o{ conexiones_grafo : "actor_origen_id"
    users ||--o{ conexiones_grafo : "actor_destino_id"
    users ||--o{ solicitudes : "user_id"
    users ||--o{ mensajes : "emisor_id"
    users ||--o{ consultas_ia : "user_id"
    users ||--o{ notificaciones : "user_id"
    sectores ||--o{ startups : "sector_id"
    startups ||--o{ metricas_dashboard : "startup_id"

    roles {
        int id PK
        string nombre UK
    }

    users {
        int id PK
        string cedula UK
        string nombre_hacienda
        string email UK
        text password_hash
        int role_id FK
        datetime created_at
    }

    sessions {
        int id PK
        int user_id FK
        text token_jwt
        date expiracion
        boolean es_valido
    }

    sectores {
        int id PK
        string nombre
        string color_hex
    }

    startups {
        int id PK
        int user_id FK UK
        string nombre_comercial
        text descripcion
        enum fase
        text logo_url
        int sector_id FK
    }

    aceleradoras {
        int id PK
        int user_id FK UK
        string nombre
        text programas_activos
        string sitio_web
    }

    inversores {
        int id PK
        int user_id FK UK
        string nombre
        decimal presupuesto_min
        decimal presupuesto_max
        json sectores_interes
    }

    geolocalizacion {
        int id PK
        int user_id FK
        decimal latitud
        decimal longitud
        text direccion
    }

    conexiones_grafo {
        int id PK
        int actor_origen_id FK
        int actor_destino_id FK
        enum tipo_vinculo
    }

    solicitudes {
        int id PK
        int user_id FK
        enum tipo
        enum estado
        text comentarios_admin
    }

    metricas_dashboard {
        int id PK
        int startup_id FK
        int num_empleados
        decimal valoracion_estimada
        date fecha_reporte
    }

    mensajes {
        int id PK
        int emisor_id FK
        int chat_id
        text contenido
        boolean leido
        datetime fecha_envio
    }

    consultas_ia {
        int id PK
        int user_id FK
        text pregunta_usuario
        text respuesta_ia
        string modelo
    }

    notificaciones {
        int id PK
        int user_id FK
        string titulo
        text mensaje
        string tipo
        boolean leido
        datetime fecha_creacion
    }

    mensajes_contacto_publico {
        int id PK
        string nombre
        string email
        string asunto
        text mensaje
        boolean leido
        datetime fecha_envio
    }
```

---

## Instrucciones de Instalación

```bash
# 1. Clonar
git clone https://github.com/jorge-zuniga506/FULLSTACK.git
cd FULLSTACK

# 2. Backend
cd backend
cp .env.example .env   # editar credenciales
npm install
npm start              # http://localhost:3007

# 3. Frontend
cd ../frontend
npm install
npm run dev            # http://localhost:5173

# 4. Tests
cd ../backend
npm test
```

