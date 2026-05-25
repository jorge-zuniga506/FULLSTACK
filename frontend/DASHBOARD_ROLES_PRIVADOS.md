# Implementacion Directa: Rutas Exactas de Cambios

## Mapa rapido (para no buscar en todo el proyecto)

## Backend - editar estos archivos existentes
- `backend/app.js`
  - Registrar nuevas rutas:
  - `app.use(`${prefix}/identity`, IdentityRoutes)`
  - `app.use(`${prefix}/dashboard`, DashboardRoutes)`
- `backend/routes/AuthRoutes.js`
  - Agregar `POST /verify-role-code` (verificacion extra si el rol no tiene acceso).
- `backend/controllers/AuthController.js`
  - En login devolver: `token`, `usuario`, `redirectPath`, `requiresExtraVerification`.
  - Agregar controlador `verifyRoleCode`.
- `backend/services/AuthService.js`
  - Mapear `role_id` -> ruta de dashboard.
  - Validar cuando requiere codigo extra por rol.
- `backend/routes/UserRoutes.js`
  - Mantener `POST /` y agregar alias claro `POST /register`.
- `backend/controllers/UserController.js`
  - En `crearUsuario`: generar codigo de verificacion y devolverlo al frontend.
- `backend/services/UserService.js`
  - Generar y guardar codigo por rol (ejemplo visual: `STARTUPSAA99` en entorno demo).
  - Marcar `survey_completed`.
- `backend/models/User.js`
  - Agregar campos de seguridad:
  - `two_factor_code`, `two_factor_expires_at`, `survey_completed`, `is_role_whitelisted`.
- `backend/middlewares/validators.js`
  - Validar cedula 9-12 digitos.
  - Validar `role_id` permitido (`1,2,3,4`).

## Backend - crear estos archivos nuevos
- `backend/routes/IdentityRoutes.js`
  - Ruta: `GET /hacienda/:cedula`.
- `backend/controllers/IdentityController.js`
  - Consulta a Hacienda y responde `nombreCompleto`.
- `backend/services/HaciendaService.js`
  - Llamada a `https://api.hacienda.go.cr/fe/ae?identificacion=<CEDULA>`.
- `backend/routes/DashboardRoutes.js`
  - Endpoints por rol:
  - `GET /startup`
  - `GET /aceleradora`
  - `GET /inversor`
  - `GET /admin`
- `backend/controllers/DashboardController.js`
  - Respuesta base para cada dashboard segun rol.
- `backend/migrations/20260522000100-add-user-security-fields.js`
  - Migracion para nuevos campos en `users`.

## Frontend - editar estos archivos existentes
- `frontend/src/components/Auth/RegisterForm.jsx`
  - Primer campo: cedula.
  - Boton `Validar cedula`.
  - Llamar a backend y autocompletar `nombre_hacienda`.
  - Al enviar registro, mostrar `SweetAlert` final con codigo.
- `frontend/src/context/AuthContext.jsx`
  - Usar `POST /api/auth/login` y leer `redirectPath`.
  - Guardar `requiresExtraVerification` (debe venir siempre en `true` para rutas privadas).
  - En registro, aceptar `verificationCode` de backend.
- `frontend/src/components/Auth/LoginForm.jsx`
  - Si login ok:
  - Siempre enviar a `/verify-role-code`.
  - Solo despues de validar codigo: `navigate(redirectPath)`.
- `frontend/src/routes/AppRoutes.jsx`
  - Crear rutas privadas por rol:
  - `/dashboard/startup`
  - `/dashboard/aceleradora`
  - `/dashboard/inversor`
  - `/dashboard/admin`
  - Redireccion de `/dashboard` segun `user.role_id`.
- `frontend/src/components/Layout/DashboardLayout.jsx`
  - Sidebar dinamico por rol (menu diferente para cada rol).
- `frontend/src/styles/Register.css`
  - Estilo para bloque de validacion de cedula y estado de carga.
- `frontend/src/services/apiService.js`
  - Agregar helper `getOne(endpoint, token)` o usar `create/getAll` para endpoint de cedula.

## Frontend - crear estos archivos nuevos
- `frontend/src/components/Auth/VerifyRoleCodeForm.jsx`
  - Formulario para ingresar codigo extra.
- `frontend/src/pages/Auth/VerifyRoleCode.jsx`
  - Pagina de verificacion de doble factor por rol.
- `frontend/src/pages/Dashboard/StartupDashboard.jsx`
- `frontend/src/pages/Dashboard/AceleradoraDashboard.jsx`
- `frontend/src/pages/Dashboard/InversorDashboard.jsx`
- `frontend/src/pages/Dashboard/AdminDashboard.jsx`
- `frontend/src/routes/RoleRouteGuard.jsx`
  - Guard de rol con redireccion a `/verify-role-code`.
  - Debe pedir codigo aunque sea ruta del mismo rol.

## Dependencias a instalar
- `frontend/package.json`
  - Agregar `sweetalert2`.
- `backend/package.json`
  - Si no usas `fetch` nativo de Node 18, agregar `axios`.

---

## Endpoints exactos que vas a usar

## Identidad (cedula)
- `GET /api/identity/hacienda/:cedula`
- `GET /api/v1/identity/hacienda/:cedula`

## Registro y login
- `POST /api/usuarios`
- `POST /api/usuarios/register`
- `POST /api/auth/login`
- `POST /api/auth/verify-role-code`
- `GET /api/auth/me`

## Dashboards por rol
- `GET /api/dashboard/startup`
- `GET /api/dashboard/aceleradora`
- `GET /api/dashboard/inversor`
- `GET /api/dashboard/admin`

---

## Nota de roles en tu proyecto actual
- `role_id = 1` -> Admin
- `role_id = 2` -> Startup / Emprendedor
- `role_id = 3` -> Aceleradora
- `role_id = 4` -> Inversor (equivalente a Funder)

---

## Flujo exacto que debes dejar funcionando
1. Registro inicia con cedula.
2. Se consulta Hacienda y se autocompleta nombre.
3. Usuario termina encuesta por rol.
4. Backend devuelve codigo de doble verificacion.
5. Frontend muestra SweetAlert: `ESTE ES SU CODIGO DE DOBLE VERIFICACION`.
6. Login envia siempre a verificacion de codigo antes de cualquier dashboard.
7. Si el codigo es valido, entra al dashboard de su rol.
8. Si intenta entrar a ruta de otro rol, tambien debe validar codigo (siempre obligatorio).

## Regla de seguridad obligatoria
- Cualquier usuario autenticado debe pasar `POST /api/auth/verify-role-code` para abrir cualquier ruta privada, incluso su propio dashboard.
- Si intenta ruta de otro rol, igualmente se exige codigo y adicionalmente se bloquea por permisos de rol.
- Si no valida el codigo, acceso denegado y redireccion a `/verify-role-code`.
