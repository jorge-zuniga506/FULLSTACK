import Services from '../services/Services';
import { Container, Row, Col, Form, Button, Card, Navbar, Nav } from 'react-bootstrap';
import ContactPage from '../pages/ContactPage';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
const ContactUs = () => {
  const [nombre, setNombre] = useState("");
  const [asunto, setAsunto] = useState("");
  const [rol, setRol] = useState("");
  const [mensaje, setMensaje] = useState("");
  function enviarMensajes() {
    const Mensaje = {
      nombre: nombre,
      asunto: asunto,
      rol: rol,
      mensaje: mensaje
    };
    if (!nombre ||!asunto|| rol === "0" || !mensaje) {
      alert("Por favor, complete todos los campos.");
    } else {
      alert("Mensaje Enviado");
      async function postMensaje(m) {
        await Services.postMensajesContactanos(m);
      }
      postMensaje(Mensaje);
    }
  }



  return (
    <div className="bg-dark text-white p-5" style={{ minHeight: '100vh', backgroundColor: '#0a0b10' }}>
      <Navbar variant="dark" className="mb-5">
        <Container>
          <Navbar.Brand href="#home" style={{ color: '#4a90e2', fontWeight: 'bold' }}>Nexxus Cobalt</Navbar.Brand>
          <Nav className="ms-auto">
            <Nav.Link href="/AboutUsPage">Sobre Nosotros</Nav.Link>
            <Nav.Link href="/" className="text-info">Pagina Principal</Nav.Link>
            <Nav.Link href="/Login">Iniciar Sesión</Nav.Link>
            <Button variant="outline-primary" className="ms-2">Registrarse</Button>
          </Nav>
        </Container>
      </Navbar>

      <Container>
        <Row className="gy-4">
          <Col md={5}>
            <div className="mb-4">
              <span className="text-primary small fw-bold">TRANSMISSION CONTROL</span>
              <h1 className="display-4 fw-bold mt-2">Conecta con <br /> <span style={{ color: '#4a90e2' }}>El nucleo del futuro.</span></h1>
              <p className="text-secondary mt-3">Our neural conduits are open. Reach out for deployment support or partnerships.</p>
            </div>

            <Card className="bg-secondary bg-opacity-10 border-primary mb-3 text-white">
              <Card.Body className="d-flex align-items-center">
                <div className="me-3 fs-3 text-info">@</div>
                <div>
                  <div className="small text-secondary">Correo Electrónico</div>
                  <div>nexuscobalt@gmail.com</div>
                </div>
              </Card.Body>
            </Card>


            <Card className="bg-secondary bg-opacity-10 border-secondary mb-3 text-white">
              <Card.Body className="d-flex align-items-center">
                <div className="me-3 fs-3 text-info">✽</div>
                <div>
                  <div className="small text-secondary">Global HQ</div>
                  <div>San José, Costa Rica</div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={{ span: 6, offset: 1 }}>
            <div className="p-4 rounded shadow-lg" style={{ backgroundColor: '#13151c', border: '1px solid #222' }}>
              <Form>
                <Row>
                  <Col>
                    <Form.Group className="mb-4">
                      <Form.Label className="small text-secondary">Nombre</Form.Label>
                      <Form.Control type="text" placeholder="Full Name" className="bg-dark border-secondary text-white" value={nombre} onChange={(e)=> setNombre(e.target.value)}/>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-4">
                      <Form.Label className="small text-secondary">Asunto</Form.Label>
                      <Form.Control type="text" placeholder="Subject" className="bg-dark border-secondary text-white" value={asunto} onChange={(e)=> setAsunto(e.target.value)}/>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-4">
                  <Form.Label className="small text-secondary">SECTOR ORIGIN</Form.Label>
                  <Form.Select className="bg-dark border-secondary text-white" value={rol} onChange={(e)=> setRol(e.target.value)}>
                    <option value="0">Seleccione una opción</option>
                    <option value="1">Inversor/Usuario</option>
                    <option value="2">Startup</option>
                    <option value="3">Aceleradora</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="small text-secondary">Mensaje</Form.Label>
                  <Form.Control as="textarea" rows={4} placeholder="Your message encrypted here..." className="bg-dark border-secondary text-white" value={mensaje} onChange={(e)=> setMensaje(e.target.value)}/>
                </Form.Group>

                <Button variant="primary" className="w-100 py-3 fw-bold text-uppercase" onClick={enviarMensajes}>
                  Enviar ➤
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ContactUs