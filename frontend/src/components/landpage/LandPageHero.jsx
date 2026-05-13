import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRocket, faShieldHalved, faChartLine } from '@fortawesome/free-solid-svg-icons';
import './LandPageHero.css';

// Using the generated image path
const HERO_IMAGE = '/hero_finance_future.png'; 

function LandPageHero() {
  return (
    <section className="hero-container overflow-hidden position-relative">
      {/* Decorative Blur Orbs */}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      
      <Container className="position-relative z-index-1">
        <Row className="min-vh-100 align-items-center pt-5">
          <Col lg={7} className="text-center text-lg-start">
            <h1 className="display-1 fw-800 mb-4 tracking-tighter mt-5 pt-lg-4">
              El Futuro de tu <br />
              <span className="text-gradient glow-text">Patrimonio Digital</span>
            </h1>
            
            <p className="lead text-light opacity-75 mb-4 fs-4 max-w-600">
              Conectamos startups disruptivas con inversores visionarios a través de una plataforma de alta precisión y seguridad de grado institucional.
            </p>

            <div className="badge-wrapper mb-5">
              <span className="glass-effect py-2 px-4 rounded-pill border-primary text-primary fw-bold tracking-widest text-uppercase small">
                <FontAwesomeIcon icon={faRocket} className="me-2" /> La Nueva Era del Capital
              </span>
            </div>
            
            <div className="d-flex flex-column flex-sm-row gap-4 justify-content-center justify-content-lg-start">
              <Link to="/Login" className="btn-neon px-5 py-3 fs-5">
                Empezar Ahora
              </Link>
              <Link to="/AboutUsPage" className="btn-outline-glass px-5 py-3 fs-5 text-decoration-none">
                Saber Más
              </Link>
            </div>

            <div className="mt-5 d-flex gap-5 justify-content-center justify-content-lg-start opacity-75">
              <div className="d-flex align-items-center gap-2">
                <FontAwesomeIcon icon={faShieldHalved} className="text-primary" />
                <span className="small fw-medium">Seguridad 256-bit</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <FontAwesomeIcon icon={faChartLine} className="text-primary" />
                <span className="small fw-medium">Métricas en Vivo</span>
              </div>
            </div>
          </Col>
          
          <Col lg={5} className="d-none d-lg-block">
            <div className="hero-image-wrapper">
              <div className="hero-image-frame glass-effect p-3 rounded-4">
                <img 
                  src={HERO_IMAGE} 
                  alt="Futuristic Finance" 
                  className="img-fluid rounded-3 shadow-2xl animate-float"
                />
              </div>
              {/* Floating Stats Card */}
              <div className="floating-card glass-effect p-4 rounded-3 shadow-lg">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="small text-muted">Capital Total</span>
                  <span className="badge bg-emerald-500/20 text-emerald-400">+24.5%</span>
                </div>
                <h3 className="h2 mb-0 fw-bold">$42.8M</h3>
                <div className="mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-75 shadow-primary"></div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default LandPageHero;
