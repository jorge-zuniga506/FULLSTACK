import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CookieConsent from '../components/Common/CookieConsent';
import GlobalUtilityMenu from '../components/Common/GlobalUtilityMenu';
import { ADMIN_SECRET_DASHBOARD_PATH } from '../constants/adminRoute';

// ─── Layouts ──────────────────────────────────────────────────────────────────
// DashboardLayout: envuelve las páginas del ecosistema con el sidebar lateral
import DashboardLayout from '../components/Layout/DashboardLayout';

// ─── Páginas Standalone (sin sidebar) ─────────────────────────────────────────
// Estas páginas tienen su propio layout completo (navbar propia o auth)
import Landpage           from '../pages/Landpage/Landpage';
import Login              from '../components/Auth/LoginForm';
import Register           from '../components/Auth/RegisterForm';
import PublishGeneral     from '../pages/PublishGeneral/PublishGeneral';
import AboutPage          from '../pages/About/AboutPage';
import StartupsPublicPage from '../pages/StartupsPublic/StartupsPublicPage';
import FoundersPublicPage from '../pages/Founders/FoundersPublicPage';
import InversionistasPublicPage from '../pages/Inversionistas/InversionistasPublicPage';
import InformesView       from '../pages/Informes/InformesView';
import LatamWeeksView     from '../pages/LatamWeeks/LatamWeeksView';
import CapsulasView       from '../pages/Capsulas/CapsulasView';
import NewsletterView     from '../pages/Newsletter/NewsletterView';

// ─── Páginas del Ecosistema (con sidebar via DashboardLayout) ─────────────────
// Todas estas rutas comparten el sidebar de navegación
import Dashboard          from '../components/Dashboard/DashboardView';
import Explorer           from '../components/Startups/StartupsView';
import Startups           from '../components/Startups/StartupsView';
import Investors          from '../components/Investors/InvestorsView';
import Accelerators       from '../components/Accelerators/AcceleratorsView';
import Profile            from '../components/Profile/ProfileView';

// 2FA y Dashboards por Rol
import VerifyRoleCode      from '../pages/Auth/VerifyRoleCode';
import StartupDashboard    from '../pages/Dashboard/StartupDashboard';
import StartupFeed          from '../pages/Dashboard/StartupFeed';
import AceleradoraDashboard from '../pages/Dashboard/AceleradoraDashboard';
import AceleradoraFeed      from '../pages/Dashboard/AceleradoraFeed';
import InversorDashboard    from '../pages/Dashboard/InversorDashboard';
import InversorFeed         from '../pages/Dashboard/InversorFeed';
import AdminDashboard       from '../pages/Dashboard/AdminDashboard';
import AdminManageSection   from '../pages/Dashboard/AdminManageSection';
import SupportCenter        from '../pages/Dashboard/SupportCenter';
import RoleRouteGuard       from './RoleRouteGuard';

// Componente para proteger rutas privadas
const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div className="auth-loading-screen" style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#16171d',
        color: '#c084fc',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '18px'
      }}>
        <div className="spinner" style={{
          border: '4px solid rgba(192, 132, 252, 0.1)',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          borderLeftColor: '#c084fc',
          animation: 'spin 1s linear infinite',
          marginBottom: '20px'
        }}></div>
        <span>Cargando Nexus Cobalt...</span>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Componente para redirigir fuera de login/registro si ya hay sesión
const PublicRoute = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Redirige /dashboard al dashboard específico según el rol
const RoleDashboardRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role_id === 1) return <Navigate to={ADMIN_SECRET_DASHBOARD_PATH} replace />;
  if (user.role_id === 2) return <Navigate to="/dashboard/startup" replace />;
  if (user.role_id === 3) return <Navigate to="/dashboard/aceleradora" replace />;
  if (user.role_id === 4) return <Navigate to="/dashboard/inversor" replace />;
  return <Navigate to="/login" replace />;
};

/**
 * AppRoutes — Configuración central del enrutamiento
 */
