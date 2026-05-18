const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ecosistema Startups API',
      version: '1.0.0',
      description: `
API RESTful para la gestión de un ecosistema de startups, aceleradoras, inversores y sus relaciones.

## Autenticación
La mayoría de endpoints requieren un token JWT en el header:
\`\`\`
Authorization: Bearer <token>
\`\`\`

## Roles
| ID | Rol |
|----|-----|
| 1  | Admin |
| 2  | Startup |
| 3  | Aceleradora |
| 4  | Inversor |

Obtén el token mediante \`POST /auth/login\`.
      `.trim(),
    },
    servers: [
      { url: 'http://localhost:3007/api/v1', description: 'Versionada' },
      { url: 'http://localhost:3007/api', description: 'Legacy' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            errors: { type: 'array', items: { type: 'object' } },
            error: { type: 'string' },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'admin@test.com' },
            password: { type: 'string', format: 'password', example: '123456' },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            token: { type: 'string' },
            usuario: { '$ref': '#/components/schemas/User' },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            cedula: { type: 'string', maxLength: 20 },
            nombre_hacienda: { type: 'string' },
            email: { type: 'string', format: 'email' },
            role_id: { type: 'integer' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        UserInput: {
          type: 'object',
          required: ['cedula', 'nombre_hacienda', 'email', 'password_hash', 'role_id'],
          properties: {
            cedula: { type: 'string', maxLength: 20, example: '12345678' },
            nombre_hacienda: { type: 'string', example: 'Juan Pérez' },
            email: { type: 'string', format: 'email', example: 'user@email.com' },
            password_hash: { type: 'string', format: 'password', example: 'mi_password', minLength: 6 },
            role_id: { type: 'integer', description: '1=admin, 2=startup, 3=aceleradora, 4=inversor', example: 2 },
          },
        },
        Startup: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            user_id: { type: 'integer' },
            nombre_comercial: { type: 'string' },
            descripcion: { type: 'string' },
            fase: { type: 'string', enum: ['Idea', 'Semilla', 'Serie A', 'Serie B', 'Escalamiento'] },
            logo_url: { type: 'string' },
            sector_id: { type: 'integer' },
          },
        },
        StartupInput: {
          type: 'object',
          required: ['user_id', 'nombre_comercial'],
          properties: {
            user_id: { type: 'integer', example: 1 },
            nombre_comercial: { type: 'string', example: 'TechNova' },
            descripcion: { type: 'string', example: 'Startup de IA' },
            fase: { type: 'string', enum: ['Idea', 'Semilla', 'Serie A', 'Serie B', 'Escalamiento'], example: 'Semilla' },
            logo_url: { type: 'string', example: 'https://...' },
            sector_id: { type: 'integer', example: 1 },
          },
        },
        StartupListResponse: {
          type: 'object',
          properties: {
            totalItems: { type: 'integer' },
            totalPages: { type: 'integer' },
            currentPage: { type: 'integer' },
            startups: { type: 'array', items: { '$ref': '#/components/schemas/Startup' } },
          },
        },
        Aceleradora: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            user_id: { type: 'integer' },
            nombre: { type: 'string' },
            programas_activos: { type: 'string' },
            sitio_web: { type: 'string' },
          },
        },
        Inversor: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            user_id: { type: 'integer' },
            nombre: { type: 'string' },
            presupuesto_min: { type: 'number', format: 'float' },
            presupuesto_max: { type: 'number', format: 'float' },
            sectores_interes: { type: 'array', items: { type: 'string' } },
          },
        },
        Role: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            nombre: { type: 'string' },
          },
        },
        Sector: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            nombre: { type: 'string' },
            color_hex: { type: 'string' },
          },
        },
        Solicitud: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            user_id: { type: 'integer' },
            tipo: { type: 'string', enum: ['startup', 'aceleradora', 'inversor'] },
            estado: { type: 'string', enum: ['Pendiente', 'Aprobada', 'Rechazada'] },
            comentarios_admin: { type: 'string' },
          },
        },
      },
    },
    paths: {
      // ─── Auth ──────────────────────────────────────────────────────────────
      '/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Iniciar sesión',
          requestBody: { content: { 'application/json': { schema: { '$ref': '#/components/schemas/LoginRequest' } } } },
          responses: {
            200: { description: 'Login exitoso', content: { 'application/json': { schema: { '$ref': '#/components/schemas/LoginResponse' } } } },
            400: { description: 'Campos faltantes' },
            401: { description: 'Credenciales inválidas' },
          },
        },
      },
      '/auth/logout': {
        post: {
          tags: ['Auth'],
          summary: 'Cerrar sesión',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Logout exitoso' },
            401: { description: 'No autenticado' },
          },
        },
      },
      '/auth/me': {
        get: {
          tags: ['Auth'],
          summary: 'Obtener datos del usuario autenticado',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Datos del usuario', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' }, user: { '$ref': '#/components/schemas/User' } } } } } },
            401: { description: 'No autenticado' },
          },
        },
      },

      // ─── Usuarios ──────────────────────────────────────────────────────────
      '/usuarios': {
        get: {
          tags: ['Usuarios'],
          summary: 'Listar usuarios (admin)',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Array de usuarios' }, 403: { description: 'No autorizado' } },
        },
        post: {
          tags: ['Usuarios'],
          summary: 'Registrar usuario (público)',
          requestBody: { content: { 'application/json': { schema: { '$ref': '#/components/schemas/UserInput' } } } },
          responses: { 201: { description: 'Usuario creado' }, 400: { description: 'Error de validación' } },
        },
      },
      '/usuarios/{id}': {
        put: {
          tags: ['Usuarios'],
          summary: 'Actualizar usuario',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Usuario actualizado' }, 404: { description: 'No encontrado' } },
        },
        delete: {
          tags: ['Usuarios'],
          summary: 'Eliminar usuario (admin)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Usuario eliminado' }, 404: { description: 'No encontrado' } },
        },
      },

      // ─── Startups ──────────────────────────────────────────────────────────
      '/startups': {
        get: {
          tags: ['Startups'],
          summary: 'Listar startups (público)',
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
            { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Busca en nombre_comercial y descripcion' },
            { name: 'sector_id', in: 'query', schema: { type: 'integer' } },
            { name: 'fase', in: 'query', schema: { type: 'string', enum: ['Idea', 'Semilla', 'Serie A', 'Serie B', 'Escalamiento'] } },
            { name: 'sortBy', in: 'query', schema: { type: 'string', default: 'id' } },
            { name: 'order', in: 'query', schema: { type: 'string', enum: ['ASC', 'DESC'], default: 'DESC' } },
          ],
          responses: { 200: { description: 'Lista paginada', content: { 'application/json': { schema: { '$ref': '#/components/schemas/StartupListResponse' } } } } },
        },
        post: {
          tags: ['Startups'],
          summary: 'Crear startup',
          security: [{ bearerAuth: [] }],
          requestBody: { content: { 'application/json': { schema: { '$ref': '#/components/schemas/StartupInput' } } } },
          responses: { 201: { description: 'Startup creada' }, 400: { description: 'Error de validación' } },
        },
      },
      '/startups/{id}': {
        put: {
          tags: ['Startups'],
          summary: 'Editar startup',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: { content: { 'application/json': { schema: { '$ref': '#/components/schemas/StartupInput' } } } },
          responses: { 200: { description: 'Startup actualizada' }, 404: { description: 'No encontrada' } },
        },
        delete: {
          tags: ['Startups'],
          summary: 'Eliminar startup',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Startup eliminada' }, 404: { description: 'No encontrada' } },
        },
      },
      '/startups/{id}/logo': {
        post: {
          tags: ['Startups'],
          summary: 'Subir logo de startup',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: {
            content: { 'multipart/form-data': { schema: { type: 'object', properties: { logo: { type: 'string', format: 'binary' } } } } },
          },
          responses: { 200: { description: 'Logo subido' } },
        },
      },

      // ─── Aceleradoras ──────────────────────────────────────────────────────
      '/aceleradoras': {
        get: {
          tags: ['Aceleradoras'],
          summary: 'Listar aceleradoras (público)',
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
            { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Busca en nombre y programas_activos' },
            { name: 'sortBy', in: 'query', schema: { type: 'string', default: 'id' } },
            { name: 'order', in: 'query', schema: { type: 'string', enum: ['ASC', 'DESC'], default: 'DESC' } },
          ],
          responses: { 200: { description: 'Lista paginada' } },
        },
        post: {
          tags: ['Aceleradoras'],
          summary: 'Crear aceleradora',
          security: [{ bearerAuth: [] }],
          responses: { 201: { description: 'Aceleradora creada' } },
        },
      },
      '/aceleradoras/{id}': {
        put: { tags: ['Aceleradoras'], summary: 'Editar aceleradora', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Aceleradora actualizada' } } },
        delete: { tags: ['Aceleradoras'], summary: 'Eliminar aceleradora', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Aceleradora eliminada' } } },
      },

      // ─── Inversores ────────────────────────────────────────────────────────
      '/inversores': {
        get: {
          tags: ['Inversores'],
          summary: 'Listar inversores (público)',
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
            { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Busca en nombre y sectores_interes' },
          ],
          responses: { 200: { description: 'Lista paginada' } },
        },
        post: { tags: ['Inversores'], summary: 'Crear inversor', security: [{ bearerAuth: [] }], responses: { 201: { description: 'Inversor creado' } } },
      },
      '/inversores/{id}': {
        put: { tags: ['Inversores'], summary: 'Editar inversor', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Inversor actualizado' } } },
        delete: { tags: ['Inversores'], summary: 'Eliminar inversor', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Inversor eliminado' } } },
      },

      // ─── Roles ─────────────────────────────────────────────────────────────
      '/roles': {
        get: { tags: ['Roles'], summary: 'Listar roles (admin)', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Array de roles' } } },
        post: { tags: ['Roles'], summary: 'Crear rol (admin)', security: [{ bearerAuth: [] }], responses: { 201: { description: 'Rol creado' } } },
      },
      '/roles/{id}': {
        put: { tags: ['Roles'], summary: 'Editar rol (admin)', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Rol actualizado' } } },
        delete: { tags: ['Roles'], summary: 'Eliminar rol (admin)', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Rol eliminado' } } },
      },

      // ─── Sectores ──────────────────────────────────────────────────────────
      '/sectores': {
        get: { tags: ['Sectores'], summary: 'Listar sectores (público)', responses: { 200: { description: 'Array de sectores' } } },
        post: { tags: ['Sectores'], summary: 'Crear sector (admin)', security: [{ bearerAuth: [] }], responses: { 201: { description: 'Sector creado' } } },
      },
      '/sectores/{id}': {
        put: { tags: ['Sectores'], summary: 'Editar sector (admin)', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Sector actualizado' } } },
        delete: { tags: ['Sectores'], summary: 'Eliminar sector (admin)', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Sector eliminado' } } },
      },

      // ─── Ecosistema ────────────────────────────────────────────────────────
      '/ecosistemas/obtener-ecosystem': {
        get: { tags: ['Ecosistema'], summary: 'Listar geolocalizaciones (público)', parameters: [{ name: 'page', in: 'query', schema: { type: 'integer' } }, { name: 'limit', in: 'query', schema: { type: 'integer' } }], responses: { 200: { description: 'Geolocalizaciones' } } },
        post: { tags: ['Ecosistema'], summary: 'Crear geolocalización', security: [{ bearerAuth: [] }], responses: { 201: { description: 'Geolocalización creada' } } },
      },
      '/ecosistemas/conexiones': {
        get: { tags: ['Ecosistema'], summary: 'Listar conexiones (público)', responses: { 200: { description: 'Conexiones' } } },
        post: { tags: ['Ecosistema'], summary: 'Crear conexión', security: [{ bearerAuth: [] }], responses: { 201: { description: 'Conexión creada' } } },
      },
      '/ecosistemas/solicitudes': {
        get: { tags: ['Ecosistema'], summary: 'Listar solicitudes (público)', parameters: [{ name: 'estado', in: 'query', schema: { type: 'string', enum: ['Pendiente', 'Aprobada', 'Rechazada'] } }], responses: { 200: { description: 'Solicitudes' } } },
        post: { tags: ['Ecosistema'], summary: 'Crear solicitud', security: [{ bearerAuth: [] }], responses: { 201: { description: 'Solicitud creada' } } },
      },
      '/ecosistemas/solicitudes/{id}/aprobar': {
        patch: { tags: ['Ecosistema'], summary: 'Aprobar solicitud (admin)', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Solicitud aprobada' } } },
      },
      '/ecosistemas/solicitudes/{id}/rechazar': {
        patch: { tags: ['Ecosistema'], summary: 'Rechazar solicitud (admin)', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Solicitud rechazada' } } },
      },
      '/ecosistemas/metricas': {
        get: { tags: ['Ecosistema'], summary: 'Listar métricas (público)', responses: { 200: { description: 'Métricas' } } },
        post: { tags: ['Ecosistema'], summary: 'Crear métrica', security: [{ bearerAuth: [] }], responses: { 201: { description: 'Métrica creada' } } },
      },

      // ─── Communication ─────────────────────────────────────────────────────
      '/communication/contacto-publico': {
        get: { tags: ['Communication'], summary: 'Listar mensajes de contacto (admin)', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Mensajes' } } },
        post: { tags: ['Communication'], summary: 'Enviar formulario de contacto (público)', responses: { 201: { description: 'Mensaje enviado' } } },
      },
      '/communication/chats': {
        get: { tags: ['Communication'], summary: 'Listar chats', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Chats' } } },
        post: { tags: ['Communication'], summary: 'Crear chat', security: [{ bearerAuth: [] }], responses: { 201: { description: 'Chat creado' } } },
      },
      '/communication/mensajes': {
        get: { tags: ['Communication'], summary: 'Listar mensajes', security: [{ bearerAuth: [] }], parameters: [{ name: 'page', in: 'query', schema: { type: 'integer' } }, { name: 'limit', in: 'query', schema: { type: 'integer' } }], responses: { 200: { description: 'Mensajes' } } },
        post: { tags: ['Communication'], summary: 'Enviar mensaje', security: [{ bearerAuth: [] }], responses: { 201: { description: 'Mensaje enviado' } } },
      },
      '/communication/consultas-ia': {
        get: { tags: ['Communication'], summary: 'Listar consultas IA', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Consultas' } } },
        post: { tags: ['Communication'], summary: 'Crear consulta IA', security: [{ bearerAuth: [] }], responses: { 201: { description: 'Consulta creada' } } },
      },

      // ─── Notificaciones ────────────────────────────────────────────────────
      '/notifications': {
        get: { tags: ['Notificaciones'], summary: 'Listar notificaciones del usuario', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Notificaciones' } } },
        put: { tags: ['Notificaciones'], summary: 'Marcar todas como leídas', security: [{ bearerAuth: [] }], responses: { 200: { description: 'OK' } } },
      },
      '/notifications/no-leidas': {
        get: { tags: ['Notificaciones'], summary: 'Contar notificaciones no leídas', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Conteo' } } },
      },
      '/notifications/{id}': {
        put: { tags: ['Notificaciones'], summary: 'Marcar notificación como leída', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Actualizada' } } },
        delete: { tags: ['Notificaciones'], summary: 'Eliminar notificación', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Eliminada' } } },
      },
    },
  },
  apis: [],
};

module.exports = swaggerJsdoc(options);
