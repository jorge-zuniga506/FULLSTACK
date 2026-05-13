import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt } from '@fortawesome/free-solid-svg-icons';
import { faTwitter, faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import './LandPageFooter.css';

function LandPageFooter() {
  return (
    <footer className="footer-new py-5 mt-5 border-t border-white/5 bg-deep">
      <Container>
        <Row className="gy-4">
          <Col lg={4} md={12}>
            <div className="d-flex align-items-center gap-2 mb-4">
              <div className="p-2 bg-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '35px', height: '35px' }}>
                <FontAwesomeIcon icon={faBolt} className="text-dark small" />
              </div>
              <span className="h4 mb-0 fw-bold tracking-tighter">
                Nexus<span className="text-primary">Cobalt</span>
              </span>
            </div>
            <p className="text-muted small max-w-300">
              Transformando la inversión en startups a través de tecnología de punta y conexiones estratégicas globales.
            </p>
            <div className="d-flex gap-3 mt-4">
              <a href="#" className="text-muted hover-text-primary"><FontAwesomeIcon icon={faTwitter} size="lg" /></a>
              <a href="#" className="text-muted hover-text-primary"><FontAwesomeIcon icon={faLinkedin} size="lg" /></a>
              <a href="#" className="text-muted hover-text-primary"><FontAwesomeIcon icon={faGithub} size="lg" /></a>
            </div>
          </Col>
          
          <Col lg={2} md={4} xs={6}>
            <h6 className="fw-bold mb-4 text-white">Plataforma</h6>
            <ul className="list-unstyled space-y-2">
              <li><Link to="/Mapa" className="text-muted text-decoration-none small hover-text-primary">Mapa de Ecosistema</Link></li>
              <li><Link to="/PublicoStartups" className="text-muted text-decoration-none small hover-text-primary">Startups</Link></li>
              <li><Link to="/AceleradorasBuscador" className="text-muted text-decoration-none small hover-text-primary">Aceleradoras</Link></li>
            </ul>
          </Col>
          
          <Col lg={2} md={4} xs={6}>
            <h6 className="fw-bold mb-4 text-white">Compañía</h6>
            <ul className="list-unstyled space-y-2">
              <li><Link to="/AboutUsPage" className="text-muted text-decoration-none small hover-text-primary">Sobre Nosotros</Link></li>
              <li><Link to="/ContactUs" className="text-muted text-decoration-none small hover-text-primary">Contacto</Link></li>
              <li><Link to="/Login" className="text-muted text-decoration-none small hover-text-primary">Login</Link></li>
            </ul>
          </Col>
          
          <Col lg={4} md={4}>
            <h6 className="fw-bold mb-4 text-white">Suscríbete</h6>
            <p className="text-muted small mb-4">Recibe las últimas noticias y oportunidades del ecosistema.</p>
            <div className="input-group glass-effect rounded-pill p-1">
              <input type="text" className="form-control bg-transparent border-0 text-white ps-3 small" placeholder="Tu email" />
              <button className="btn btn-primary rounded-pill px-4 small fw-bold">Unirse</button>
            </div>
          </Col>
        </Row>
        
        <hr className="my-5 border-white/5" />
        
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
          <p className="text-muted small mb-0">© 2026 Nexus Cobalt Inc. Todos los derechos reservados.</p>
          <div className="d-flex gap-4">
            <a href="#" className="text-muted text-decoration-none small hover-text-white">Privacidad</a>
            <a href="#" className="text-muted text-decoration-none small hover-text-white">Términos</a>
            <a href="#" className="text-muted text-decoration-none small hover-text-white">Cookies</a>
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default LandPageFooter;
