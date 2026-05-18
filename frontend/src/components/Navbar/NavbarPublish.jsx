import React from 'react';
import { Link } from 'react-router-dom';
import './NavbarPublish.css';

const NavbarPublish = () => {
  return (
    <nav className="navbar-publish">
      <div className="np-logo">
        <Link to="/" className="np-logo-link">
          <span className="np-nexus">NEXUS</span>
          {/* Usamos un tono morado para que haga match con la pestaña de "Registro Startup" */}
          <span className="np-cobalt">COBALT</span>
        </Link>
      </div>

      <div className="np-actions">
        {/* Un botón sutil para salir del formulario sin guardar */}
        <Link to="/" className="np-cancel-btn">
          Cancelar
        </Link>
      </div>
    </nav>
  );
};

export default NavbarPublish;