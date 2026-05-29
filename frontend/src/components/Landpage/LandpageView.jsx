import React from 'react';
import { Link } from 'react-router-dom';
import videoMp from '../../assets/video_mp_ (1).mp4'; // Video de fondo del hero
import Navbar from '../../components/Navbar/NavbarLandpage';
import EcosystemNews from '../EcosystemNews/EcosystemNews';
import JarvisChat from '../Chatbot/JarvisChat';
import Footer from '../Footer/Footer';
import '../../styles/Landpage.css'; // Estilos del landing: .lp-navbar, .lp-hero, .lp-stats, etc.

/**
 * LandpageView — Landing page pública de Nexus Cobalt
 */
const LandpageView = () => {
  return (
    <div className="landpage-container">
      {/* ── 1. NAVBAR ─────────────────────────────────────────────────────── */}
      <Navbar />

      {/* ── 2. HERO ─────────────────────────────────────────────────────── */}
      <section className="lp-hero" id="hero" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '80px 2rem', boxSizing: 'border-box', position: 'relative', overflow: 'hidden' }}>
        {/* Video de Fondo con Capa de Contraste Opaque */}
        <div className="lp-hero-video-bg-container">
          <video 
            src={videoMp} 
            className="lp-hero-video-bg" 
            autoPlay 
            loop 
            muted 
            playsInline 
          />
          <div className="lp-hero-video-overlay"></div>
        </div>

        {/* Panel izquierdo: contenido principal centrado (se sobrepone al video) */}
        <div className="lp-hero-left" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', maxWidth: '800px', margin: '0 auto', textAlign: 'center', zIndex: 5, position: 'relative' }}>
          
          {/* Contenido principal del hero */}
          <div className="lp-hero-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0.9rem', width: '100%' }}>
            {/* Badge de categoría */}
            <span className="lp-badge" style={{ margin: '0 auto', background: 'rgba(139, 0, 221 , 0.25)', borderColor: 'rgba(139, 0, 221 , 0.55)', color: '#e2b3ff', fontWeight: '750' }}>🌎 Ecosistema Emprendedor</span>
            <p className="lp-eyebrow" style={{ textAlign: 'center', margin: '0 0 0.2rem 0', fontSize: '1.02rem', letterSpacing: '0.08em', color: '#ffffff', fontWeight: '700', textShadow: '0 2px 10px rgba(0,0,0,0.95)' }}>Explora · Conecta · Crece</p>
            
            {/* H1 principal — único en la página (SEO) */}
            <h1 className="lp-title" style={{ textAlign: 'center', filter: 'drop-shadow(0 4px 15px rgba(0, 0, 0, 0.8)) drop-shadow(0 2px 5px rgba(0,0,0,0.95))', fontSize: 'clamp(2.2rem, 4.2vw, 3.8rem)', lineHeight: '1.05', margin: '0 auto', fontWeight: '950' }}>MAPA DEL<br/>ECOSISTEMA</h1>
            <p className="lp-description" style={{ maxWidth: '580px', margin: '0.4rem auto 0 auto', textAlign: 'center', textShadow: '0 2px 12px rgba(0, 0, 0, 0.95), 0 4px 24px rgba(0, 0, 0, 0.85)', fontSize: '1.02rem', lineHeight: '1.65', color: '#ffffff', fontWeight: '600' }}>
              Visualiza y analiza el ecosistema emprendedor local. Conecta startups, inversores,
              aceleradoras y hubs de innovación en un mapa interactivo en tiempo real.
            </p>
            
            {/* CTAs: Dirigidos a páginas futuras */}
            <div className="lp-actions" style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', alignItems: 'center', marginTop: '0.8rem' }}>
              <Link to="/proximamente" className="lp-btn-primary">EXPLORAR AHORA</Link>
              <Link to="/proximamente" className="lp-btn-secondary">
                <span className="play-icon">▶</span> VER DEMO
              </Link>
            </div>

            {/* Íconos de redes sociales (horizontales, decorativos en la base) */}
            <div className="lp-socials" style={{ display: 'flex', flexDirection: 'row', gap: '1.5rem', justifyContent: 'center', alignItems: 'center', marginTop: '1.2rem' }}>
              <Link to="/proximamente" className="lp-social-icon" aria-label="GitHub">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
              </Link>
              <Link to="/proximamente" className="lp-social-icon" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </Link>
              <Link to="/proximamente" className="lp-social-icon" aria-label="Twitter">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Panel derecho: despejado para que se aprecie el video de fondo */}
        <div className="lp-hero-right" style={{ display: 'none' }}></div>
      </section>



      {/* ── 3. ECOSYSTEM NEWS & INITIATIVES GRID ── */}
      <EcosystemNews />
      
      {/* Universal Footer */}
      <Footer />

      <JarvisChat />
    </div>
  );
};

export default LandpageView;
