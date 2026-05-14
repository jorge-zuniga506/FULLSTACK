import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, Link } from 'react-router-dom';
import './LandPageLogin.css';

function LandPageLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email || !password) {
      setError('Por favor ingrese email y contraseña');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('usuario', JSON.stringify(data.usuario));
        navigate('/dashboard');
      } else {
        setError(data.message || 'Error al iniciar sesión');
      }
    } catch (err) {
      setError('Error de conexión. Verifica tu conexión a internet.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="login-section section-padding overflow-hidden" id="login">
      <div className="login-orb orb-login-1"></div>
      <div className="login-orb orb-login-2"></div>

      <Container>
        <Row className="align-items-center">
          {/* Left Side - Info */}
          <Col lg={6} className="d-none d-lg-block">
            <div className="login-info">
              <h2 className="display-5 fw-bold mb-4">
                Accede a tu <span className="text-gradient">Cuenta</span>
              </h2>
              <p className="lead text-muted mb-4">
                Inicia sesión en NexusCobalt y accede a las mejores oportunidades de inversión y crecimiento empresarial.
              </p>

              <div className="benefits-list">
                <div className="benefit-item mb-3 d-flex align-items-start">
                  <div className="benefit-icon me-3">
                    <FontAwesomeIcon icon={faLock} />
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1">Seguridad de Nivel Institucional</h5>
                    <p className="small text-muted mb-0">Cifrado de extremo a extremo en todas tus transacciones</p>
                  </div>
                </div>

                <div className="benefit-item mb-3 d-flex align-items-start">
                  <div className="benefit-icon me-3">
                    <FontAwesomeIcon icon={faEnvelope} />
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1">Comunicación Encriptada</h5>
                    <p className="small text-muted mb-0">Mensajes privados protegidos con tecnología blockchain</p>
                  </div>
                </div>

                <div className="benefit-item d-flex align-items-start">
                  <div className="benefit-icon me-3">
                    <FontAwesomeIcon icon={faEnvelope} />
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1">Acceso Inmediato</h5>
                    <p className="small text-muted mb-0">Dashboard personalizado y herramientas avanzadas al instante</p>
                  </div>
                </div>
              </div>
            </div>
          </Col>

          {/* Right Side - Form */}
          <Col lg={6}>
            <div className="login-card glass-effect p-5 rounded-4">
              <h3 className="h4 fw-bold mb-4">Iniciar Sesión</h3>

              {error && (
                <Alert variant="danger" className="mb-4 alert-custom">
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold mb-2">Correo Electrónico</Form.Label>
                  <div className="input-wrapper">
                    <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                    <Form.Control
                      type="email"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-modern"
                      disabled={isLoading}
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <Form.Label className="fw-bold mb-0">Contraseña</Form.Label>
                    <Link to="/forgot-password" className="text-primary text-decoration-none small">
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </div>
                  <div className="input-wrapper">
                    <FontAwesomeIcon icon={faLock} className="input-icon" />
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input-modern"
                      disabled={isLoading}
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Check 
                    type="checkbox" 
                    label="Recuérdame en este dispositivo"
                    id="remember-me"
                    className="custom-checkbox"
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  className="btn-login w-100 fw-bold py-2 mb-3"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} className="me-2 spinner" />
                      Iniciando sesión...
                    </>
                  ) : (
                    'Iniciar Sesión'
                  )}
                </Button>

                <div className="text-center">
                  <p className="text-muted small mb-0">
                    ¿No tienes cuenta?{' '}
                    <Link to="/register" className="text-primary text-decoration-none fw-bold">
                      Registrate aquí
                    </Link>
                  </p>
                </div>
              </Form>

              {/* Social Login Options */}
              <div className="mt-5 pt-4 border-top border-secondary">
                <p className="text-center text-muted small mb-4">O continúa con</p>
                <div className="d-flex gap-3">
                  <Button variant="outline-secondary" className="flex-grow-1 btn-social">
                    <span>Google</span>
                  </Button>
                  <Button variant="outline-secondary" className="flex-grow-1 btn-social">
                    <span>GitHub</span>
                  </Button>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default LandPageLogin;
