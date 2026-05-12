import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './LandPageHero.css';

const HERO_CONTENT = {
  badge: 'Inversiones de Clase Mundial',
  title: 'El Futuro de su',
  highlight: 'Patrimonio',
  description: 'Acceda a oportunidades exclusivas en startups y mercados globales.',
};

function LandPageHero() {
  return (
    <div className="hero-section">
      <Container>
        <Row className="align-items-center">
          <Col lg={6}>
            <span className="badge-custom">{HERO_CONTENT.badge}</span>

            <h1 className="hero-title">
              {HERO_CONTENT.title} <br />
              <span className="accent-glow">{HERO_CONTENT.highlight}</span>
            </h1>

            <p className="hero-text">{HERO_CONTENT.description}</p>

            <div className="d-flex gap-3">
              <Button className="btn-primary">
                <Link to="/Login" className="comenzar">
                  Comenzar &rarr;
                </Link>
              </Button>
            </div>
          </Col>

          <Col lg={6} className="d-none d-lg-block">
            <Card className="stats-card">
              <Card.Body>
                <div className="d-flex justify-content-between">
                  <span>Capital</span>
                  <span className="text-warning">+18%</span>
                </div>
                <h2>$42.8M</h2>
                <div className="progress">
                  <div className="progress-bar w-75"></div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default LandPageHero;
