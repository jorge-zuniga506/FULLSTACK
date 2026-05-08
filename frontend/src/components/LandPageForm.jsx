import React from 'react'
import { Navbar, Nav, Container, Row, Col, Button, Card, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import LandPage from '../pages/LandPage'
import { Link } from 'react-router-dom';
import '../styles/LandPage.css';
function LandPageForm() {
  return (
    <div className="startup-theme">

      {/* NAVBAR */}
      <div className="navbar-custom fixed-top">
        <Container className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <div className="logo-box">⚡</div>
            <span className="logo-text">
              Nexxus<span className="text-primary">Cobalt</span>
            </span>
          </div>

          <div className="nav-links">
            <a href="/Login">LOGIN</a>
            <a href="/Register">REGISTRO</a>
            <a href="/AboutUsPage">SOBRE NOSOTROS</a>
            <a href="/ContactUS">CONTACTO</a>
          </div>

          <Button className="btn-primary"><Link to="/DashboardAdmin" className='comenzar'>Acceso Admin</Link></Button>
        </Container>
      </div>

      {/* HERO */}
      <div className="hero-section">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <span className="badge-custom">
                Inversiones de Clase Mundial
              </span>

              <h1 className="hero-title">
                El Futuro de su <br />
                <span className="accent-glow">Patrimonio</span>
              </h1>

              <p className="hero-text">
                Acceda a oportunidades exclusivas en startups y mercados globales.
              </p>

              <div className="d-flex gap-3">
                <Button className="btn-primary"><Link to="/Login" className='comenzar'>Comenzar →</Link></Button>
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

      {/* BENEFICIOS */}
      <Container className="section">
        <div className="text-center mb-5">
          <h2>
            Beneficios <span className="orange-glow">Exclusivos</span>
          </h2>
          <p>Experiencia de inversión moderna</p>
        </div>

        <Row className='one'>
          {[1].map((i) => (
            <Col md={4} key={i} className='two'>
              <Card className="benefit-card">
                <Card.Body>
                  <div className="icon-box">⚡</div>
                  <h5>Seguridad</h5>
                  <p>Protección avanzada de activos.</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
          {[1].map((i) => (
            <Col md={4} key={i}>
              <Card className="benefit-card">
                <Card.Body>
                  <div className="icon-box">⚡</div>
                  <h5>Acceso a miles de Startups y Aceleradoras</h5>
                  <p>Protección avanzada de activos.</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
          {[1].map((i) => (
            <Col md={4} key={i}>
              <Card className="benefit-card">
                <Card.Body>
                  <div className="icon-box">⚡</div>
                  <h5>Privacidad</h5>
                  <p>Protección de mensajes para garantizar tu privacidad.</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* CTA */}
      <div className="cta-section">
        <Container className="text-center">
          <h2>
            ¿Listo para elevar sus <span className="accent-glow">finanzas</span>?
          </h2>
          <p>Solicite acceso exclusivo</p>

          <Form className="d-flex gap-3 justify-content-center flex-wrap">
            <Button className="btn-primary"><Link to="/ContactUs" >Contactanos</Link></Button>
          </Form>
        </Container>
      </div>

      {/* FOOTER */}
      <div className="footer">
        <Container className="d-flex justify-content-between flex-wrap">
          <div className="logo-text">
            Nexxus<span className="text-primary">Cobalt</span>
          </div>
          <div className="footer-links">
            <a href="#">Privacidad</a>
            <a href="#">Términos</a>
            <a href="#">Legal</a>
          </div>
        </Container>
      </div>

    </div>
  );
}

export default LandPageForm