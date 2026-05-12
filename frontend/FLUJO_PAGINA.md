# Flujo de la Plataforma (Frontend)

## 1) Que es esta pagina
Esta aplicacion web conecta tres tipos de usuario dentro de un ecosistema de startups:
- Startups
- Aceleradoras
- Inversores

Permite registro, solicitud de ingreso, exploracion en mapa, perfiles publicos/privados, mensajeria y gestion administrativa.

## 2) Flujo general de navegacion
1. El usuario entra por `/` (Landing).
2. Desde la landing navega a `Login`, `Register`, `ContactUs`, `AboutUs`.
3. Si inicia sesion y tiene token valido, puede entrar a rutas protegidas del admin.
4. Segun su rol/objetivo, navega a:
- Mapa de startups/aceleradoras
- Buscador de aceleradoras
- Perfiles publicos
- Perfiles privados
- Mensajeria
- Solicitudes

## 3) Arranque tecnico de la app
- `src/main.jsx`: monta React y carga el router principal.
- `src/routes/Routing.jsx`: define rutas publicas y privadas.
- `src/routes/PrivateRoutes.tsx`: protege rutas admin validando token y expiracion JWT.

## 4) Rutas y funcion de cada pagina

### Publicas
- `/` -> `LandPageForm`: portada principal, propuesta de valor
 y accesos rapidos.
- `/Login` -> `LoginForm`: autenticacion de usuario.
- `/Register` -> `RegisterForm`: alta de usuario.
- `/SolicitudStartup` -> `SolicitudForm`: formulario de solicitud para startup.
- `/SolicitudAceleradora` -> `SolicitudAceleradoraForm`: formulario de solicitud para aceleradora.
- `/Mapa` -> `MapaStartups`: mapa para explorar startups.
- `/PrincipalAceleradoras` -> `MapaParaAceleradoras`: mapa para aceleradoras.
- `/AceleradorasBuscador` -> `BuscadorDeAceleradoras`: filtros para descubrir aceleradoras.
- `/PublicoStartups` -> `PerfilPublicoStartups`: vista publica de startups.
- `/PublicoAceleradoras` -> `PerfilPublicoAceleradoras`: vista publica de aceleradoras.
- `/PublicoInversores` -> `PerfilPublicoInversores`: vista publica de inversores.
- `/PerfilPrivadoStartup` -> `PerfilPrivadoStartup`: panel de perfil startup.
- `/PerfilPrivadoAceleradora` -> `PerfilPrivadoAceleradora`: panel de perfil aceleradora.
- `/PerfilPrivadoInversor` -> `PerfilPrivadoInversor`: panel de perfil inversor.
- `/MensajesStartups` -> `MensajesStartups`: chat para startup.
- `/MensajesAceleradoras` -> `MensajesAceleradoras`: chat para aceleradora.
- `/MensajesInversores` -> `MensajesInversores`: chat para inversor.
- `/ContactUs` -> `ContactUs`: formulario de contacto.
- `/AboutUsPage` -> `AboutUsPage`: informacion de la plataforma.
- `/StartupPublicLogic` -> `StartupPublicPage`: vista publica especial conectada a `StartupPublicLogic`.

### Privadas (requieren token valido)
- `/DashboardAdmin` -> `DashboardAdmin`: resumen y control administrativo.
- `/SolicitudesPendientes` -> `SolicitudesPendientes`: revision/aprobacion de solicitudes.
- `/GestionarUsuarios` -> `GestionarUsuarios`: CRUD de usuarios.
- `/PrincipalAdmin` -> `MapaAdmin`: mapa para administracion y monitoreo.
- `/Notificaciones` -> `NotificacionesDeContact`: mensajes de contacto recibidos.

## 5) Componentes clave y funcion
- `LandPageForm`: landing con CTA y navegacion principal.
- `LoginForm` y `RegisterForm`: acceso y creacion de cuenta.
- `SolicitudForm` y `SolicitudAceleradoraForm`: onboarding por tipo de entidad.
- `MapaStartups`, `MapaParaAceleradoras`, `MapaAdmin`: visualizacion geografica con filtros.
- `PerfilPublico*`: informacion visible para exploracion.
- `PerfilPrivado*`: gestion de informacion del perfil propio.
- `Mensajes*`: modulo de conversacion entre actores.
- `DashboardAdmin`, `SolicitudesPendientes`, `GestionarUsuarios`: operaciones administrativas.

