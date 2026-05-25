# API Documentation — Ecosistema Startups

## URLs

| Versión | URL |
|---------|-----|
| **Canonical (v1)** | `http://localhost:3007/api/v1` |
| Legacy | `http://localhost:3007/api` |
| **Swagger UI** | `http://localhost:3007/api/docs` |
| Swagger JSON | `http://localhost:3007/api/docs.json` |

---

## Authentication

La mayoría de los endpoints requieren un token JWT en el header:

```
Authorization: Bearer <token>
```

El token se obtiene mediante `POST /api/auth/login`.

### Roles

| ID | Role     |
|----|----------|
| 1  | Admin    |
| 2  | Startup  |
| 3  | Aceleradora |
| 4  | Inversor |

### Middleware

- `authRequired` — requiere token JWT válido. Retorna `401` si falta o es inválido.
- `requireRole(1)` — requiere rol Admin. Retorna `403` si no tiene permiso.

---

## Auth (`/api/auth`)

### POST `/api/auth/login`

Inicio de sesión.

**Body:**
```json
{
  "email": "usuario@email.com",
  "password": "123456"
}
```

**Response 200:**
```json
{
  "message": "Autenticacion exitosa",
  "token": "<JWT>",
  "usuario": { "id": 1, "cedula": "001", "nombre_hacienda": "Admin", "email": "...", "role_id": 1, "created_at": "..." }
}
```

**Errors:** `400` (campos faltantes), `401` (credenciales inválidas)

---

### POST `/api/auth/logout`

Cierra sesión e invalida el token.

**Auth:** `authRequired`

**Headers:** `Authorization: Bearer <token>`

**Response 200:**
```json
{ "message": "Logout exitoso. Token invalidado." }
```

---

### GET `/api/auth/me`

Obtiene los datos del usuario autenticado.

**Auth:** `authRequired`

**Response 200:**
```json
{
  "message": "Datos del usuario obtenidos exitosamente",
  "user": { "id": 1, "cedula": "001", "nombre_hacienda": "Admin", "email": "...", "role_id": 1, "created_at": "..." }
}
```

**Errors:** `404` (usuario no encontrado)

---

## Usuarios (`/api/usuarios`)

### POST `/api/usuarios`  
### POST `/api/usuarios/crear-usuario`

Registro público de usuario.

**Body:**
```json
{
  "cedula": "12345678",
  "nombre_hacienda": "Nombre Completo",
  "email": "user@email.com",
  "password_hash": "mi_password",
  "role_id": 2
}
```

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `cedula` | string | sí | Cédula (única, max 20) |
| `nombre_hacienda` | string | sí | Nombre completo |
| `email` | string | sí | Email válido (único) |
| `password_hash` | string | sí | Contraseña (min 6 caracteres) |
| `role_id` | integer | sí | FK a roles (1=admin, 2=startup, 3=aceleradora, 4=inversor) |

**Response 201:**
```json
{
  "message": "Usuario creado exitosamente",
  "usuario": { "id": 1, "cedula": "12345678", "nombre_hacienda": "...", "email": "...", "role_id": 2, "created_at": "..." }
}
```

**Errors:** `400` (validación)

---

### GET `/api/usuarios`  
### GET `/api/usuarios/obtener-usuario`

Lista todos los usuarios (solo admin).

**Auth:** `authRequired` + `requireRole(1)`

**Response 200:** Array de usuarios (sin `password_hash`)

---

### PUT `/api/usuarios/:id`  
### PUT `/api/usuarios/editar-usuarios/:id_Usuario`

Actualiza un usuario.

**Auth:** `authRequired`

**Body (todos opcionales):**
```json
{
  "cedula": "nueva-cedula",
  "nombre_hacienda": "Nuevo Nombre",
  "email": "nuevo@email.com",
  "password_hash": "nueva_password"
}
```

`role_id` no se puede cambiar (retorna `403`).

**Response 200:** Usuario actualizado (sin `password_hash`)

**Errors:** `400`, `403` (intento de cambiar rol), `404`

---

### DELETE `/api/usuarios/:id`  
### DELETE `/api/usuarios/eliminar-usuario/:id_Usuario`

Elimina un usuario (solo admin).

**Auth:** `authRequired` + `requireRole(1)`

