import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './NavbarLandpage.css'; // <-- Aquí está tu archivo CSS

const NavbarLandpage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [showModal, setShowModal] = useState(false); // Estado para la ventana emergente

  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    const sectionIds = ['hero', 'features', 'ecosystem', 'stats'];

    const updateSection = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3;
      let currentSection = 'hero';

      for (const sectionId of sectionIds) {
        const section = document.getElementById(sectionId);
        if (section && section.offsetTop <= scrollPosition) {
          currentSection = sectionId;
        }
      }

      setActiveSection(currentSection);
    };

    updateSection();
    window.addEventListener('scroll', updateSection, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateSection);
    };
  }, []);

  const navItems = [
    { id: 'hero', label: 'Inicio' },
    { id: 'PublicoStartups', label: 'startups' },
    { id: 'PublicoFounders', label: 'founders' },
    { id: 'PublicoInversionistas', label: 'inversionistas' }
  ];

  return (
    <>
      <nav className="navbar">
        <div className="navbar-logo" onClick={closeMenu}>
          <Link to="/" className="navbar-logo-link">
            <span className="nexus">NEXUS</span>
            <span className="cobalt">COBALT</span>
          </Link>
        </div>

        <div className="navbar-links">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
              onClick={closeMenu}
            >
              {item.label}
            </a>
          ))}
          {/* Cambiado a botón para abrir la ventana emergente */}
          <button className="nav-btn login-btn" onClick={() => { setShowModal(true); closeMenu(); }}>
            Iniciar Sesión
          </button>
        </div>

        <button
          type="button"
          className={`navbar-toggle ${isOpen ? 'active' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Alternar navegación"
        >
          <span />
          <span />
          <span />
        </button>

        <div className={`navbar-menu ${isOpen ? 'open' : ''}`}>
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="navbar-menu-link"
              onClick={closeMenu}
            >
              {item.label}
            </a>
          ))}
          {/* Cambiado a botón en responsive */}
          <button className="navbar-menu-cta" style={{ border: 'none', cursor: 'pointer' }} onClick={() => { setShowModal(true); closeMenu(); }}>
            Iniciar Sesión
          </button>
        </div>
      </nav>

      {/* ── VENTANA EMERGENTE (MODAL) PREMIUM ────────────────────────────── */}
      {showModal && (
        <div className="nav-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="nav-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="nav-modal-close" onClick={() => setShowModal(false)} aria-label="Cerrar ventana">
              &times;
            </button>
            <div className="nav-modal-header">
              <h2 className="nav-modal-title">¿Cómo deseas ingresar?</h2>
              <p className="nav-modal-subtitle">
                Accede a tu panel personalizado o únete a la comunidad del ecosistema.
              </p>
            </div>
            
            <div className="nav-modal-options">
              {/* Opción 1: Iniciar Sesión Normal */}
              <Link to="/login" className="nav-modal-option" onClick={() => setShowModal(false)}>
                <div className="nav-modal-option-icon">👤</div>
                <div className="nav-modal-option-content">
                  <h3 className="nav-modal-option-title">Acceso Emprendedor</h3>
                  <p className="nav-modal-option-desc">
                    Inicia sesión de forma estándar para gestionar tu perfil y revisar tus estadísticas.
                  </p>
                </div>
                <span className="nav-modal-arrow">&rarr;</span>
              </Link>

              {/* Opción 2: Unirse como Startup (Publicar) */}
              <Link to="/PublishGeneral" className="nav-modal-option highlight" onClick={() => setShowModal(false)}>
                <div className="nav-modal-option-icon highlight-icon">🚀</div>
                <div className="nav-modal-option-content">
                  <h3 className="nav-modal-option-title">Publicarse en la Vitrina</h3>
                  <p className="nav-modal-option-desc">
                    Únete al ecosistema publicándote como Startup, Founder destacado o Inversionista activo.
                  </p>
                </div>
                <span className="nav-modal-arrow">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NavbarLandpage;