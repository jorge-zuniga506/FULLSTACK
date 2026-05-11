# Flujo de la Plataforma (Frontend)

## 1) Que es esta pagina
Esta aplicacion web conecta tres tipos de usuario dentro de un ecosistema de startups:
- Startups
- Aceleradoras
- Inversores

Permite registro, solicitud de ingreso, exploracion en mapa, perfiles publicos/privados, mensajeria y gestion administrativa.

## 2) Flujo general de navegacion
1. El usuario entra por `/` (Landing).
2. Desde landing puede ir a `Login`, `Register`, `ContactUs`, `AboutUs`.
3. Si inicia sesion y existe `token` en `localStorage`, puede entrar a rutas protegidas del admin.
4. Segun su rol/objetivo, navega a:
- Mapa de startups/aceleradoras
- Buscador de aceleradoras
- Perfiles publicos
- Perfiles privados
- Mensajeria
- Solicitudes

## 3) Arranque tecnico de la app
- `src/main.jsx`: monta React y carga el router principal.
- `src/routes/Routing.jsx`: define todas las rutas publicas y privadas.
- `src/routes/PrivateRoutes.tsx`: protege rutas admin verificando `localStorage.getItem('token')`.

## 4) Rutas y funcion de cada pagina

### Publicas
- `/` -> `LandPageForm`: portada principal, propuesta de valor y accesos rapidos.
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

### Privadas (requieren token)
- `/DashboardAdmin` -> `DashboardAdmin`: resumen y control administrativo.
- `/SolicitudesPendientes` -> `SolicitudesPendientes`: revision/aprobacion de solicitudes.
- `/GestionarUsuarios` -> `GestionarUsuarios`: CRUD de usuarios.
- `/PrincipalAdmin` -> `MapaAdmin`: mapa para administracion y monitoreo.
- `/Notificaciones` -> `NotificacionesDeContact`: mensajes de contacto recibidos.

## 5) Componentes clave y funcion
- `LandPageForm`: landing con CTA (login/registro/admin).
- `LoginForm` y `RegisterForm`: acceso y creacion de cuenta.
- `SolicitudForm` y `SolicitudAceleradoraForm`: onboarding por tipo de entidad.
- `MapaStartups`, `MapaParaAceleradoras`, `MapaAdmin`: visualizacion geografica con filtros (sector, etapa, region, anio).
- `PerfilPublico*`: informacion visible para exploracion.
- `PerfilPrivado*`: gestion de informacion del perfil propio.
- `Mensajes*`: modulo de conversacion entre actores.
- `DashboardAdmin`, `SolicitudesPendientes`, `GestionarUsuarios`: operaciones de administracion.

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
- `pages/`: contenedores de ruta (componen vistas con componentes).
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

## 9) Dependencias visuales importantes
- React + React Router
- React Bootstrap
- React Leaflet + Leaflet (mapas)
- CSS/SCSS por componente

## 10) Observaciones tecnicas actuales
- Muchas paginas son wrappers simples que solo montan un componente.
- Las rutas admin dependen unicamente de `token` en `localStorage`.
- Existe una ruta `/StartupPublicLogic` que monta `StartupPublicPage`; revisar ese flujo porque el componente usa `StartupPublicLogic` sin import explicito en esa pagina.

## 11) Resumen rapido del producto
La aplicacion es un hub de conexion entre startups, aceleradoras e inversores, con descubrimiento (mapa + buscador), perfiles, mensajeria y un backoffice admin para moderacion y gestion.