**Response 200:**
```json
{ "message": "Usuario eliminado correctamente" }
```

**Errors:** `404`

---

## Roles (`/api/roles`)

Todos los endpoints requieren `authRequired` + `requireRole(1)` (solo admin).

### POST `/api/roles`  
### POST `/api/roles/crear-rol`

```json
{ "nombre": "nuevo-rol" }
```

**Response 201:**
```json
{ "message": "Role creado exitosamente", "role": { "id": 5, "nombre": "nuevo-rol" } }
```

### GET `/api/roles`  
### GET `/api/roles/obtener-roles`

**Response 200:** `[{ "id": 1, "nombre": "admin" }, ...]`

### PUT `/api/roles/:id`  
### PUT `/api/roles/editar-rol/:id_role`

```json
{ "nombre": "rol-actualizado" }
```

**Response 200:** Rol actualizado

**Errors:** `404`

### DELETE `/api/roles/:id`  
### DELETE `/api/roles/eliminar-rol/:id_role`

```json
{ "message": "Role eliminado correctamente" }
```

**Errors:** `404`

---

## Sectores (`/api/sectores`)

### GET `/api/sectores`  
### GET `/api/sectores/obtener-sector`

Público.

**Response 200:** `[{ "id": 1, "nombre": "Tecnologia", "color_hex": "#00AEEF" }, ...]`

---

### POST `/api/sectores`  
### POST `/api/sectores/crear-sector`

**Auth:** `authRequired` + `requireRole(1)`

```json
{ "nombre": "Fintech", "color_hex": "#123456" }
```

**Response 201:**
```json
{ "message": "Sector creado exitosamente", "sector": { "id": 1, "nombre": "Fintech", "color_hex": "#123456" } }
```

### PUT `/api/sectores/:id`  
### PUT `/api/sectores/editar-sector/:id_sector`

**Auth:** `authRequired` + `requireRole(1)`

```json
{ "nombre": "Nuevo nombre", "color_hex": "#654321" }
```

**Response 200:** Sector actualizado

**Errors:** `404`

### DELETE `/api/sectores/:id`  
### DELETE `/api/sectores/eliminar-sector/:id_sector`

**Auth:** `authRequired` + `requireRole(1)`

```json
{ "message": "Sector eliminado correctamente" }
```

**Errors:** `404`

---

## Sesiones (`/api/sesiones`)

Todos los endpoints requieren `authRequired` + `requireRole(1)` (solo admin).

### POST `/api/sesiones`  
### POST `/api/sesiones/crear-session`

```json
{
  "user_id": 1,
  "token_jwt": "eyJ...",
  "expiracion": "2026-12-31T23:59:59Z",
  "es_valido": true
}
```

**Response 201:**
```json
{ "message": "Session creada exitosamente", "session": { "id": 1, "user_id": 1, "token_jwt": "...", "expiracion": "...", "es_valido": true } }
```

### GET `/api/sesiones`  
### GET `/api/sesiones/obtener-session`

**Response 200:** Array de sesiones

### PUT `/api/sesiones/:id`  
### PUT `/api/sesiones/editar-session/:id_session`

**Errors:** `404`

### DELETE `/api/sesiones/:id`  
### DELETE `/api/sesiones/eliminar-session/:id_session`

```json
{ "message": "Session eliminada correctamente" }
```

**Errors:** `404`

---

## Startups (`/api/startups`)

### GET `/api/startups`  
### GET `/api/startups/obtener-startups`

Público. Paginación y filtros.

| Query param | Tipo | Default | Descripción |
|-------------|------|---------|-------------|
| `page` | integer | 1 | Número de página |
| `limit` | integer | 10 | Resultados por página |
| `sector_id` | integer | — | Filtro por sector |
| `fase` | string | — | Filtro: `Idea`, `Semilla`, `Serie A`, `Serie B`, `Escalamiento` |
| `search` | string | — | Búsqueda textual por `nombre_comercial` o `descripcion` |
| `sortBy` | string | `id` | Campo de ordenamiento |
| `order` | string | `DESC` | `ASC` o `DESC` |

**Response 200:**
```json
{
  "totalItems": 50,
  "totalPages": 5,
  "currentPage": 1,
  "startups": [
    { "id": 1, "user_id": 1, "nombre_comercial": "StartupX", "descripcion": "...", "fase": "Semilla", "logo_url": "...", "sector_id": 1 }
  ]
}
```