## 6) Capa de datos (Services)
`src/services/Services.jsx` centraliza fetch hacia backend `http://localhost:3001`.

Recursos principales:
- `administradores`
- `solicitudes`
- `solicitudesAceleradoras`
- `startups`
- `aceleradoras`
- `inversores`
- `chatsStartupsYAceleradoras`
- `chatsInversoresYStartups`
- `MensajesContactanos`

Operaciones:
- Lectura (`get*`)
- Creacion (`post*`)
- Actualizacion (`put*`, `patch*`)
- Eliminacion (`delete*`)
- Upload de imagenes a Cloudinary (`uploadImage`)

## 7) Estructura funcional por modulos
- `pages/`: contenedores de ruta.
- `components/`: logica visual y de interaccion principal.
- `routes/`: enrutamiento y control de acceso.
- `services/`: llamadas HTTP y persistencia remota.
- `styles/`: estilos por componente/pagina.

## 8) Flujo de datos resumido
1. El componente monta y ejecuta `useEffect`.
2. Llama a `Services.get...`.
3. Guarda resultados en `useState`.
4. Aplica filtros/busquedas en memoria.
5. Renderiza tarjetas, tablas, mapas o chats.
6. En formularios: `post/put/patch/delete` y luego refresco de estado.

## 9) Estado tecnico actualizado
- Corregido el enlace de landing a `ContactUs`.
- Corregida referencia de `StartupPublicLogic` en `StartupPublicPage`.
- Limpiados imports muertos en rutas/paginas principales.
- Eliminados componentes no conectados para reducir deuda tecnica.
- Endurecida validacion de rutas privadas con control de expiracion de token.

## 10) Resumen rapido del producto
La aplicacion es un hub de conexion entre startups, aceleradoras e inversores, con descubrimiento (mapa + buscador), perfiles, mensajeria y backoffice admin para moderacion y gestion.



lo que se debe agregar es esto 

REQUERIMIENTOS DEL PROYECTO FINAL

Desarrollo de API RESTful con Backend Completo

Curso: Desarrollo Web Avanzado

1. DESCRIPCIÓN GENERAL DEL PROYECTO
El grupo deberá diseñar e implementar una API RESTful con backend completo que gestione un dominio de
negocio de su elección (por ejemplo: tienda en línea, sistema de reservas, gestión de inventario, red social,
plataforma educativa, etc.). El proyecto debe demostrar el dominio de los criterios evaluados en la rúbrica oficial del
curso.
OBJETIVOS DE APRENDIZAJE
• Implementar un CRUD completo con manejo de errores robusto.
• Construir una API RESTful que cumpla con los principios HTTP y buenas prácticas REST.
• Integrar un sistema de autenticación seguro con manejo de sesiones/tokens.
• Organizar el código bajo una arquitectura limpia y componentes reutilizables.
• Aplicar pruebas unitarias y funcionales con cobertura adecuada.
• Gestionar el proyecto con control de versiones profesional en GitHub.

2. REQUERIMIENTOS FUNCIONALES

RF-01 | Funcionalidad del CRUD
• Implementar los cuatro verbos HTTP: POST (crear), GET (leer), PUT/PATCH (actualizar) y DELETE (eliminar)
sobre al menos dos entidades del dominio.
• Cada operación debe devolver el código de estado HTTP correcto (200, 201, 204, 400, 404, etc.).
• Validar los datos de entrada en cada endpoint; retornar mensajes de error claros y estructurados ante datos
inválidos o faltantes.
• El CRUD debe operar sobre una base de datos SQL persistente.
• No deben existir errores de servidor (5xx) en el flujo normal de uso.
RF-02 | Seguridad y Autenticación — Login
• Implementar registro (sign-up) e inicio de sesión (login) de usuarios.
• Las contraseñas deben almacenarse hasheadas (bcrypt o equivalente); nunca en texto plano.

