import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar/NavbarLandpage';
import About from '../../components/About/About';
import AboutContact from '../../components/About/AboutContact';
import Footer from '../../components/Footer/Footer';
import '../../styles/About.css';

/**
 * AboutPage — Standalone page for About section
 */
const AboutPage = () => {
  return (
    <div className="about-page-wrapper">
      {/* Dynamic Navbar */}
      <Navbar />
    

      {/* Modern Premium Sub-Hero Header */}
      <header className="about-page-hero">
        <div className="about-page-hero-overlay"></div>
        <div className="about-page-hero-content">
          <span className="about-page-tag">SOBRE NOSOTROS</span>
          <h1 className="about-page-title">Nuestra Historia y Filosofía</h1>
          <p className="about-page-subtitle">
            Descubre cómo estamos redefiniendo la visibilidad y el crecimiento de las startups en América Latina.
          </p>
        </div>
      </header>

      {/* Modular About Component */}
      <About />

      {/* Modern Premium Contact Form */}
      <AboutContact />

      {/* Premium CTA Bottom Section */}
      <section className="about-cta-section">
        <div className="about-cta-glow"></div>
        <div className="about-cta-card">
          <h2>¿Listo para ser parte del cambio?</h2>
          <p>
            Únete a cientos de fundadores e inversionistas que ya están transformando la región de la mano de Nexus Cobalt.
          </p>
          <div className="about-cta-actions">
            <Link to="/PublishGeneral" className="cta-btn-primary">
              Dar de alta mi proyecto
            </Link>
            <Link to="/proximamente" className="cta-btn-secondary">
              Explorar Ecosistema
            </Link>
          </div>
        </div>
      </section>

      {/* Universal footer */}
      <Footer />
    </div>
  );
};

export default AboutPage;