---

### POST `/api/startups`  
### POST `/api/startups/crear-startup`

**Auth:** `authRequired`

```json
{
  "user_id": 1,
  "nombre_comercial": "Mi Startup",
  "descripcion": "Descripción opcional",
  "fase": "Semilla",
  "logo_url": "https://...",
  "sector_id": 1
}
```

| Campo | Tipo | Obligatorio |
|-------|------|-------------|
| `user_id` | integer | sí |
| `nombre_comercial` | string | sí |
| `descripcion` | string | no |
| `fase` | enum | no |
| `logo_url` | string | no |
| `sector_id` | integer | no |

**Response 201:**
```json
{ "message": "Startup creada exitosamente", "startup": { ... } }
```

**Errors:** `400` (validación)

---

### PUT `/api/startups/:id`  
### PUT `/api/startups/editar-startups/:id_Startup`

**Auth:** `authRequired`

Mismos campos que POST (opcionales en la práctica).

**Response 200:** Startup actualizada

**Errors:** `404`

---

### DELETE `/api/startups/:id`  
### DELETE `/api/startups/eliminar-startup/:id_Startup`

**Auth:** `authRequired`

```json
{ "message": "Startup eliminada correctamente" }
```

**Errors:** `404`

### POST `/api/startups/:id/logo`  
### POST `/api/startups/subir-logo/:id_Startup`

Sube el logo de una startup. **Auth:** `authRequired`

**Body:** `multipart/form-data` — campo `logo` (JPG, PNG, GIF, WebP; max 5 MB)

**Response 200:**
```json
{
  "message": "Logo subido exitosamente",
  "logo_url": "https://res.cloudinary.com/.../logo.jpg",
  "startup": { ... }
}
```

---

## Inversores (`/api/inversores`)

### GET `/api/inversores`  
### GET `/api/inversores/obtener-inversores`

Público. Paginación y búsqueda.

| Query param | Tipo | Default | Descripción |
|-------------|------|---------|-------------|
| `page` | integer | 1 | Número de página |
| `limit` | integer | 10 | Resultados por página |
| `search` | string | — | Búsqueda textual por `nombre` o `sectores_interes` |
| `sortBy` | string | `id` | Campo de ordenamiento |
| `order` | string | `DESC` | `ASC` o `DESC` |

**Response 200 (paginado):**
```json
{
  "totalItems": 10,
  "totalPages": 1,
  "currentPage": 1,
  "inversores": [
    { "id": 1, "user_id": 1, "nombre": "InversorX", "presupuesto_min": 10000, "presupuesto_max": 500000, "sectores_interes": ["Fintech", "Salud"] }
  ]
}
```

> Sin parámetros de paginación, devuelve el array plano completo (legacy).

---

### POST `/api/inversores`  
### POST `/api/inversores/crear-inversor`

**Auth:** `authRequired`

```json
{
  "user_id": 1,
  "nombre": "Inversor X",
  "presupuesto_min": 10000,
  "presupuesto_max": 500000,
  "sectores_interes": ["Fintech", "Salud"]
}
```

**Response 201:**
```json
{ "message": "Inversor creado exitosamente", "inversor": { ... } }
```

---

### PUT `/api/inversores/:id`  
### PUT `/api/inversores/editar-inversor/:id_inversor`

**Auth:** `authRequired`

**Response 200:** Inversor actualizado

**Errors:** `404`

### DELETE `/api/inversores/:id`  
### DELETE `/api/inversores/eliminar-inversor/:id_inversor`

**Auth:** `authRequired`

```json
{ "message": "Inversor eliminado correctamente" }
```

**Errors:** `404`

---

## Aceleradoras (`/api/aceleradoras`)

### GET `/api/aceleradoras`  
### GET `/api/aceleradoras/obtener-aceleradora`

Público. Paginación y búsqueda.

| Query param | Tipo | Default | Descripción |
|-------------|------|---------|-------------|
| `page` | integer | 1 | Número de página |
| `limit` | integer | 10 | Resultados por página |
| `search` | string | — | Búsqueda textual por `nombre` o `programas_activos` |
| `sortBy` | string | `id` | Campo de ordenamiento |
| `order` | string | `DESC` | `ASC` o `DESC` |

