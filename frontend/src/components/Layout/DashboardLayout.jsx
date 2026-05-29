import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/EntityList.css'; // Contiene estilos de .el-container, .el-sidebar, .el-main
import JarvisChat from '../Chatbot/JarvisChat';
import { ADMIN_SECRET_DASHBOARD_PATH } from '../../constants/adminRoute';
import { supportService } from '../../services/supportService';

/**
 * DashboardLayout — Layout principal con sidebar para páginas del ecosistema
 */
const DashboardLayout = ({ children }) => {
  const { user, token, logout } = useAuth();
  const location = useLocation();

  // Estado para controlar la apertura del sidebar en pantallas móviles
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [supportNewCount, setSupportNewCount] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const loadSupportBadge = async () => {
      if (!token || Number(user?.role_id) !== 1) {
        if (isMounted) setSupportNewCount(0);
        return;
      }

      try {
        const response = await supportService.getAdminReports({ estado: 'nuevo', limit: 1 }, token);
        const total = Number(response?.meta?.totalItems || 0);
        if (isMounted) setSupportNewCount(total);
      } catch {
        if (isMounted) setSupportNewCount(0);
      }
    };

    loadSupportBadge();
    const interval = setInterval(loadSupportBadge, 20000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [token, user?.role_id, location.pathname]);

  // Mapeador de roles
  const getRoleName = (roleId) => {
    if (roleId === 1) return 'Administrador';
    if (roleId === 2) return 'Emprendedor / Startup';
    if (roleId === 3) return 'Aceleradora';
    if (roleId === 4) return 'Inversionista';
    return 'Usuario';
  };

  const username = user?.nombre_hacienda || 'Usuario';
  const roleName = user ? getRoleName(user.role_id) : 'Emprendedor';
  const userInitial = username.charAt(0).toUpperCase();

  // Definición de los ítems del menú lateral dinámicos por rol
  const getNavItems = (roleId) => {
    if (roleId === 1) { // Administrador
      return [
        { path: ADMIN_SECRET_DASHBOARD_PATH, label: 'Control Central', id: 'dash' },
        { path: '/explorer', label: '🗺️ Explorador Global', id: 'expl' },
        { path: `${ADMIN_SECRET_DASHBOARD_PATH}/startups`, label: '🚀 Gestionar Startups', id: 'start' },
        { path: `${ADMIN_SECRET_DASHBOARD_PATH}/inversores`, label: '💼 Gestionar Inversores', id: 'inv' },
        { path: `${ADMIN_SECRET_DASHBOARD_PATH}/aceleradoras`, label: '⚡ Gestionar Aceleradoras', id: 'accel' },
        { path: '/dashboard/soporte', label: '🛟 Soporte', id: 'support', badge: supportNewCount },
        { path: '/profile', label: '👤 Perfil del Sistema', id: 'prof' },
      ];
    } else if (roleId === 2) { // Emprendedor / Startup
      return [
        { path: '/dashboard/startup', label: '🚀 Panel de Mi Startup', id: 'dash' },
        { path: '/dashboard/startup/busqueda', label: '🔎 Búsqueda', id: 'feed' },
        { path: '/explorer', label: '🌐 Explorar Ecosistema', id: 'expl' },
        { path: '/dashboard/soporte', label: '🛟 Soporte', id: 'support' },
        { path: '/profile', label: '👤 Perfil de Startup', id: 'prof' },
      ];
    } else if (roleId === 3) { // Aceleradora
      return [
        { path: '/dashboard/aceleradora', label: '⚡ Panel de Aceleradora', id: 'dash' },
        { path: '/dashboard/aceleradora/red', label: '🔎 Red de Aceleradoras', id: 'feed-acel' },
        { path: '/explorer', label: '🔍 Explorador de Red', id: 'expl' },
        { path: '/dashboard/soporte', label: '🛟 Soporte', id: 'support' },
        { path: '/profile', label: '👤 Perfil Institucional', id: 'prof' },
      ];
    } else if (roleId === 4) { // Inversionista
      return [
        { path: '/dashboard/inversor', label: '💼 Panel de Inversor', id: 'dash' },
        { path: '/dashboard/inversor/red', label: '🔎 Red de Inversores', id: 'feed-inv' },
        { path: '/startups', label: '🚀 Buscar Oportunidades', id: 'start' },
        { path: '/accelerators', label: '⚡ Red de Aceleradoras', id: 'accel' },
        { path: '/explorer', label: '🔍 Radar de Mercado', id: 'expl' },
        { path: '/dashboard/soporte', label: '🛟 Soporte', id: 'support' },
        { path: '/profile', label: '👤 Perfil Inversionista', id: 'prof' },
      ];
    }

    // Default fallback
    return [
      { path: '/dashboard', label: '📊 Dashboard General', id: 'dash' },
      { path: '/explorer', label: '🗺️ Explorador', id: 'expl' },
      { path: '/dashboard/soporte', label: '🛟 Soporte', id: 'support' },
      { path: '/profile', label: '👤 Mi Perfil', id: 'prof' },
    ];
  };

  const navItems = getNavItems(user?.role_id);

  // Paleta de colores e indicadores de neón dinámicos adaptados por rol
  const getRoleTheme = (roleId) => {
    switch (roleId) {
      case 1: // Admin
        return {
          '--role-accent': '#a855f7',
          '--role-bg-alpha': 'rgba(168, 85, 247, 0.1)',
          '--role-border-alpha': 'rgba(168, 85, 247, 0.25)',
          '--role-glow': 'rgba(168, 85, 247, 0.3)'
        };
      case 2: // Startup
        return {
          '--role-accent': '#ec4899',
          '--role-bg-alpha': 'rgba(236, 72, 153, 0.1)',
          '--role-border-alpha': 'rgba(236, 72, 153, 0.25)',
          '--role-glow': 'rgba(236, 72, 153, 0.3)'
        };
      case 3: // Aceleradora
        return {
          '--role-accent': '#b1f500',
          '--role-bg-alpha': 'rgba(177, 245, 0, 0.08)',
          '--role-border-alpha': 'rgba(177, 245, 0, 0.25)',
          '--role-glow': 'rgba(177, 245, 0, 0.3)'
        };
      case 4: // Inversionista
        return {
          '--role-accent': '#eab308',
          '--role-bg-alpha': 'rgba(234, 179, 8, 0.1)',
          '--role-border-alpha': 'rgba(234, 179, 8, 0.25)',
          '--role-glow': 'rgba(234, 179, 8, 0.3)'
        };
      default:
        return {
          '--role-accent': '#8b00dd',
          '--role-bg-alpha': 'rgba(139, 0, 221, 0.1)',
          '--role-border-alpha': 'rgba(139, 0, 221, 0.25)',
          '--role-glow': 'rgba(139, 0, 221, 0.3)'
        };
    }
  };

  return (
    <div className="el-container" style={getRoleTheme(user?.role_id)}>

      {/* ── MOBILE HEADER ───────────────────────────────────────────────── */}
      <header className="db-mobile-header">
        <button
          className={`db-menu-toggle ${isSidebarOpen ? 'active' : ''}`}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label="Toggle navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div className="db-mobile-logo">
          <span className="logo-nexus">NEXUS</span>
          <span className="logo-cobalt">COBALT</span>
        </div>
        <Link to="/profile" className="db-mobile-avatar-link">
          <div className="db-avatar" style={{ overflow: 'hidden' }}>
            {user?.profile_picture ? (
              <img src={user.profile_picture} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              userInitial
            )}
          </div>
        </Link>
      </header>

      {/* Backdrop overlay for mobile drawer */}
      {isSidebarOpen && (
        <div className="db-sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* ── SIDEBAR ─────────────────────────────────────────────────────── */}
      <aside className={`el-sidebar ${isSidebarOpen ? 'open' : ''}`}>

        {/* Logo de la plataforma */}
        <div className="db-logo">
          <span className="logo-nexus">NEXUS</span>
          <span className="logo-cobalt">COBALT</span>
        </div>

        {/* Menú de navegación — marca como 'active' el ítem de la ruta actual */}
        <nav className="db-nav">
          {navItems.map(item => (
            <Link
              key={item.id}
              to={item.path}
              className={`db-nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => setIsSidebarOpen(false)}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', width: '100%', justifyContent: 'space-between' }}>
                <span>{item.label}</span>
                {Number(item.badge) > 0 && (
                  <span
                    style={{
                      minWidth: '22px',
                      height: '22px',
                      padding: '0 7px',
                      borderRadius: '999px',
                      background: 'rgba(239,68,68,0.2)',
                      border: '1px solid rgba(239,68,68,0.45)',
                      color: '#fecaca',
                      fontSize: '11px',
                      fontWeight: '700',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </span>
            </Link>
          ))}
        </nav>

        {/* Sección inferior: info de usuario y botón de salida */}
        <div className="db-sidebar-bottom">
          <div className="db-user-card">
            {/* Avatar con foto de perfil Base64 o inicial del usuario real */}
            <div className="db-avatar" style={{ overflow: 'hidden' }}>
              {user?.profile_picture ? (
                <img src={user.profile_picture} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                userInitial
              )}
            </div>
            <div>
              <p className="db-username" title={username}>{username}</p>
              <p className="db-role">{roleName}</p>
            </div>
          </div>
          {/* Cierra la sesión activa */}
          <Link
            to="/"
            className="db-logout"
            onClick={() => {
              setIsSidebarOpen(false);
              logout();
            }}
          >
            ← Salir
          </Link>
        </div>

      </aside>

      {/* ── MAIN CONTENT ────────────────────────────────────────────────── */}
      <main className="el-main">
        {children}
      </main>

      {/* Asistente virtual J.A.R.V.I.S. */}
      <JarvisChat />
    </div>
  );
};

export default DashboardLayout;