• Gestionar sesiones mediante JWT (o sistema de tokens equivalente) con tiempo de expiración configurable.
• Proteger los endpoints sensibles con middleware de autenticación; retornar 401/403 cuando corresponda.
• Implementar al menos un nivel de roles (ej. admin vs. usuario) que restrinja el acceso a ciertas rutas.
• Invalidar tokens o sesiones al cerrar sesión (logout).
RF-03 | Implementación de la API RESTful
• Diseñar los endpoints con nomenclatura de recursos en plural y en minúsculas (ej. /api/productos).
• Usar correctamente los métodos HTTP: GET para lectura, POST para creación, PUT/PATCH para
actualización, DELETE para eliminación.
• Retornar respuestas en formato JSON con estructura consistente (ej. { data, message, status }).
• Incluir paginación en los endpoints de listado (ej. ?page=1&limit=10).
• Versionar la API (ej. /api/v1/) para facilitar futuras evoluciones.
• Proporcionar un archivo de documentación o colección Postman/Swagger con todos los endpoints.
RF-04 | Integración con Base de Datos / Servidor
• Conectar el servidor a una base de datos relacional SQL (PostgreSQL o MySQL) con configuración en
variables de entorno.
• Utilizar Sequelize como ORM para todas las operaciones de base de datos; no se aceptan queries en texto
plano.
• Manejar errores de conexión con reintentos o mensajes descriptivos sin exponer detalles internos al cliente.
• Implementar transacciones para operaciones que modifiquen múltiples registros relacionados.
• El servidor debe levantar correctamente y estar listo para recibir peticiones en el puerto definido por variable de
entorno.
RF-05 | Funcionalidades Avanzadas
• Implementar al menos dos de las siguientes funcionalidades: búsqueda por texto, filtros por campo,
ordenamiento dinámico, carga de archivos (upload), envío de correos o notificaciones, caché de respuestas.
• Las funcionalidades avanzadas deben integrarse con los endpoints existentes sin romper su comportamiento
base.
• Documentar cada funcionalidad avanzada indicando cómo activarla desde la petición HTTP.
RF-06 | Mejora del Frontend: Paneles de Administración y Roles
• El grupo deberá adaptar y mejorar el frontend existente del proyecto para que consuma correctamente los
endpoints del nuevo backend construido.
• Los paneles de administración deben ser rediseñados para ofrecer mayor robustez: manejo de estados de
carga, mensajes de error claros, confirmaciones ante acciones destructivas (eliminar, desactivar) y
retroalimentación visual en cada operación.
• Implementar una vista diferenciada por rol: el panel de administrador debe exponer funcionalidades
restringidas (gestión de usuarios, reportes, configuración) que no estén disponibles para roles de menor
privilegio.
• El acceso a rutas del frontend protegidas debe validarse contra el token/sesión activo; redirigir automáticamente
al login si la sesión expira o el rol no tiene permiso.

• Los formularios del panel deben incluir validación en el cliente (campos requeridos, formatos, longitudes)
antes de enviar la petición al backend.
• El panel de administración debe mostrar listados paginados conectados a los endpoints de paginación del
backend, con controles de navegación (siguiente, anterior, ir a página).
• Cualquier acción que modifique datos (crear, editar, eliminar) debe reflejar el cambio en la UI de forma
inmediata sin requerir recarga manual de la página.
RF-07 | Integración de Inteligencia Artificial al Proyecto
• El grupo deberá incorporar al menos una habilidad o skill de Inteligencia Artificial al proyecto, seleccionada
a partir de los temas vistos en clases. La implementación debe aportar valor real al dominio del negocio elegido.
• Las opciones válidas para implementar son:
■ Automatizaciones: flujos automáticos que respondan a eventos del sistema (ej. envío de notificaciones,
generación de reportes, actualización de registros sin intervención manual).
■ Agentes inteligentes: componentes capaces de tomar decisiones o ejecutar acciones de forma
autónoma en respuesta a entradas del usuario o del sistema.
■ Conectores entre plataformas: integración del backend con servicios externos mediante APIs de
terceros (ej. WhatsApp, Slack, Google Sheets, correo electrónico).
■ Integraciones: conexión con modelos de lenguaje (LLMs) u otros servicios de IA para enriquecer
funcionalidades existentes (ej. clasificación, resumen, respuesta automática).
■ Herramientas modernas de productividad e IA: uso de plataformas como n8n, Make, Zapier u otras
herramientas de automatización integradas al flujo del proyecto.
■ Desarrollo de soluciones automatizadas: pipelines o procesos que combinen múltiples pasos de forma
autónoma para resolver una necesidad concreta del proyecto.
• El grupo deberá documentar en el README cuál skill de IA eligió, por qué la seleccionó, cómo se integra al
proyecto y cómo puede probarse o verificarse su funcionamiento.
• La skill implementada debe estar operativa y ser demostrable durante la presentación final del proyecto.

