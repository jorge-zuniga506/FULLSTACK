import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './LandPageNavbar.css';

const NAV_LINKS = [
  { to: '/Login', label: 'LOGIN' },
  { to: '/Register', label: 'REGISTRO' },
  { to: '/AboutUsPage', label: 'SOBRE NOSOTROS' },
  { to: '/ContactUs', label: 'CONTACTO' },
];

function LandPageNavbar() {
  return (
    <div className="navbar-custom fixed-top">
      <Container className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-2">
          <div className="logo-box">&#9889;</div>
          <span className="logo-text">
            Nexxus<span className="text-primary">Cobalt</span>
          </span>
        </div>

        <div className="nav-links">
          {NAV_LINKS.map((link) => (
            <Link key={link.to} to={link.to}>
              {link.label}
            </Link>
          ))}
        </div>

        <Button className="btn-primary">
          <Link to="/DashboardAdmin" className="comenzar">
            Acceso Admin
          </Link>
        </Button>
      </Container>
    </div>
  );
}

export default LandPageNavbar;