const AppRoutes = () => {
  return (
    <>
    <Routes>

      {/* ── 1. PÁGINAS STANDALONE (SIN SIDEBAR) ─────────────────────────── */}

      {/* Landing page pública */}
      <Route path="/"        element={<Landpage />} />

      {/* Vista de Informes de Ecosistema */}
      <Route path="/informes" element={<InformesView />} />

      {/* Vista de Latam Weeks de Ecosistema */}
      <Route path="/latam-weeks" element={<LatamWeeksView />} />

      {/* Vista de Cápsulas y RRSS de Ecosistema */}
      <Route path="/capsulas" element={<CapsulasView />} />

      {/* Vista de Newsletter de Ecosistema */}
      <Route path="/newsletter" element={<NewsletterView />} />

      {/* Autenticación */}
      <Route path="/login"   element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      
      {/* Verificación de Doble Factor (Requiere estar logueado pero no verificado aún) */}
      <Route path="/verify-role-code" element={<ProtectedRoute><VerifyRoleCode /></ProtectedRoute>} />

      {/* Públicas adicionales */}
      <Route path="/PublishGeneral" element={<PublishGeneral />} />
      <Route path="/about"          element={<AboutPage />} />
      <Route path="/PublicStartups" element={<StartupsPublicPage />} />
      <Route path="/PublicoFounders" element={<FoundersPublicPage />} />
      <Route path="/PublicFounders"  element={<FoundersPublicPage />} />
      <Route path="/PublicoInversionistas" element={<InversionistasPublicPage />} />
      <Route path="/PublicInversionistas"  element={<InversionistasPublicPage />} />


      {/* ── 2. PÁGINAS DEL ECOSISTEMA (CON SIDEBAR Y RUTA PROTEGIDA POR VERIFICACIÓN 2FA) ─────────── */}

      {/* Redirección dinámica según el rol del usuario */}
      <Route path="/dashboard" element={<ProtectedRoute><RoleDashboardRedirect /></ProtectedRoute>} />

      {/* Dashboards específicos por rol con guarda obligatoria */}
      <Route path="/dashboard/startup" element={
        <RoleRouteGuard allowedRoles={[2]}>
          <DashboardLayout><StartupDashboard /></DashboardLayout>
        </RoleRouteGuard>
      } />

      <Route path="/dashboard/startup/busqueda" element={
        <RoleRouteGuard allowedRoles={[2]}>
          <DashboardLayout><StartupFeed /></DashboardLayout>
        </RoleRouteGuard>
      } />

      <Route path="/dashboard/aceleradora" element={
        <RoleRouteGuard allowedRoles={[3]}>
          <DashboardLayout><AceleradoraDashboard /></DashboardLayout>
        </RoleRouteGuard>
      } />

      <Route path="/dashboard/aceleradora/red" element={
        <RoleRouteGuard allowedRoles={[3]}>
          <DashboardLayout><AceleradoraFeed /></DashboardLayout>
        </RoleRouteGuard>
      } />

      <Route path="/dashboard/inversor" element={
        <RoleRouteGuard allowedRoles={[4]}>
          <DashboardLayout><InversorDashboard /></DashboardLayout>
        </RoleRouteGuard>
      } />

      <Route path="/dashboard/inversor/red" element={
        <RoleRouteGuard allowedRoles={[4]}>
          <DashboardLayout><InversorFeed /></DashboardLayout>
        </RoleRouteGuard>
      } />

      <Route path={ADMIN_SECRET_DASHBOARD_PATH} element={
        <RoleRouteGuard allowedRoles={[1]}>
          <DashboardLayout><AdminDashboard /></DashboardLayout>
        </RoleRouteGuard>
      } />

      <Route path={`${ADMIN_SECRET_DASHBOARD_PATH}/startups`} element={
        <RoleRouteGuard allowedRoles={[1]}>
          <DashboardLayout><AdminManageSection section="startups" /></DashboardLayout>
        </RoleRouteGuard>
      } />

      <Route path={`${ADMIN_SECRET_DASHBOARD_PATH}/inversores`} element={
        <RoleRouteGuard allowedRoles={[1]}>
          <DashboardLayout><AdminManageSection section="inversores" /></DashboardLayout>
        </RoleRouteGuard>
      } />

      <Route path={`${ADMIN_SECRET_DASHBOARD_PATH}/aceleradoras`} element={
        <RoleRouteGuard allowedRoles={[1]}>
          <DashboardLayout><AdminManageSection section="aceleradoras" /></DashboardLayout>
        </RoleRouteGuard>
      } />

      <Route path="/dashboard/soporte" element={
        <RoleRouteGuard allowedRoles={[1, 2, 3, 4]}>
          <DashboardLayout><SupportCenter /></DashboardLayout>
        </RoleRouteGuard>
      } />

      {/* Explorador interactivo con guarda de verificación */}
      <Route path="/explorer" element={
        <RoleRouteGuard allowedRoles={[1, 2, 3, 4]}>
          <DashboardLayout><Explorer /></DashboardLayout>
        </RoleRouteGuard>
      } />

      {/* Listas de entidades con guarda de verificación */}
      <Route path="/startups" element={
        <RoleRouteGuard allowedRoles={[1, 2, 3, 4]}>
          <DashboardLayout><Startups /></DashboardLayout>
        </RoleRouteGuard>
      } />
      
      <Route path="/investors" element={
        <RoleRouteGuard allowedRoles={[1, 2, 3, 4]}>
          <DashboardLayout><Investors /></DashboardLayout>
        </RoleRouteGuard>
      } />
      
      <Route path="/accelerators" element={
        <RoleRouteGuard allowedRoles={[1, 2, 3, 4]}>
          <DashboardLayout><Accelerators /></DashboardLayout>
        </RoleRouteGuard>
      } />

      {/* Perfil del usuario autenticado */}
      <Route path="/profile" element={
        <RoleRouteGuard allowedRoles={[1, 2, 3, 4]}>
          <DashboardLayout><Profile /></DashboardLayout>
        </RoleRouteGuard>
      } />


      {/* ── CATCH-ALL: redirige rutas desconocidas al selector de dashboard ───────────── */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />

    </Routes>
    <CookieConsent />
    <GlobalUtilityMenu />
    </>
  );
};

export default AppRoutes;