**Response 200:**
```json
{
  "totalItems": 10,
  "totalPages": 1,
  "currentPage": 1,
  "aceleradoras": [
    { "id": 1, "user_id": 1, "nombre": "AceleradoraX", "programas_activos": "...", "sitio_web": "https://..." }
  ]
}
```

---

### POST `/api/aceleradoras`  
### POST `/api/aceleradoras/crear-aceleradora`

**Auth:** `authRequired`

```json
{
  "user_id": 1,
  "nombre": "Aceleradora X",
  "programas_activos": "Programa de 3 meses",
  "sitio_web": "https://aceleradorax.com"
}
```

**Response 201:**
```json
{ "message": "Aceleradora creada exitosamente", "aceleradora": { ... } }
```

---

### PUT `/api/aceleradoras/:id`  
### PUT `/api/aceleradoras/editar-aceleradora/:id_aceleradora`

**Auth:** `authRequired`

**Response 200:** Aceleradora actualizada

**Errors:** `404`

### DELETE `/api/aceleradoras/:id`  
### DELETE `/api/aceleradoras/eliminar-aceleradora/:id_aceleradora`

**Auth:** `authRequired`

```json
{ "message": "Aceleradora eliminada correctamente" }
```

**Errors:** `404`

---

## Ecosistema (`/api/ecosistemas`)

### Geolocalización

#### POST `/api/ecosistemas/crear-ecosystem`

**Auth:** `authRequired`

```json
{
  "user_id": 1,
  "latitud": 19.432608,
  "longitud": -99.133209,
  "direccion": "Ciudad de México"
}
```

**Response 201:**
```json
{ "message": "Geolocalizacion creada exitosamente", "geolocalizacion": { "id": 1, "user_id": 1, "latitud": 19.432608, "longitud": -99.133209, "direccion": "..." } }
```

#### GET `/api/ecosistemas/obtener-ecosystem`

Público. Paginación opcional con `?page=1&limit=10`. Sin parámetros devuelve array plano.

#### PUT `/api/ecosistemas/editar-ecosystem/:id_geolocalizacion`

**Auth:** `authRequired`

**Errors:** `404`

#### DELETE `/api/ecosistemas/eliminar-ecosystem/:id_geolocalizacion`

**Auth:** `authRequired`

```json
{ "message": "Geolocalizacion eliminada correctamente" }
```

**Errors:** `404`

---

### Conexiones (Grafo)

#### POST `/api/ecosistemas/conexiones`

**Auth:** `authRequired`

```json
{
  "actor_origen_id": 1,
  "actor_destino_id": 2,
  "tipo_vinculo": "Inversion"
}
```

| Campo | Tipo | Valores |
|-------|------|---------|
| `tipo_vinculo` | enum | `Inversion`, `Alianza`, `Mentoria` |

**Response 201:**
```json
{ "message": "ConexionGrafo creada exitosamente", "conexionGrafo": { ... } }
```

#### GET `/api/ecosistemas/conexiones`

Público. Paginación opcional con `?page=1&limit=10`. Sin parámetros devuelve array plano.

#### PUT `/api/ecosistemas/conexiones/:id_conexionGrafo`

**Auth:** `authRequired`

**Errors:** `404`

#### DELETE `/api/ecosistemas/conexiones/:id_conexionGrafo`

**Auth:** `authRequired`

```json
{ "message": "ConexionGrafo eliminada correctamente" }
```

**Errors:** `404`

---

### Métricas Dashboard

#### POST `/api/ecosistemas/metricas`

**Auth:** `authRequired`

```json
{
  "startup_id": 1,
  "num_empleados": 10,
  "valoracion_estimada": 500000.00,
  "fecha_reporte": "2026-01-15"
}
```

**Response 201:**
```json
{ "message": "MetricaDashboard creada exitosamente", "metricaDashboard": { ... } }
```

#### GET `/api/ecosistemas/metricas`

Público. Paginación opcional con `?page=1&limit=10`. Sin parámetros devuelve array plano.

#### PUT `/api/ecosistemas/metricas/:id_metricaDashboard`

**Auth:** `authRequired`

**Errors:** `404`

