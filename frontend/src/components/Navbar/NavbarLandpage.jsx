import React from 'react';
import { Link } from 'react-router-dom';
import './NavbarLandpage.css'; // Estilos específicos de esta barra de navegación

/**
 * NavbarLandpage — Barra de navegación para la landing page pública
 *
 * Componente stateless que muestra:
 * - Logo con enlace al home (/)
 * - Enlace "Acerca de nosotros" (/about)
 * - Botón de Login (/login)
 *
 * Nota: Este componente actualmente no está en uso en Landpage.jsx,
 * que tiene su navbar interna (lp-navbar). Puede integrarse o eliminarse
 * si se unifica la navegación pública.
 */
const Navbar = () => {
  return (
    <nav className="navbar">

      {/* Logo con enlace al home */}
      <div className="navbar-logo">
        <Link to="/" style={{ display: 'flex', gap: '0.5rem', textDecoration: 'none' }}>
          <span className="nexus">NEXUS</span>
          <span className="cobalt">COBALT</span>
        </Link>
      </div>

      {/* Botones de navegación */}
      <div className="navbar-links">
        <Link to="/about" className="nav-btn about-btn">Acerca de nosotros</Link>
        <Link to="/login" className="nav-btn login-btn">Login</Link>
      </div>

    </nav>
  );
};

export default Navbar;
