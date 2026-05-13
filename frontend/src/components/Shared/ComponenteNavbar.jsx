import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt } from '@fortawesome/free-solid-svg-icons';
import "../../styles/Navbar.css";

function ComponenteNavbar() {
  return (
    <Navbar expand="lg" className="custom-navbar">
      <Container fluid>
        <Navbar.Brand href="/" className="navbar-brand">
          <div className="brand-icon">
            <FontAwesomeIcon icon={faBolt} />
          </div>
          <span className="brand-text-nexus">Nexus</span>
          <span className="brand-text-cobalt">Cobalt</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="nav-center">
            <Nav.Link href="/login" className="nav-link">Login</Nav.Link>
            <Nav.Link href="/registro" className="nav-link">Registro</Nav.Link>
            <Nav.Link href="/sobre-nosotros" className="nav-link">Sobre Nosotros</Nav.Link>
            <Nav.Link href="/contactanos" className="nav-link">Cont¡ctanos</Nav.Link>
          </Nav>
          
          <Button className="admin-access-btn">
            Acceso Admin
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default ComponenteNavbar;



