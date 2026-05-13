# Mapeo de Consumo de APIs (Frontend)

Este documento detalla la relación entre las páginas/componentes del frontend y las funciones consumidas desde `Services.jsx`.

---

## 🛠️ Servicios Disponibles en `Services.jsx`

El archivo `Services.jsx` centraliza la comunicación con el servidor (actualmente `json-server` en el puerto 3001). Los endpoints principales son:

- **Administradores**: `get`, `post`, `put`, `patch`, `delete`.
- **Solicitudes (Startups)**: `get`, `post`, `put`, `patch`, `delete`.
- **Startups**: `get`, `post`, `put`, `patch`, `delete`.
- **Solicitudes Aceleradoras**: `get`, `post`, `put`, `patch`, `delete`.
- **Aceleradoras**: `get`, `post`, `put`, `patch`, `delete`.
- **Inversores**: `get`, `post`, `put`, `patch`, `delete`.
- **Mensajes Contacto**: `get`, `post`, `delete`.
- **Chats (S-A / I-S)**: `get`, `post`, `put`, `patch`, `delete`.
- **Media**: `uploadImage` (Cloudinary).

---

## 📂 Consumo por Páginas y Componentes

A continuación se desglosa qué APIs consume cada ruta definida en `Routing.jsx`.

### 1. Autenticación y Registro

| Ruta | Página | Componente | APIs de `Services.jsx` Consumidas |
| :--- | :--- | :--- | :--- |
| `/Login` | `Login` | `LoginForm.jsx` | `getAdministradores`, `getStartups`, `getInversores`, `getAceleradoras` |
| `/Register` | `Register` | `RegisterForm.jsx` | `postInversores` |
| `/SolicitudStartup` | `SolicitudStartup` | `SolicitudForm.jsx` | `uploadImage`, `postSolicitudes` |
| `/SolicitudAceleradora` | `SolicitudAceleradora` | `SolicitudAceleradoraForm.jsx` | `postSolicitudesAceleradoras` |

### 2. Paneles Privados (Dashboard)

| Ruta | Página | Componente | APIs de `Services.jsx` Consumidas |
| :--- | :--- | :--- | :--- |
| `/PerfilPrivadoStartup` | `PaginaPerfilPrivadoStartup` | `PerfilPrivadoStartup.jsx` | `getStartups`, `putStartup`, `patchStartups` |
| `/PerfilPrivadoAceleradora` | `PaginaPerfilPrivadoAceleradora` | `PerfilPrivadoAceleradora.jsx` | `getAceleradoras`, `putAceleradoras`, `patchAceleradoras` |
| `/PerfilPrivadoInversor` | `PaginaPerfilPrivadoInversor` | `PerfilPrivadoInversor.jsx` | `getInversores`, `putInversores`, `patchInversores` |

### 3. Exploración y Mapas

| Ruta | Página | Componente | APIs de `Services.jsx` Consumidas |
| :--- | :--- | :--- | :--- |
| `/Mapa` | `Mapa` | `MapaStartups.jsx` | `getStartups` |
| `/PrincipalAceleradoras` | `PrincipalAceleradoras` | `MapaParaAceleradoras.jsx` | `getStartups` |
| `/PrincipalAdmin` | `PrincipalAdmin` | `MapaAdmin.jsx` | `getStartups` |
| `/AceleradorasBuscador` | `AceleradorasBuscador` | `BuscadorDeAceleradoras.jsx` | `getAceleradoras` |
| `/PublicoStartups` | `PublicoStartups` | `PerfilPublicoStartups.jsx` | `getStartups` |
| `/PublicoAceleradoras` | `PublicoAceleradoras` | `PerfilPublicoAceleradoras.jsx` | `getAceleradoras` |
| `/PublicoInversores` | `PublicoInversores` | `PerfilPublicoInversores.jsx` | `getInversores` |

### 4. Mensajería y Notificaciones

| Ruta | Página | Componente | APIs de `Services.jsx` Consumidas |
| :--- | :--- | :--- | :--- |
| `/MensajesStartups` | `PaginaMensajesStartups` | `MensajesStartups.jsx` | `getChatsInversoresYStartups`, `getChatsStartupsYAceleradoras`, `getStartups`, `getInversores`, `getAceleradoras`, `putChatsInversoresYStartups`, `putChatsStartupsYAceleradoras`, `postChatsInversoresYStartups`, `postChatsStartupsYAceleradoras` |
| `/MensajesAceleradoras` | `PaginaMensajesAceleradoras` | `MensajesAceleradoras.jsx` | `getChatsStartupsYAceleradoras`, `getStartups`, `putChatsStartupsYAceleradoras`, `postChatsStartupsYAceleradoras` |
| `/MensajesInversores` | `PaginaMensajesInversores` | `MensajesInversores.jsx` | `getChatsInversoresYStartups`, `getInversores`, `getStartups`, `postChatsInversoresYStartups`, `putChatsInversoresYStartups` |
| `/Notificaciones` | `Notificaciones` | `NotificacionesDeContact.jsx` | `getMensajesContactanos`, `deleteMensajesContactanos` |
| `/ContactUs` | `ContactPage` | `ContactUs.jsx` | `postMensajesContactanos` |

### 5. Administración (Rutas Privadas)

| Ruta | Página | Componente | APIs de `Services.jsx` Consumidas |
| :--- | :--- | :--- | :--- |
| `/DashboardAdmin` | `PaginaDashboardAdmin` | `DashboardAdmin.jsx` | `getSolicitudes`, `getStartups`, `getInversores`, `getAceleradoras`, `postStartups`, `deleteSolicitudes` |
| `/SolicitudesPendientes` | `PaginaSolicitudesPendientes` | `SolicitudesPendientes.jsx` | `getSolicitudes`, `deleteSolicitudes`, `postStartups` |
| `/GestionarUsuarios` | `PaginaGestionarUsuarios` | `GestionarUsuarios.jsx` | `getAdministradores`, `getStartups`, `getAceleradoras`, `getInversores`, `deleteAdministradores`, `deleteStartup`, `deleteAceleradoras`, `deleteInversores` |
| `/SolicitudesPendientesAceleradoras` | `PaginaSolicitudPendienteAceleradora` | `SolicitudPendienteAceleradora.jsx` | `getSolicitudesAceleradoras`, `deleteSolicitudesAceleradoras`, `postAceleradoras` |

---

## 📌 Resumen de Dependencias Críticas

1. **`Services.jsx`**: Es el único punto de entrada para datos dinámicos. Cualquier cambio en la estructura del backend o en los puertos de la API afectará a todos los componentes mencionados arriba.
2. **`db.json`**: Actúa como la base de datos volátil. Los métodos `post`, `put` y `delete` modifican este archivo en tiempo real a través de `json-server`.
3. **Cloudinary**: Se utiliza exclusivamente en el formulario de registro de Startups para el manejo de imágenes (`uploadImage`).
