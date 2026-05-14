import React, { useState, useEffect } from 'react';
import { Container, Nav, Navbar as BootstrapNavbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import './LandPageNavbar.css';

const NAV_LINKS = [
  { to: '/AboutUsPage', label: 'Nosotros' },
  { to: '/ContactUs', label: 'Contacto' },
  { to: '/Login', label: 'Login' },
];

function LandPageNavbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <BootstrapNavbar 
      expand="lg" 
      fixed="top" 
      className={`transition-all duration-300 ${scrolled ? 'py-2 glass-effect shadow-lg' : 'py-4 bg-transparent'}`}
    >
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2">
          <div className="p-2 bg-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
            <FontAwesomeIcon icon={faBolt} className="text-dark" />
          </div>
          <div className="brand-name h4 mb-0 fw-bold tracking-tighter">
            <span className="text-white">Nexus</span>
            <span className="text-primary">Cobalt</span>
          </div>
        </BootstrapNavbar.Brand>

        <BootstrapNavbar.Collapse id="landpage-nav">
          <Nav className="ms-auto align-items-center gap-4 mt-3 mt-lg-0">
            {NAV_LINKS.map((link) => (
              <Nav.Link 
                key={link.to} 
                as={Link} 
                to={link.to} 
                className="text-white-50 hover-text-primary fw-medium"
              >
                {link.label}
              </Nav.Link>
            ))}
            <Link to="/Login" className="btn-outline-primary text-decoration-none px-4 py-2 rounded" style={{border: '1px solid #00d4ff', color: '#00d4ff', transition: 'all 0.3s ease'}}>
              Login
            </Link>
            <Link to="/AboutUsPage" className="btn-outline-secondary text-decoration-none px-4 py-2 rounded" style={{border: '1px solid rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.7)', transition: 'all 0.3s ease'}}>
              Acerca de Nosotros
            </Link>
            <Link to="/Register" className="btn-neon text-decoration-none">
              Registrarse <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
            </Link>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
}

export default LandPageNavbar;
