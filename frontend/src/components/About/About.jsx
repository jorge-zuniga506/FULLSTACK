import React from 'react';
import '../../styles/About.css';

const About = () => {
  return (
    <section className="about-section" id="about">
      <div className="about-container">
        
        {/* Left Side: Content & Features */}
        <div className="about-content">
          <span className="about-badge">🔍 ¿Qué es Nexus Cobalt?</span>
          <h2 className="about-title">Conectamos las piezas del ecosistema tecnológico</h2>
          <p className="about-desc">
            Nexus Cobalt es la vitrina y plataforma interactiva líder diseñada para potenciar el
            crecimiento del ecosistema emprendedor en América Latina. Facilitamos la visibilidad y
            el contacto directo entre startups innovadoras, fundadores apasionados e inversionistas
            visionarios.
          </p>
          
          <div className="about-features">
            <div className="about-feat-item">
              <div className="about-feat-icon">🚀</div>
              <div>
                <h4>Visibilidad Startup</h4>
                <p>Muestra tu propuesta de valor a corporativos e inversionistas en tiempo real.</p>
              </div>
            </div>
            
            <div className="about-feat-item">
              <div className="about-feat-icon">🤝</div>
              <div>
                <h4>Conexiones de Valor</h4>
                <p>Encuentra co-founders capacitados, talento clave y socios estratégicos de alto nivel.</p>
              </div>
            </div>

            <div className="about-feat-item">
              <div className="about-feat-icon">💎</div>
              <div>
                <h4>Nuestra Misión</h4>
                <p>Democratizar el acceso al capital de riesgo y acelerar la transformación digital regional.</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Side: Glassmorphic Visual Interactive Card */}
        <div className="about-visual">
          <div className="about-visual-glow"></div>
          <div className="about-card-mockup">
            <div className="about-mockup-header">
              <span className="dot red"></span>
              <span className="dot yellow"></span>
              <span className="dot green"></span>
            </div>
            <div className="about-mockup-body">
              <span className="mockup-tag">Estadísticas Clave</span>
              <h3>Impacto Regional</h3>
              
              <div className="about-mockup-stats">
                <div className="about-stat-box">
                  <span className="about-stat-num">+500</span>
                  <span className="about-stat-lbl">Startups</span>
                </div>
                <div className="about-stat-box">
                  <span className="about-stat-num">+150</span>
                  <span className="about-stat-lbl">Inversionistas</span>
                </div>
              </div>
              
              <div className="about-progress-group">
                <div className="progress-lbl-row">
                  <span>Tracción y Crecimiento</span>
                  <span>85%</span>
                </div>
                <div className="about-mockup-bar">
                  <div className="about-mockup-progress" style={{ width: '85%' }}></div>
                </div>
              </div>

              <div className="about-progress-group">
                <div className="progress-lbl-row">
                  <span>Conexiones Exitosas</span>
                  <span>92%</span>
                </div>
                <div className="about-mockup-bar">
                  <div className="about-mockup-progress green-progress" style={{ width: '92%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default About;