#### DELETE `/api/ecosistemas/metricas/:id_metricaDashboard`

**Auth:** `authRequired`

```json
{ "message": "MetricaDashboard eliminada correctamente" }
```

**Errors:** `404`

---

### Solicitudes

#### POST `/api/ecosistemas/solicitudes`

**Auth:** `authRequired`

```json
{
  "user_id": 1,
  "tipo": "startup",
  "comentarios_admin": "Nota opcional"
}
```

| Campo | Tipo | Valores |
|-------|------|---------|
| `tipo` | enum | `startup`, `aceleradora`, `inversor` |

`estado` por defecto: `Pendiente`.

**Response 201:**
```json
{ "message": "Solicitud creada exitosamente", "solicitud": { ... } }
```

#### GET `/api/ecosistemas/solicitudes`

Público. Paginación opcional con `?page=1&limit=10&estado=Pendiente`. Sin parámetros devuelve array plano.

#### PUT `/api/ecosistemas/solicitudes/:id_solicitud`

**Auth:** `authRequired`

**Errors:** `404`

#### DELETE `/api/ecosistemas/solicitudes/:id_solicitud`

**Auth:** `authRequired`

```json
{ "message": "Solicitud eliminada correctamente" }
```

**Errors:** `404`

#### PATCH `/api/ecosistemas/solicitudes/:id_solicitud/aprobar`

**Auth:** `authRequired` + `requireRole(1)`

Aprueba una solicitud pendiente.

```json
{ "message": "Solicitud aprobada", "solicitud": { ... } }
```

**Errors:** `404`

#### PATCH `/api/ecosistemas/solicitudes/:id_solicitud/rechazar`

**Auth:** `authRequired` + `requireRole(1)`

Rechaza una solicitud pendiente.

```json
{ "message": "Solicitud rechazada", "solicitud": { ... } }
```

**Errors:** `404`

---

## Communication (`/api/communication`)

### Contacto Público

#### POST `/api/communication/contacto-publico`

Público. Envío de formulario de contacto.

```json
{
  "nombre": "Juan Pérez",
  "email": "juan@email.com",
  "asunto": "Consulta",
  "mensaje": "Hola, me gustaría más información..."
}
```

**Response 201:**
```json
{ "message": "Mensaje de contacto publico creado exitosamente", "mensaje": { "id": 1, "nombre": "...", "email": "...", "asunto": "...", "mensaje": "...", "leido": false, "fecha_envio": "..." } }
```

#### GET `/api/communication/contacto-publico`

**Auth:** `authRequired` + `requireRole(1)`

Lista todos los mensajes de contacto. Paginación opcional con `?page=1&limit=10`. Sin parámetros devuelve array plano.

---

### Chats

#### GET `/api/communication/chats`

**Auth:** `authRequired`

Lista los chats con resumen.

**Response 200:**
```json
[{ "chat_id": 1, "totalMensajes": 5, "ultimoEnvio": "..." }]
```

#### POST `/api/communication/chats`

**Auth:** `authRequired`

Crea un nuevo chat. **No requiere body.**

```json
{ "message": "Chat creado exitosamente", "chat": { "chat_id": 2 } }
```

#### GET `/api/communication/chats/:chat_id/mensajes`

**Auth:** `authRequired`

Obtiene los mensajes de un chat.

**Response 200:** Array de mensajes ordenados por `fecha_envio` ASC

#### POST `/api/communication/chats/:chat_id/mensajes`

**Auth:** `authRequired`

Envía un mensaje a un chat.

```json
{ "emisor_id": 1, "contenido": "Hola mundo" }
```

**Response 201:**
```json
{ "message": "Mensaje enviado al chat exitosamente", "mensaje": { "id": 1, "emisor_id": 1, "chat_id": 1, "contenido": "Hola mundo", "leido": false, "fecha_envio": "..." } }
```

---

### Mensajes

#### POST `/api/communication/mensajes`

**Auth:** `authRequired`

Crea un mensaje directo.

```json
{ "emisor_id": 1, "chat_id": 1, "contenido": "Mensaje", "leido": false }
```

**Response 201:**
```json
{ "message": "Mensaje creado exitosamente", "mensaje": { ... } }
```

#### GET `/api/communication/mensajes`

**Auth:** `authRequired`

