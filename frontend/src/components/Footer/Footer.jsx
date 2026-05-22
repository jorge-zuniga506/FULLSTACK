import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Por favor, ingresa tu correo.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Introduce un correo válido.');
      return;
    }

    // Mock newsletter subscription logic
    setIsSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="universal-footer">
      <div className="footer-glow-orb-1"></div>
      <div className="footer-glow-orb-2"></div>
      
      <div className="footer-container">
        
        {/* Column 1: Brand & Socials */}
        <div className="footer-brand-col">
          <div className="footer-logo">
            <span className="logo-nexus">NEXUS</span>
            <span className="logo-cobalt">COBALT</span>
          </div>
          <p className="footer-pitch">
            Redefiniendo el acceso a capital de riesgo y acelerando el crecimiento 
            del ecosistema tecnológico en América Latina.
          </p>
          <div className="footer-socials">
            <a href="#twitter" className="footer-social-btn" aria-label="X (Twitter)">𝕏</a>
            <a href="#linkedin" className="footer-social-btn" aria-label="LinkedIn">in</a>
            <a href="#github" className="footer-social-btn" aria-label="GitHub">git</a>
            <a href="#discord" className="footer-social-btn" aria-label="Discord">👾</a>
          </div>
        </div>

        {/* Column 2: Explore Routes */}
        <div className="footer-links-col">
          <h3>Ecosistema</h3>
          <ul className="footer-links-list">
            <li><Link to="/dashboard">📊 Dashboard</Link></li>
            <li><Link to="/explorer">🗺️ Explorador</Link></li>
            <li><Link to="/startups">🚀 Startups</Link></li>
            <li><Link to="/investors">💼 Inversores</Link></li>
            <li><Link to="/accelerators">⚡ Aceleradoras</Link></li>
          </ul>
        </div>

        {/* Column 3: Platform Resources */}
        <div className="footer-links-col">
          <h3>Plataforma</h3>
          <ul className="footer-links-list">
            <li><Link to="/about">🔍 Acerca de</Link></li>
            <li><Link to="/PublishGeneral">📝 Publicar Proyecto</Link></li>
            <li><Link to="/proximamente">📚 Recursos & FAQ</Link></li>
            <li><Link to="/proximamente">🔓 Developer API</Link></li>
            <li><Link to="/proximamente">🛡️ Privacidad & Términos</Link></li>
          </ul>
        </div>

        {/* Column 4: Newsletter */}
        <div className="footer-newsletter-col">
          <h3>Únete al Ecosistema</h3>
          <p className="newsletter-pitch">
            Recibe semanalmente los mejores deals de inversión y noticias del ecosistema tecnológico.
          </p>
          
          {isSubscribed ? (
            <div className="newsletter-success">
              <span className="success-emoji">✨</span>
              <p>¡Te has suscrito con éxito, señor!</p>
            </div>
          ) : (
            <form className="footer-newsletter-form" onSubmit={handleSubscribe} noValidate>
              <div className={`newsletter-input-group ${error ? 'has-error' : ''}`}>
                <input
                  type="email"
                  placeholder="Tu correo electrónico"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  required
                />
                <button type="submit" className="newsletter-submit-btn" title="Suscribirse">
                  ⚡
                </button>
              </div>
              {error && <span className="newsletter-error-msg">{error}</span>}
            </form>
          )}
        </div>

      </div>

      {/* Bottom Footer Section */}
      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p className="copyright-text">
            &copy; {new Date().getFullYear()} Nexus Cobalt. Todos los derechos reservados.
          </p>
          
          {/* Sci-Fi Status Widget */}
          <div className="footer-status-widget">
            <span className="status-pulse-dot"></span>
            <span className="status-text">System Status: Active // J.A.R.V.I.S. Online</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
