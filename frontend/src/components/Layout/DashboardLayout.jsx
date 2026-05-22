import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/EntityList.css'; // Contiene estilos de .el-container, .el-sidebar, .el-main
import JarvisChat from '../Chatbot/JarvisChat';

/**
 * DashboardLayout — Layout principal con sidebar para páginas del ecosistema
 */
const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  // Estado para controlar la apertura del sidebar en pantallas móviles
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
        { path: '/dashboard/admin', label: '⚙️ Control de Misión', id: 'dash' },
        { path: '/explorer', label: '🗺️ Explorador Global', id: 'expl' },
        { path: '/startups', label: '🚀 Gestionar Startups', id: 'start' },
        { path: '/investors', label: '💼 Gestionar Inversores', id: 'inv' },
        { path: '/accelerators', label: '⚡ Gestionar Aceleradoras', id: 'accel' },
        { path: '/profile', label: '👤 Perfil del Sistema', id: 'prof' },
      ];
    } else if (roleId === 2) { // Emprendedor / Startup
      return [
        { path: '/dashboard/startup', label: '🚀 Panel de Mi Startup', id: 'dash' },
        { path: '/investors', label: '💼 Buscar Inversionistas', id: 'inv' },
        { path: '/accelerators', label: '⚡ Encontrar Aceleración', id: 'accel' },
        { path: '/explorer', label: '🔍 Explorar Ecosistema', id: 'expl' },
        { path: '/profile', label: '👤 Perfil de Startup', id: 'prof' },
      ];
    } else if (roleId === 3) { // Aceleradora
      return [
        { path: '/dashboard/aceleradora', label: '⚡ Panel de Aceleradora', id: 'dash' },
        { path: '/startups', label: '🚀 Buscar Startups', id: 'start' },
        { path: '/investors', label: '💼 Red de Inversores', id: 'inv' },
        { path: '/explorer', label: '🔍 Explorador de Red', id: 'expl' },
        { path: '/profile', label: '👤 Perfil Institucional', id: 'prof' },
      ];
    } else if (roleId === 4) { // Inversionista
      return [
        { path: '/dashboard/inversor', label: '💼 Panel de Inversor', id: 'dash' },
        { path: '/startups', label: '🚀 Buscar Oportunidades', id: 'start' },
        { path: '/accelerators', label: '⚡ Red de Aceleradoras', id: 'accel' },
        { path: '/explorer', label: '🔍 Radar de Mercado', id: 'expl' },
        { path: '/profile', label: '👤 Perfil Inversionista', id: 'prof' },
      ];
    }

    // Default fallback
    return [
      { path: '/dashboard', label: '📊 Dashboard General', id: 'dash' },
      { path: '/explorer', label: '🗺️ Explorador', id: 'expl' },
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
              {item.label}
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

