import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import './LandPageCTA.css';

function LandPageCTA() {
  return (
    <section className="section-padding position-relative overflow-hidden">
      <div className="cta-bg-glow"></div>
      <Container>
        <div className="glass-effect p-5 p-lg-10 rounded-5 border-primary shadow-2xl position-relative z-index-1">
          <Row className="align-items-center">
            <Col lg={8} className="text-center text-lg-start mb-5 mb-lg-0">
              <h2 className="display-3 fw-bold tracking-tighter mb-4">
                ¿Listo para elevar tus <br />
                <span className="text-gradient">finanzas al siguiente nivel?</span>
              </h2>
              <p className="lead text-white-50 mb-0 fs-4">
                Únete a la red más exclusiva de startups e inversores. Solicita tu acceso hoy mismo.
              </p>
            </Col>
            <Col lg={4} className="text-center text-lg-end">
              <Link to="/ContactUs" className="btn-neon px-4 py-2 d-inline-block">
                Solicitar Acceso <FontAwesomeIcon icon={faPaperPlane} className="ms-2" />
              </Link>
              <p className="mt-4 small text-muted">Respuesta garantizada en menos de 24h.</p>
            </Col>
          </Row>
        </div>
      </Container>
    </section>
  );
}

export default LandPageCTA;