Paginación opcional con `?page=1&limit=10`. Sin parámetros devuelve array plano.

#### PUT `/api/communication/mensajes/:id_mensaje`

**Auth:** `authRequired`

```json
{ "contenido": "Actualizado", "leido": true }
```

**Response 200:** Mensaje actualizado

**Errors:** `404`

#### PUT `/api/communication/mensajes/:id_mensaje/leer`

**Auth:** `authRequired`

Marca un mensaje como leído.

```json
{ "message": "Mensaje marcado como leido", "mensaje": { ... } }
```

**Errors:** `404`

#### PUT `/api/communication/mensajes/leer-todos`

**Auth:** `authRequired`

Marca todos los mensajes de un chat como leídos.

```json
{ "chat_id": 1 }
```

**Response 200:**
```json
{ "message": "Mensajes del chat 1 marcados como leidos", "count": 5 }
```

**Errors:** `400` (falta chat_id)

#### DELETE `/api/communication/mensajes/:id_mensaje`

**Auth:** `authRequired`

```json
{ "message": "Mensaje eliminado correctamente" }
```

**Errors:** `404`

---

### Asistente IA

#### POST `/api/ai/chat`

Alias compatible con la tarea de Trello. Tambien disponible como `POST /api/chatbot/chat` y `POST /api/chatbot/ask`.

```json
{
  "message": "Recomendame startups fintech en etapa semilla"
}
```

**Response 200:**
```json
{
  "response": "Respuesta generada por JARVIS",
  "data": []
}
```

#### POST `/api/ai/classify-request`

Clasifica automaticamente una solicitud de incorporacion como `startup`, `aceleradora` o `inversor`.

```json
{
  "text": "Somos un fondo con capital para invertir en startups fintech."
}
```

**Response 200:**
```json
{
  "tipo": "inversor",
  "confianza": 0.86,
  "razon": "La solicitud menciona capital de inversion.",
  "requiere_revision": false,
  "proveedor": "local-rules"
}
```

> Para respuestas LLM reales, configurar `GEMINI_API_KEY`. Sin esa variable, la clasificacion usa reglas locales como respaldo.

### Consultas IA

#### POST `/api/communication/consultas-ia`

**Auth:** `authRequired`

```json
{
  "user_id": 1,
  "pregunta_usuario": "¿Qué es una startup?",
  "respuesta_ia": "Una startup es...",
  "modelo": "gemini-1.5-pro"
}
```

**Response 201:**
```json
{ "message": "Consulta IA creada exitosamente", "consultaIA": { ... } }
```

#### GET `/api/communication/consultas-ia`

**Auth:** `authRequired`

Paginación opcional con `?page=1&limit=10`. Sin parámetros devuelve array plano.

#### PUT `/api/communication/consultas-ia/:id_consultaIA`

**Auth:** `authRequired`

**Errors:** `404`

#### DELETE `/api/communication/consultas-ia/:id_consultaIA`

**Auth:** `authRequired`

```json
{ "message": "Consulta IA eliminada correctamente" }
```

**Errors:** `404`

---

## Notificaciones (`/api/notifications`)

Todos los endpoints requieren `authRequired`.

### GET `/api/notifications`

Lista las notificaciones del usuario autenticado.

**Response 200:** Array de notificaciones ordenadas por `fecha_creacion` DESC

### GET `/api/notifications/no-leidas`

Cuenta las notificaciones no leídas.

```json
{ "no_leidas": 3 }
```

### PUT `/api/notifications`

Marca todas las notificaciones como leídas.

```json
{ "message": "Todas las notificaciones marcadas como leidas" }
```

### PUT `/api/notifications/:id`

Marca una notificación como leída.

**Errors:** `404`

### DELETE `/api/notifications/:id`

Elimina una notificación.

```json
{ "message": "Notificacion eliminada correctamente" }
```

**Errors:** `404`

---

## Modelos de Datos (Base de Datos MySQL)

### `roles`
| Columna | Tipo |
|---------|------|
| id | INTEGER PK |
| nombre | STRING(50) UNIQUE |

### `users`
| Columna | Tipo | Notas |
|---------|------|-------|
| id | INTEGER PK | |
| cedula | STRING(20) | UNIQUE |
| nombre_hacienda | STRING(255) | |
| email | STRING(255) | UNIQUE, email |
| password_hash | TEXT | bcrypt |
| role_id | INTEGER FK | → roles.id |
| created_at | DATETIME | |

