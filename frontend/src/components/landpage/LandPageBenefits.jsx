import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import './LandPageBenefits.css';

const benefits = [
  {
    title: 'Seguridad',
    description: 'Protección avanzada de activos.',
  },
  {
    title: 'Acceso a miles de Startups y Aceleradoras',
    description: 'Protección avanzada de activos.',
  },
  {
    title: 'Privacidad',
    description: 'Protección de mensajes para garantizar tu privacidad.',
  },
];

function LandPageBenefits() {
  return (
    <Container className="section">
      <div className="text-center mb-5">
        <h2>
          Beneficios <span className="orange-glow">Exclusivos</span>
        </h2>
        <p>Experiencia de inversión moderna</p>
      </div>

      <Row className="one">
        {benefits.map((benefit) => (
          <Col md={4} key={benefit.title} className="two">
            <Card className="benefit-card">
              <Card.Body>
                <div className="icon-box">⚡</div>
                <h5>{benefit.title}</h5>
                <p>{benefit.description}</p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default LandPageBenefits;
