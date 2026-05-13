# Guía de Páginas y Contenidos (Frontend)

Este documento describe la funcionalidad, el contenido y las acciones disponibles en cada una de las páginas del ecosistema **Nexus Cobalt**.

---

## 🏠 Páginas Públicas

### 1. Landing Page (`/`)
- **Contenido**: Hero section con propuesta de valor, sección de beneficios, llamados a la acción (CTA) y pie de página informativo.
- **Acciones**: Navegación a Login, Registro y secciones informativas.
- **Propósito**: Atraer a nuevos usuarios y explicar brevemente qué es la plataforma.

### 2. Registro de Inversor (`/Register`)
- **Contenido**: Formulario detallado para la creación de perfiles de inversores (nombre, correo, contraseña, tesis de inversión, sectores de interés).
- **Acciones**: Validación de contraseña, creación de cuenta y redirección al Login.

### 3. Solicitud de Startup (`/SolicitudStartup`)
- **Contenido**: Formulario extenso para que las startups soliciten su ingreso. Incluye carga de logotipo, detalles financieros (ARR, meta de recaudación), equipo y descripción.
- **Acciones**: Carga de imágenes a Cloudinary y envío de solicitud a la cola de aprobación del administrador.

### 4. Solicitud de Aceleradora (`/SolicitudAceleradora`)
- **Contenido**: Formulario para que las aceleradoras soliciten su registro. Detalla programas, mentores y servicios ofrecidos.
- **Acciones**: Envío de solicitud para revisión administrativa.

### 5. Login (`/Login`)
- **Contenido**: Formulario unificado para todos los roles.
- **Acciones**: Autenticación cruzada (verifica en las colecciones de Admins, Startups, Inversores y Aceleradoras) y redirección al panel correspondiente según el rol.

### 6. Sobre Nosotros (`/AboutUsPage`)
- **Contenido**: Historia de la empresa, misión, visión y presentación del equipo fundador.
- **Acciones**: Informativa.

### 7. Contacto (`/ContactUs`)
- **Contenido**: Formulario de contacto directo (nombre, asunto, mensaje).
- **Acciones**: Envío de mensajes que llegarán al panel de notificaciones del administrador.

---

## 🗺️ Exploración y Comunidad

### 8. Mapa de Ecosistema (`/Mapa`)
- **Contenido**: Mapa interactivo (Google Maps / Leaflet) que muestra la ubicación geográfica de todas las startups activas.
- **Acciones**: Visualización de ubicación y acceso rápido a perfiles de startups.

### 9. Buscador de Aceleradoras (`/AceleradorasBuscador`)
- **Contenido**: Listado de aceleradoras con herramientas de búsqueda y filtros.
- **Acciones**: Filtrar aceleradoras por nombre o servicios.

### 10. Perfiles Públicos (`/PublicoStartups`, `/PublicoAceleradoras`, `/PublicoInversores`)
- **Contenido**: Información general, visión, sectores y trayectoria de los diferentes actores del ecosistema.
- **Acciones**: Ver detalles y (en el caso de startups) iniciar contacto.

---

## 🛡️ Paneles Privados (Dashboards)

### 11. Dashboard de Startup (`/PerfilPrivadoStartup`)
- **Contenido**: Panel de control con métricas propias, gestión de equipo y edición de perfil.
- **Acciones**: Actualizar datos de la startup, gestionar miembros y ver estado de solicitudes.

### 12. Dashboard de Aceleradora (`/PerfilPrivadoAceleradora`)
- **Contenido**: Gestión de programas de aceleración, lista de mentores y servicios activos.
- **Acciones**: Añadir/Editar servicios, gestionar mentores y visualizar startups aceleradas.

### 13. Dashboard de Inversor (`/PerfilPrivadoInversor`)
- **Contenido**: Tesis de inversión y portafolio de empresas invertidas.
- **Acciones**: Actualizar portafolio, cambiar sectores de interés y gestionar tesis de inversión.

---

## 💬 Sistemas de Comunicación

### 14. Mensajería (`/MensajesStartups`, `/MensajesInversores`, `/MensajesAceleradoras`)
- **Contenido**: Bandeja de entrada de chats en tiempo real.
- **Acciones**: Crear nuevos chats, enviar mensajes, ver historial de conversaciones y filtrar por emisor.
- **Nota**: El sistema de mensajes de la Startup centraliza conversaciones con Inversores y Aceleradoras por separado.

---

## 👑 Administración (Panel de Control)

### 15. Dashboard Admin (`/DashboardAdmin`)
- **Contenido**: Vista global con KPIs (Total de Startups, Inversores, Aceleradoras, Capital Total). Gráficos de crecimiento y distribución por sectores.
- **Acciones**: Acceso rápido a todas las herramientas administrativas.

### 16. Gestión de Solicitudes (`/SolicitudesPendientes`, `/SolicitudesPendientesAceleradoras`)
- **Contenido**: Lista de entidades que desean unirse a la plataforma.
- **Acciones**: **Aprobar** (mueve la entidad a la base de datos activa) o **Rechazar** (elimina la solicitud).

### 17. Gestión de Usuarios (`/GestionarUsuarios`)
- **Contenido**: Tabla maestra con todos los usuarios registrados en el sistema.
- **Acciones**: Eliminar usuarios o editar sus roles y datos básicos.

### 18. Notificaciones de Contacto (`/Notificaciones`)
- **Contenido**: Bandeja de mensajes recibidos a través de la página de contacto.
- **Acciones**: Leer y eliminar mensajes.