3. REQUERIMIENTOS NO FUNCIONALES

RNF-01 | Organización del Código
• Seguir una arquitectura en capas: rutas → controladores → servicios → repositorio/modelo.
• Separar la configuración (base de datos, variables de entorno) del código de negocio.
• Nombrar archivos, funciones y variables de forma descriptiva en inglés o español (consistente a lo largo del
proyecto).
• Comentar las funciones y módulos principales indicando su propósito, parámetros y valor de retorno.
• Evitar duplicación de lógica; extraer funciones reutilizables (helpers, middlewares).
RNF-02 | Pruebas Unitarias y Funcionales
• Incluir pruebas unitarias para la capa de servicios/lógica de negocio con framework como Jest, Mocha, PyTest,
etc.
• Incluir pruebas funcionales (de integración) que validen al menos los endpoints del CRUD principal.
• Cubrir casos felices y casos de error (entidad no encontrada, datos inválidos, sin autorización).

• El conjunto de pruebas debe ejecutarse con un único comando (ej. npm test) y no depender de datos externos
no controlados.
• Incluir reporte de cobertura; apuntar a un mínimo de 60% de cobertura en la capa de negocio.
RNF-03 | GitHub y Control de Versiones
• El repositorio debe ser público o compartido con el docente antes de la fecha de entrega.
• Usar ramas: main (producción), develop (integración) y ramas por feature (feature/nombre) o fix (fix/nombre).
• Los commits deben seguir la convención Conventional Commits (ej. feat: add login endpoint, fix: correct token
expiry).
• Fusionar cambios mediante Pull Requests con descripción del cambio; no hacer push directo a main.
• El historial debe reflejar un progreso incremental; no se aceptan proyectos subidos en un solo commit.
RNF-04 | Documentación
• Incluir un archivo README.md en la raíz del repositorio con: descripción del proyecto, tecnologías usadas,
instrucciones de instalación y ejecución, variables de entorno requeridas y ejemplos de peticiones.
• Adjuntar un diagrama entidad-relación (ER) o diagrama de colecciones del modelo de datos.
• Proporcionar una colección de Postman exportada o documentación Swagger/OpenAPI accesible en /api/docs.
• Documentar las decisiones de diseño importantes en el README o en un archivo ARCHITECTURE.md.
4. STACK TECNOLÓGICO SUGERIDO
Capa Opciones Recomendadas Obs.
Runtime / Lenguaje Node.js + Express Obligatorio
Base de Datos PostgreSQL, MySQL (relacional) Mínimo 1
ORM Sequelize Obligatorio
Autenticación JWT (jsonwebtoken / PyJWT / jjwt) + bcrypt Obligatorio
Pruebas Jest + Supertest Obligatorio
Documentación API Swagger UI / Postman Collection Obligatorio
Control de Versiones Git + GitHub Obligatorio
Variables de Entorno .env (incluir .env en .gitignore) Obligatorio

Este documento es la guia oficial de requerimientos del Proyecto Final. Cualquier duda debe consultarse con el docente
antes de la fecha de entrega. Se recomienda revisar periodicamente el repositorio del curso para actualizaciones.