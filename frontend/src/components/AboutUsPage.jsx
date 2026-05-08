import React from 'react'
import { Navbar, Nav, Container, Row, Col, Card, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function AboutUsPage() {

  return (
    <div style={{ backgroundColor: "#060e20", color: "#dee5ff" }}>
      
      <Navbar expand="lg" fixed="top" bg="dark" variant="dark" className="py-3 shadow">
        <Container>
          <Navbar.Brand>Nexus Cobalt</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="mx-auto">
              <Nav.Link href="#">Home</Nav.Link>
              <Nav.Link active href="#">About Us</Nav.Link>
              <Nav.Link href="#">Home</Nav.Link>
              <Nav.Link href="#">Contact</Nav.Link>
            </Nav>
            <Button variant="primary">Get Started</Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Hero */}
      <section className="text-center" style={{ paddingTop: "100px"}}>
        <Container>
          <p className="text-warning fw-bold">SOBRE NOSOTROS</p>
          <h1 className="display-3 fw-bold">Nuestra Misión</h1>
          <p className="lead">
            Actualmente hay falta de guía en lo respecta a la inversión y la búsqueda de empresas en las cuales invertir.
            Esto hace que invertir se vuelva confuso y complejo para las personas que buscan empresas con potencial a futuro.
          </p>
        </Container>
      </section>

      <section className="py-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAAuof7kuWv9uEydLiSuewLPLlTLRx6AQycnQT97xOIS6eEn-li-374Mfxm91xEWPVm971_SqmJ7cWyzUdoc2CsTRaLzT18_7CjO6K6v296AGanoeBJ_ZEXMt0l4Ur-xKdIUBS56cEOBBFhxy1jLKw8W0JzkMvkKKvOCWzbP8Uuz58sWM9WnCLjCQU69Mr9hFtMakQnQRqbpNOZvFnHNBDS6EYG1s79ilBnTY78yZYF1Ff5GsbK7Zuqd78UV7vmo8Ncidmymlw0Eqwa"
                alt="office"
                className="img-fluid rounded"
              />
            </Col>
            <Col lg={6}>
              <h2>Nuestra Historia</h2>
              <p>
                StartupHub nació de una observación crítica en el ecosistema emprendedor: el abismo existente entre las ideas disruptivas y el capital necesario para escalarlas.
              </p>
              <p>
                Fundada por veteranos de la industria financiera y tecnológica, nuestra plataforma se diseñó para democratizar el acceso al financiamiento institucional.
              </p>
              <p>
                Hoy, somos el puente que conecta el talento audaz con inversores visionarios.
              </p>
            </Col>
          </Row>
        </Container>
      </section>
      <section className="py-5 bg-dark">
        <Container>
          <div className="text-center mb-5">
            <h2>Valores Fundamentales</h2>
            <p>Los pilares que sostienen nuestras decisiones.</p>
          </div>

          <Row>
            {["Transparencia", "Innovación", "Impacto"].map((item, i) => (
              <Col md={4} key={i} className="mb-4">
                <Card className="h-100 bg-secondary text-light">
                  <Card.Body>
                    <Card.Title>{item}</Card.Title>
                    <Card.Text>
                      Contenido descriptivo del valor empresarial.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="py-5">
        <Container>
          <div className="mb-5">
            <h2>Nuestro Equipo</h2>
            <p>Mentes brillantes unidas por un único objetivo.</p>
          </div>

          <Row>
            {["Alejandro Rivas", "Sofia Chen", "Lucas Meyer", "Isabel García"].map((name, i) => (
              <Col md={3} key={i} className="text-center mb-4">
                <div className="bg-dark rounded mb-3" style={{ height: "200px" }}></div>
                <h5>{name}</h5>
                <p className="text-primary">Cargo</p>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <footer>
        <Container>
          <p>© 2026 Nexus Cobalt</p>
        </Container>
      </footer>
    </div>
  );
}

export default AboutUsPage