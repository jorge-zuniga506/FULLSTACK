import React from 'react';
import { Container } from 'react-bootstrap';
import './LandPageFooter.css';

const FOOTER_LINKS = ['Privacidad', 'Terminos', 'Legal'];

function LandPageFooter() {
  return (
    <div className="footer">
      <Container className="d-flex justify-content-between flex-wrap">
        <div className="logo-text">
          Nexxus<span className="text-primary">Cobalt</span>
        </div>

        <div className="footer-links">
          {FOOTER_LINKS.map((label) => (
            <a key={label} href="#">
              {label}
            </a>
          ))}
        </div>
      </Container>
    </div>
  );
}

export default LandPageFooter;