### `sessions`
| Columna | Tipo |
|---------|------|
| id | INTEGER PK |
| user_id | INTEGER FK → users.id |
| token_jwt | TEXT |
| expiracion | DATE |
| es_valido | BOOLEAN default true |

### `sectores`
| Columna | Tipo |
|---------|------|
| id | INTEGER PK |
| nombre | STRING(100) |
| color_hex | STRING(7) |

### `startups`
| Columna | Tipo | Notas |
|---------|------|-------|
| id | INTEGER PK | |
| user_id | INTEGER FK → users.id | UNIQUE |
| nombre_comercial | STRING(255) | |
| descripcion | TEXT | opcional |
| fase | ENUM | Idea, Semilla, Serie A, Serie B, Escalamiento |
| logo_url | TEXT | opcional |
| sector_id | INTEGER FK → sectores.id | opcional |

### `inversores`
| Columna | Tipo |
|---------|------|
| id | INTEGER PK |
| user_id | INTEGER FK → users.id UNIQUE |
| nombre | STRING(255) |
| presupuesto_min | DECIMAL(15,2) |
| presupuesto_max | DECIMAL(15,2) |
| sectores_interes | JSON |

### `aceleradoras`
| Columna | Tipo |
|---------|------|
| id | INTEGER PK |
| user_id | INTEGER FK → users.id UNIQUE |
| nombre | STRING(255) |
| programas_activos | TEXT |
| sitio_web | STRING(255) |

### `geolocalizacion`
| Columna | Tipo |
|---------|------|
| id | INTEGER PK |
| user_id | INTEGER FK → users.id |
| latitud | DECIMAL(10,8) |
| longitud | DECIMAL(11,8) |
| direccion | TEXT |

### `conexiones_grafo`
| Columna | Tipo |
|---------|------|
| id | INTEGER PK |
| actor_origen_id | INTEGER FK → users.id |
| actor_destino_id | INTEGER FK → users.id |
| tipo_vinculo | ENUM(Inversion, Alianza, Mentoria) |

### `solicitudes`
| Columna | Tipo |
|---------|------|
| id | INTEGER PK |
| user_id | INTEGER FK → users.id |
| tipo | ENUM(startup, aceleradora, inversor) |
| estado | ENUM(Pendiente, Aprobada, Rechazada) default Pendiente |
| comentarios_admin | TEXT |

### `metricas_dashboard`
| Columna | Tipo |
|---------|------|
| id | INTEGER PK |
| startup_id | INTEGER FK → startups.id |
| num_empleados | INTEGER |
| valoracion_estimada | DECIMAL(15,2) |
| fecha_reporte | DATEONLY |

### `mensajes`
| Columna | Tipo |
|---------|------|
| id | INTEGER PK |
| emisor_id | INTEGER FK → users.id |
| chat_id | INTEGER |
| contenido | TEXT |
| leido | BOOLEAN default false |
| fecha_envio | DATETIME |

### `consultas_ia`
| Columna | Tipo |
|---------|------|
| id | INTEGER PK |
| user_id | INTEGER FK → users.id |
| pregunta_usuario | TEXT |
| respuesta_ia | TEXT |
| modelo | STRING(100) |

### `notificaciones`
| Columna | Tipo |
|---------|------|
| id | INTEGER PK |
| user_id | INTEGER FK → users.id |
| titulo | STRING(200) |
| mensaje | TEXT |
| tipo | STRING(100) |
| leido | BOOLEAN default false |
| fecha_creacion | DATETIME |

### `mensajes_contacto_publico`
| Columna | Tipo |
|---------|------|
| id | INTEGER PK |
| nombre | STRING(150) |
| email | STRING(150) |
| asunto | STRING(200) |
| mensaje | TEXT |
| leido | BOOLEAN default false |
| fecha_envio | DATETIME |

---

## Funcionalidades Avanzadas

### 1. Búsqueda por texto y filtros dinámicos

Todos los endpoints GET de listado soportan paginación y búsqueda opcional:

