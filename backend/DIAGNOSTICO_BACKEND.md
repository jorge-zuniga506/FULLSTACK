# Diagnóstico del Backend: estado actual y correcciones aplicadas

Fecha del diagnóstico: 18 de mayo de 2026
Última actualización: 18 de mayo de 2026
Ruta analizada: `backend/`

## Resumen rápido

El backend presentaba problemas de estabilidad y consistencia. Con las correcciones aplicadas quedó **100% estable** y las **67 pruebas pasan correctamente**. Todos los puntos del diagnóstico original fueron resueltos.

Evidencia principal de ejecución:

- `npm test -- --runInBand`
- Resultado: **11 suites**, **11 pasan**
- Tests: **67 total**, **67 pasan**
- **0 dependencias entre tests** — cada prueba crea sus propios datos de forma independiente

## Puntos resueltos

### 1) El backend rompe en pruebas por dependencias de datos inexistentes (CRÍTICO) — RESUELTO

Todos los tests crean explícitamente los registros padre (Role, User, Sector) antes de usar sus IDs como FK. Ningún test usa IDs hardcodeados sin respaldo en DB.

### 2) Diseño de tests encadenados y frágiles (CRÍTICO) — RESUELTO

**10/10 archivos de test refactorizados** para usar datos independientes por prueba:

| Archivo | Estrategia |
|---|---|
| `startup.test.js` | Helper `createStartupEntity()` con contador único |
| `aceleradora.test.js` | Helper `createAceleradoraEntity()` con contador único |
| `inversor.test.js` | Helper `createInversorEntity()` con contador único |
| `ecosystem.test.js` | Helpers con datos únicos por test |
| `user.test.js` | Helper `createTestUser()` con cedula/email únicos |
| `auth.test.js` | Usuario creado en el mismo test de login |
| `role.test.js` | Helper `createTestRole()` con nombre único |
| `sector.test.js` | Helper `createTestSector()` con nombre único |
| `session.test.js` | Helper `createSessionUser()` + creación de sesión por test |
| `communication.test.js` | Helpers `createCommUser()` + `createChat()` con datos únicos |

Ya no existe ninguna variable `createdXId` compartida entre pruebas.

### 3) Inconsistencias de rutas/nomenclatura (ALTO) — RESUELTO

**Tipos corregidos**: `editar-ecosytem` → `editar-ecosystem` (en controllers y routes).

**Rutas REST canónicas agregadas** a los 7 módulos principales, manteniendo backward compatibility con aliases legacy:

| Módulo | Canonical REST | Legacy |
|---|---|---|
| `StartupRoutes` | `POST/GET /`, `PUT/DELETE /:id` | `crear-startup`, `obtener-startups`, etc. |
| `AceleradoraRoutes` | `POST/GET /`, `PUT/DELETE /:id` | `crear-aceleradora`, `obtener-aceleradora`, etc. |
| `InversorRoutes` | `POST/GET /`, `PUT/DELETE /:id` | `crear-inversor`, `obtener-inversores`, etc. |
| `UserRoutes` | `POST/GET /`, `PUT/DELETE /:id` | `crear-usuario`, `obtener-usuario`, etc. |
| `SessionRoutes` | `POST/GET /`, `PUT/DELETE /:id` | `crear-session`, `obtener-session`, etc. |
| `SectorRoutes` | `POST/GET /`, `PUT/DELETE /:id` | `crear-sector`, `obtener-sector`, etc. |
| `RoleRoutes` | `POST/GET /`, `PUT/DELETE /:id` | `crear-rol`, `obtener-roles`, etc. |

Los controladores aceptan tanto `:id` (canonical) como el parámetro legacy (`:id_Usuario`, `:id_session`, etc.) mediante helpers como `getUserId(params)`.

### 4) Arranque de app mezcla responsabilidades (ALTO) — RESUELTO

`app.js` (38 líneas) es una fábrica pura de Express. Todo bootstrap (DB sync, seed de roles, server listen) se movió a `server.js`.

### 5) Desalineación entre validación de roles y carga de hooks (MEDIO-ALTO) — RESUELTO

`backend/index.js` línea 4 hace `require('./models/Profiles')` como side-effect garantizado, que ejecuta `attachRoleValidation()` en los modelos Startup, Aceleradora e Inversor antes de cualquier uso.

### 6) Señales de deuda técnica en codificación/encoding (MEDIO) — RESUELTO

Todos los caracteres no-ASCII en el código fuente son UTF-8 válido (acentos, ñ, etc.). No hay caracteres corruptos.

### 7) Pipeline de test forzado a cerrar procesos (MEDIO) — RESUELTO

`package.json` usa `--detectOpenHandles` en lugar de `--forceExit`. Sin rastro de `--forceExit`.

### 8) Mensaje de conexión engañoso en test (BAJO-MEDIO) — RESUELTO

`config/db.js`:
- Solo log cuando `NODE_ENV !== 'test'`
- Usa `sequelize.getDialect()` dinámico en vez de `'MySQL'` hardcodeado

## Estado actual: 100%

- **11 suites**, **67 tests**: todos pasan
- **0 dependencias entre pruebas**
- **REST canónico + legacy** en los 7 módulos principales
- **Sin `--forceExit`**, **sin logs engañosos**, **sin caracteres corruptos**

## Resumen final del diagnóstico

Los 8 puntos fueron **resueltos completamente**. No quedan issues abiertos del diagnóstico original.

## Qué queda recomendado (mejora continua, no bloqueo)

1. Migrar consumidores frontend hacia las rutas REST canónicas y luego retirar aliases legacy.
2. Mantener la práctica de datos independientes por test en nuevas suites.
