import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Register from '../pages/Register'
import SolicitudStartup from '../pages/SolicitudStartup'
import Login from '../pages/Login'
import PublicoAceleradoras from '../pages/PublicoAceleradoras'
import PublicoInversores from '../pages/PublicoInversores'
import PublicoStartups from '../pages/PublicoStartups'
import PaginaDashboardAdmin from '../pages/PaginaDashboardAdmin'
import PaginaSolicitudesPendientes from '../pages/PaginaSolicitudesPendientes'
import PaginaGestionarUsuarios from '../pages/PaginaGestionarUsuarios'
import PaginaPerfilPrivadoStartup from '../pages/PaginaPerfilPrivadoStartup'
import PaginaSolicitudPendienteAceleradora from '../pages/PaginaSolicitudPendienteAceleradora'
import SolicitudAceleradora from '../pages/SolicitudAceleradora'
import PaginaPerfilPrivadoAceleradora from '../pages/PaginaPerfilPrivadoAceleradora'
import PaginaPerfilPrivadoInversor from '../pages/PaginaPerfilPrivadoInversor'
import PaginaMensajesAceleradoras from '../pages/PaginaMensajesAceleradoras'
import PaginaMensajesInversores from '../pages/PaginaMensajesInversores'
import PaginaMensajesStartups from '../pages/PaginaMensajesStartups'
import Mapa from '../pages/Mapa'
import ContactPage from '../pages/ContactPage'
import LandPage from '../pages/LandPage'
import AboutUs from '../pages/AboutUs'
import StartupPublicPage from '../pages/StartupPublicPage'
import AceleradorasBuscador from '../pages/AceleradorasBuscador'
import PrincipalAceleradoras from '../pages/PrincipalAceleradoras'
import PrivateRoutes from './PrivateRoutes'
import PrincipalAdmin from '../pages/PrincipalAdmin'
import Notificaciones from '../pages/Notificaciones'
const Routing = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<LandPage />}></Route>
        <Route path='/Register' element={<Register />} />
        <Route path='/SolicitudStartup' element={<SolicitudStartup />} />
        <Route path='/Login' element={<Login />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/Mapa' element={<Mapa />} />
        <Route path='/PrincipalAceleradoras' element={<PrincipalAceleradoras />}></Route>
        <Route path='/PublicoAceleradoras' element={<PublicoAceleradoras />}></Route>
        <Route path='/PublicoInversores' element={<PublicoInversores />}></Route>
        <Route path='/PublicoStartups' element={<PublicoStartups />}></Route>
        <Route path='/PerfilPrivadoStartup' element={<PaginaPerfilPrivadoStartup />}></Route>
        <Route path='/SolicitudesPendientesAceleradoras' element={<PaginaSolicitudPendienteAceleradora />}></Route>
        <Route path='/SolicitudAceleradora' element={<SolicitudAceleradora />}></Route>
        <Route path='/ContactUs' element={<ContactPage />}></Route>
        <Route path='/AboutUsPage' element={<AboutUs />}></Route>
        <Route path='/StartupPublicLogic' element={<StartupPublicPage />}></Route>
        <Route path='/PerfilPrivadoAceleradora' element={<PaginaPerfilPrivadoAceleradora />}></Route>
        <Route path='/PerfilPrivadoInversor' element={<PaginaPerfilPrivadoInversor />}></Route>
        <Route path='/AceleradorasBuscador' element={<AceleradorasBuscador />}></Route>
        <Route path="/MensajesAceleradoras" element={<PaginaMensajesAceleradoras />}></Route>
        <Route path="/MensajesInversores" element={<PaginaMensajesInversores />}></Route>
        <Route path="/MensajesStartups" element={<PaginaMensajesStartups />}></Route>
        {/* Rutas Privadas */}
        <Route path="/DashboardAdmin" element={<PrivateRoutes><PaginaDashboardAdmin /></PrivateRoutes>}></Route>
        <Route path='/SolicitudesPendientes' element={<PrivateRoutes><PaginaSolicitudesPendientes /></PrivateRoutes>}></Route>
        <Route path="/GestionarUsuarios" element={<PrivateRoutes><PaginaGestionarUsuarios /></PrivateRoutes>}></Route>
        <Route path="/PrincipalAdmin" element={<PrivateRoutes><PrincipalAdmin /></PrivateRoutes>}></Route>
        <Route path="/Notificaciones" element={<PrivateRoutes><Notificaciones /></PrivateRoutes>}></Route>
      </Routes>
    </Router>
  )
}

export default Routing
