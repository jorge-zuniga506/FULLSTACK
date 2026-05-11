# Informe de Elementos Inservibles / Rotos

## Estado
Este documento lista lo que actualmente no aporta funcionalidad o puede romper flujos del frontend.

## 1) Criticos (rompen flujo o pueden romper en runtime)

### 1.1 Componente con referencia no importada (posible crash)
- Archivo: `src/pages/StartupPublicPage.jsx`
- Problema: Renderiza `<StartupPublicLogic />` sin importarlo en ese archivo.
- Impacto: Al entrar a `/StartupPublicLogic`, puede lanzar `ReferenceError` y dejar la vista inutilizable.

### 1.2 Enlace roto por mayusculas/minusculas
- Archivo: `src/components/LandPageForm.jsx`
- Evidencia: `href="/ContactUS"`
- Ruta real definida: `/ContactUs` (en `src/routes/Routing.jsx`).
- Impacto: El boton `CONTACTO` de la landing puede enviar a ruta inexistente segun entorno/hosting.

## 2) Alto (codigo muerto o no conectado)

### 2.1 Componentes sin uso (no referenciados por rutas/paginas)
- `src/components/AceleradorasMenu.jsx`
- `src/components/DivExtra.jsx`
- `src/components/HeaderSolicitudes.jsx`
- `src/components/UsuariosChat.jsx`
- `src/components/ComponenteNavbar copy.jsx` (duplicado de respaldo)
- `src/components/StartupForm.jsx` (existe pero no esta conectado a ninguna `page` ni `route`)

Impacto:
- Aumenta deuda tecnica.
- Confunde al equipo sobre cual version esta activa.
- Eleva costo de mantenimiento.

### 2.2 Imports muertos en rutas/paginas
- `src/routes/Routing.jsx`:
  - `import SobreNosotrosPa ...` no se usa.
  - `import StartupPublicLogic ...` no se usa.
- `src/pages/Mapa.jsx`:
  - `import MapaLeaflet ...` no se usa.

Impacto:
- Ruido en codigo y riesgo de desalineacion funcional.

## 3) Medio (actualmente sin valor funcional real)

### 3.1 Estilos placeholder (archivos vacios funcionalmente)
Estos estilos existen para evitar errores de import, pero no contienen diseño real:
- `src/styles/BuscadorAceleradoras.scss`
- `src/styles/DashboardAdminStyle.css`
- `src/styles/LandPage.css`
- `src/styles/LoginStyle.css`
- `src/styles/Mapa.css`
- `src/styles/MapaAceleradoras.css`
- `src/styles/MapaAdmin.css`
- `src/styles/MensajesAceleradoras.css`
- `src/styles/MensajesInversores.css`
- `src/styles/MensajesStartups.css`
- `src/styles/Navbar.css`
- `src/styles/PerfilPrivAceleradora.css`
- `src/styles/PerfilPrivInversor.css`
- `src/styles/PerfilPrivStartup.css`
- `src/styles/PublicoAceleradoras.css`
- `src/styles/PublicoInversores.css`
- `src/styles/PublicoStartups.css`
- `src/styles/Register.css`
- `src/styles/SolicitudAceleradoraForm.css`
- `src/styles/SolicitudesPendientes.css`
- `src/styles/SolicitudForm.css`
- `src/styles/StartupForm.css`

Impacto:
- La app compila, pero muchas pantallas pueden verse sin estilo real.

## 4) Bajo (mejoras de arquitectura)

### 4.1 Navegacion mezclada (a vs Link)
- En varios componentes se usan `<a href="...">` en lugar de `<Link to="...">`.
- Impacto: recarga completa de pagina, peor UX y perdida de estado.

### 4.2 Seguridad de rutas privadas muy basica
- `PrivateRoutes.tsx` solo valida `token` en `localStorage`.
- Impacto: no hay validacion de expiracion, rol, ni integridad de sesion.

## 5) Priorizacion de arreglo (recomendado)
1. Corregir `StartupPublicPage.jsx` (import faltante o ajuste de componente).
2. Corregir ruta `ContactUS` -> `ContactUs`.
3. Eliminar o reconectar codigo muerto (componentes/imports no usados).
4. Reemplazar placeholders de `styles` por estilos reales por modulo.
5. Unificar navegacion con `react-router-dom` (`Link`).
6. Endurecer `PrivateRoutes` con validacion real de sesion/rol.

## 6) Conclusion
Hoy el proyecto **compila**, pero tiene partes "inservibles" por tres razones: codigo no conectado, rutas/enlaces inconsistentes y estilos placeholder sin funcionalidad visual real. Arreglando los 3 puntos criticos/altos se recupera estabilidad y mantenibilidad rapidamente.
