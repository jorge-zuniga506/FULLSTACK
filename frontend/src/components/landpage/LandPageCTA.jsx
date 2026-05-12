import React from 'react';
import { Container, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './LandPageCTA.css';

const CTA_CONTENT = {
  title: '¿Listo para elevar sus',
  highlight: 'finanzas',
  subtitle: 'Solicite acceso exclusivo',
};

function LandPageCTA() {
  return (
    <div className="cta-section">
      <Container className="text-center">
        <h2>
          {CTA_CONTENT.title} <span className="accent-glow">{CTA_CONTENT.highlight}</span>?
        </h2>
        <p>{CTA_CONTENT.subtitle}</p>

        <Form className="d-flex gap-3 justify-content-center flex-wrap">
          <Button className="btn-primary">
            <Link to="/ContactUs">Contáctanos</Link>
          </Button>
        </Form>
      </Container>
    </div>
  );
}

export default LandPageCTA;
