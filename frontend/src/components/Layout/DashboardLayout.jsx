import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../styles/EntityList.css'; // Contiene estilos de .el-container, .el-sidebar, .el-main
import JarvisChat from '../Chatbot/JarvisChat';

/**
 * DashboardLayout — Layout principal con sidebar para páginas del ecosistema
 *
 * Envuelve el contenido de cualquier página del ecosistema (Dashboard, Explorer,
 * Startups, Investors, Accelerators, Profile) añadiendo:
 * - Sidebar izquierdo con logo, navegación y usuario
 * - Área principal donde se renderiza {children}
 *
 * Resalta automáticamente el ítem activo comparando location.pathname
 * con el path de cada navItem.
 *
 * @param {React.ReactNode} children - Contenido de la página a renderizar en el main
 */
const DashboardLayout = ({ children }) => {
  // Obtiene la ruta actual para resaltar el nav-item activo
  const location = useLocation();

  // Estado para controlar la apertura del sidebar en pantallas móviles
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Definición de los ítems del menú lateral
  const navItems = [
    { path: '/dashboard', label: '📊 Dashboard', id: 'dash' },
    { path: '/explorer', label: '🗺️ Explorador', id: 'expl' },
    { path: '/startups', label: '🚀 Startups', id: 'start' },
    { path: '/investors', label: '💼 Inversores', id: 'inv' },
    { path: '/accelerators', label: '⚡ Aceleradoras', id: 'accel' },
    { path: '/profile', label: '👤 Mi Perfil', id: 'prof' },
  ];

  return (
    <div className="el-container">

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
          <div className="db-avatar">U</div>
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
            {/* Avatar con inicial del usuario (placeholder hasta integrar auth real) */}
            <div className="db-avatar">U</div>
            <div>
              <p className="db-username">Usuario</p>
              <p className="db-role">Emprendedor</p>
            </div>
          </div>
          {/* Redirige al landing al salir */}
          <Link to="/" className="db-logout" onClick={() => setIsSidebarOpen(false)}>← Salir</Link>
        </div>

      </aside>

      {/* ── MAIN CONTENT ────────────────────────────────────────────────── */}
      {/* Renderiza el contenido específico de cada página */}
      <main className="el-main">
        {children}
      </main>

      {/* Asistente virtual J.A.R.V.I.S. */}
      <JarvisChat />
    </div>
  );
};

export default DashboardLayout;