| Endpoint | Parámetros de búsqueda |
|----------|----------------------|
| `GET /api/startups` | `search` (nombre_comercial, descripcion), `sector_id`, `fase` |
| `GET /api/aceleradoras` | `search` (nombre, programas_activos) |
| `GET /api/inversores` | `search` (nombre, sectores_interes) |
| `GET /api/ecosistemas/obtener-ecosystem` | `page`, `limit` |
| `GET /api/ecosistemas/conexiones` | `page`, `limit` |
| `GET /api/ecosistemas/solicitudes` | `page`, `limit`, `estado` (Pendiente/Aprobada/Rechazada) |
| `GET /api/ecosistemas/metricas` | `page`, `limit` |
| `GET /api/communication/mensajes` | `page`, `limit` |
| `GET /api/communication/contacto-publico` | `page`, `limit` |
| `GET /api/communication/consultas-ia` | `page`, `limit` |

Cuando NO se usa ningún parámetro (`page`, `limit`, `search`, `estado`), el endpoint devuelve el array plano completo (comportamiento legacy).

**Parámetros comunes:**

| Parámetro | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Número de página |
| `limit` | integer | 10 | Resultados por página |
| `sortBy` | string | `id` | Campo de ordenamiento |
| `order` | string | `DESC` | `ASC` o `DESC` |

**Ejemplo:**
```
GET /api/startups/obtener-startups?search=fintech&page=1&limit=20&sortBy=nombre_comercial&order=ASC
```

---

### 2. Subida de logos (Multer + Cloudinary)

Endpoint protegido:

| Método | URL | Descripción |
|--------|-----|-------------|
| `POST` | `/api/startups/:id/logo` | Subir logo de startup |
| `POST` | `/api/startups/subir-logo/:id_Startup` | Alias legacy |

**Headers:** `Authorization: Bearer <token>`

**Body:** `multipart/form-data` con campo `logo` (archivo de imagen).

**Formatos permitidos:** JPG, PNG, GIF, WebP. **Tamaño máximo:** 5 MB.

**Respuesta 200:**
```json
{
  "message": "Logo subido exitosamente",
  "logo_url": "https://res.cloudinary.com/.../logo.jpg",
  "startup": { ... }
}
```

#### Cómo activar Cloudinary

1. Crear cuenta gratuita en https://cloudinary.com
2. Agregar al archivo `.env`:
   ```
   CLOUDINARY_CLOUD_NAME=tu_cloud_name
   CLOUDINARY_API_KEY=tu_api_key
   CLOUDINARY_API_SECRET=tu_api_secret
   ```
3. Reiniciar el servidor.

> **Fallback local:** Si no se configuran las variables de Cloudinary, los archivos se guardan en `backend/uploads/` y se sirven vía `GET /uploads/<filename>`. La URL se construye con `BASE_URL` o `http://localhost:3007`.

---

### 3. Envío de correos (Nodemailer)

Al aprobar o rechazar una solicitud (`PATCH /api/ecosistemas/solicitudes/:id/aprobar` y `PATCH /api/ecosistemas/solicitudes/:id/rechazar`), el sistema envía un correo de notificación al usuario solicitante.

#### Cómo activar

Agregar al archivo `.env`:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tu_correo@gmail.com
SMTP_PASS=tu_contraseña_de_aplicacion
SMTP_FROM=tu_correo@gmail.com
```

Para Gmail se necesita una **contraseña de aplicación** (no la contraseña normal):
1. Ir a https://myaccount.google.com/security
2. Activar "Verificación en dos pasos"
3. Ir a "Contraseñas de aplicaciones"
4. Generar una para "Correo" y usarla como `SMTP_PASS`

> **Sin configuración:** Si no hay variables SMTP, el envío se omite silenciosamente (no se produce error).

---

### 4. Archivo `.env.example`

Se incluye un archivo `backend/.env.example` con todas las variables documentadas. Copiarlo a `.env` y ajustar valores:

```bash
cp backend/.env.example backend/.env
```

## Códigos de Error HTTP

| Código | Significado |
|--------|-------------|
| 200 | OK |
| 201 | Creado |
| 400 | Error de validación (body inválido) |
| 401 | No autenticado (token faltante/inválido) |
| 403 | No autorizado (rol sin permiso) |
| 404 | Recurso no encontrado |
| 500 | Error interno del servidor |
