import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldHeart, faHandshake, faLock, faMicrochip, faGlobe, faUserShield } from '@fortawesome/free-solid-svg-icons';
import './LandPageBenefits.css';

const benefits = [
  {
    title: 'Seguridad Institucional',
    description: 'Protocolos de cifrado de extremo a extremo y custodia de activos con los más altos estándares globales.',
    icon: faShieldHeart,
    color: '#00d4ff'
  },
  {
    title: 'Red Global de Élite',
    description: 'Acceso exclusivo a una comunidad curada de miles de Startups disruptivas y Aceleradoras de prestigio.',
    icon: faGlobe,
    color: '#7000ff'
  },
  {
    title: 'Privacidad Total',
    description: 'Sistema de mensajería encriptada para asegurar que tus negociaciones y datos permanezcan privados.',
    icon: faUserShield,
    color: '#facc15'
  },
  {
    title: 'Inteligencia de Datos',
    description: 'Métricas en tiempo real y análisis profundo para tomar decisiones informadas en cada inversión.',
    icon: faMicrochip,
    color: '#10b981'
  }
];

function LandPageBenefits() {
  return (
    <section className="section-padding bg-surface-dark overflow-hidden">
      <Container>
        <div className="text-center mb-5 pb-4">
          <span className="text-primary fw-bold text-uppercase tracking-widest small">Por qué elegirnos</span>
          <h2 className="display-4 fw-bold mt-2">
            Beneficios <span className="text-gradient">Premium</span>
          </h2>
          <p className="text-muted fs-5">Tecnología diseñada para maximizar tu impacto financiero.</p>
        </div>

        <Row className="g-4">
          {benefits.map((benefit, index) => (
            <Col lg={3} md={6} key={benefit.title}>
              <div className="benefit-card-new glass-effect p-4 h-100 transition-all">
                <div className="icon-wrapper mb-4 d-inline-flex p-3 rounded-3" style={{ background: `${benefit.color}15`, border: `1px solid ${benefit.color}30` }}>
                  <FontAwesomeIcon icon={benefit.icon} style={{ color: benefit.color, fontSize: '1.5rem' }} />
                </div>
                <h4 className="h5 fw-bold mb-3">{benefit.title}</h4>
                <p className="small mb-0" style={{color:'#ffff'}}>
                  {benefit.description}
                </p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}

export default LandPageBenefits;
