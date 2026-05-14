import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAward, faUsers, faLightbulb, faGlobeAmericas } from '@fortawesome/free-solid-svg-icons';
import './LandPageAboutUs.css';

function LandPageAboutUs() {
  const values = [
    {
      title: 'Excelencia',
      description: 'Comprometidos con los más altos estándares de calidad y profesionalismo.',
      icon: faAward,
      color: '#00d4ff'
    },
    {
      title: 'Comunidad',
      description: 'Construimos puentes entre emprendedores e inversores de clase mundial.',
      icon: faUsers,
      color: '#7000ff'
    },
    {
      title: 'Innovación',
      description: 'Impulsamos ideas disruptivas que transforman industrias y generan impacto.',
      icon: faLightbulb,
      color: '#facc15'
    },
    {
      title: 'Alcance Global',
      description: 'Conectamos oportunidades sin fronteras, con presencia en múltiples continentes.',
      icon: faGlobeAmericas,
      color: '#10b981'
    }
  ];

  return (
    <section className="about-us-section section-padding bg-dark overflow-hidden" id="about-us">
      <div className="orb orb-3"></div>
      <div className="orb orb-4"></div>
      
      <Container>
        {/* Header */}
        <div className="text-center mb-5 pb-4">
          <span className="text-primary fw-bold text-uppercase tracking-widest small">
            Nuestra Historia
          </span>
          <h2 className="display-4 fw-bold mt-2">
            Acerca de <span className="text-gradient">NexusCobalt</span>
          </h2>
          <p className="text-muted fs-5 max-w-700 mx-auto">
            Somos una plataforma fintech de nueva generación dedicada a revolucionar el ecosistema de inversión y emprendimiento en Latinoamérica.
          </p>
        </div>

        {/* Mission & Vision */}
        <Row className="mb-5 g-4">
          <Col lg={6}>
            <div className="glass-effect p-5 rounded-4 h-100 border border-primary/20">
              <h3 className="h4 fw-bold mb-3 text-primary">
                <FontAwesomeIcon icon={faLightbulb} className="me-2" />
                Nuestra Misión
              </h3>
              <p className="text-light lh-lg">
                Democratizar el acceso al capital para startups innovadoras y proporcionar a inversores acceso a las mejores oportunidades de inversión, eliminando barreras tradicionales y acelerando el crecimiento empresarial en el ecosistema emprendedor.
              </p>
            </div>
          </Col>
          <Col lg={6}>
            <div className="glass-effect p-5 rounded-4 h-100 border border-purple/20">
              <h3 className="h4 fw-bold mb-3 text-purple">
                <FontAwesomeIcon icon={faGlobeAmericas} className="me-2" />
                Nuestra Visión
              </h3>
              <p className="text-light lh-lg">
                Ser la plataforma líder en Latinoamérica para conexión entre capital e innovación, creando un ecosistema resiliente y transparente donde cada startup tiene la oportunidad de escalar y cada inversor puede acceder a oportunidades de alto impacto.
              </p>
            </div>
          </Col>
        </Row>

        {/* Core Values */}
        <div className="text-center mb-5 pb-4">
          <h3 className="h3 fw-bold">Nuestros Valores Fundamentales</h3>
        </div>

        <Row className="g-4">
          {values.map((value) => (
            <Col lg={3} md={6} key={value.title}>
              <div className="value-card glass-effect p-4 h-100 text-center transition-all hover-lift">
                <div className="value-icon mb-4 d-inline-flex p-4 rounded-circle" style={{ background: `${value.color}15`, border: `2px solid ${value.color}30` }}>
                  <FontAwesomeIcon 
                    icon={value.icon} 
                    style={{ color: value.color, fontSize: '2rem' }} 
                  />
                </div>
                <h4 className="h5 fw-bold mb-2">{value.title}</h4>
                <p className="small text-muted mb-0">{value.description}</p>
              </div>
            </Col>
          ))}
        </Row>

        {/* Stats */}
        <Row className="mt-5 g-4">
          <Col md={3}>
            <div className="text-center glass-effect p-4 rounded-4 stat-card">
              <h3 className="h2 fw-bold text-primary mb-2">500+</h3>
              <p className="text-muted mb-0">Startups Conectadas</p>
            </div>
          </Col>
          <Col md={3}>
            <div className="text-center glass-effect p-4 rounded-4 stat-card">
              <h3 className="h2 fw-bold text-primary mb-2">$250M+</h3>
              <p className="text-muted mb-0">Capital Invertido</p>
            </div>
          </Col>
          <Col md={3}>
            <div className="text-center glass-effect p-4 rounded-4 stat-card">
              <h3 className="h2 fw-bold text-primary mb-2">150+</h3>
              <p className="text-muted mb-0">Inversores Activos</p>
            </div>
          </Col>
          <Col md={3}>
            <div className="text-center glass-effect p-4 rounded-4 stat-card">
              <h3 className="h2 fw-bold text-primary mb-2">18</h3>
              <p className="text-muted mb-0">Países Cubiertos</p>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default LandPageAboutUs;
