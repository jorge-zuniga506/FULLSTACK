import React from 'react';
import { Link } from 'react-router-dom';
import heroImg from '../../assets/hero_character.png'; // Imagen del personaje del hero
import '../../styles/Landpage.css'; // Estilos del landing: .lp-navbar, .lp-hero, .lp-stats, etc.

/**
 * LandpageView — Landing page pública de Nexus Cobalt
 *
 * Página de entrada para usuarios no autenticados. Incluye:
 *
 * 1. NAVBAR: Logo + links de sección + CTA de login
 * 2. HERO: Título principal, descripción, CTAs (Explorar / Demo) e imagen decorativa
 *    - Panel izquierdo: íconos sociales verticales + contenido textual
 *    - Panel derecho: imagen del personaje con glow y efecto flotante
 * 3. STATS: 4 métricas del ecosistema en tarjetas con separadores
 * 4. FEATURES: 4 cards de funcionalidades principales de la plataforma
 *
 * Los links de la navbar usan anclas (#hero, #features, etc.) para scroll suave
 * en página, excepto el CTA de login que navega a /login con react-router.
 *
 * No usa estado — es completamente estático (presentacional puro).
 */
const LandpageView = () => {
  return (
    <div className="landpage-container">

      {/* ── 1. NAVBAR ───────────────────────────────────────────────────── */}
      <nav className="lp-navbar">
        {/* Logo con tipografía dual: NEXUS en blanco, COBALT en azul */}
        <div className="lp-logo">
          <span className="logo-nexus">NEXUS</span>
          <span className="logo-cobalt">COBALT</span>
        </div>
        {/* Links de ancla para scroll suave a cada sección */}
        <div className="lp-nav-links">
          <a href="#hero"      className="lp-nav-item active">Inicio</a>
          <a href="#features"  className="lp-nav-item">Funciones</a>
          <a href="#ecosystem" className="lp-nav-item">Ecosistema</a>
          <a href="#stats"     className="lp-nav-item">Estadísticas</a>
        </div>
        {/* CTA principal: navega a la página de login */}
        <Link to="/login" className="lp-nav-cta">Iniciar Sesión</Link>
      </nav>

      {/* ── 2. HERO ─────────────────────────────────────────────────────── */}
      <section className="lp-hero" id="hero">

        {/* Panel izquierdo: íconos sociales + contenido principal */}
        <div className="lp-hero-left">

          {/* Íconos de redes sociales (verticales, decorativos) */}
          <div className="lp-socials">
            <a href="#" className="lp-social-icon" aria-label="GitHub">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
            </a>
            <a href="#" className="lp-social-icon" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a href="#" className="lp-social-icon" aria-label="Twitter">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </div>

          {/* Contenido principal del hero */}
          <div className="lp-hero-content">
            {/* Badge de categoría */}
            <span className="lp-badge">🌎 Ecosistema Emprendedor</span>
            <p className="lp-eyebrow">Explora · Conecta · Crece</p>
            {/* H1 principal — único en la página (SEO) */}
            <h1 className="lp-title">MAPA DEL<br/>ECOSISTEMA</h1>
            <p className="lp-description">
              Visualiza y analiza el ecosistema emprendedor local. Conecta startups, inversores,
              aceleradoras y hubs de innovación en un mapa interactivo en tiempo real.
            </p>
            {/* CTAs: Explorar (→ /register) y Ver Demo (scroll/ancla) */}
            <div className="lp-actions">
              <Link to="/register" className="lp-btn-primary">EXPLORAR AHORA</Link>
              <a href="#features" className="lp-btn-secondary">
                <span className="play-icon">▶</span> VER DEMO
              </a>
            </div>
          </div>
        </div>

        {/* Panel derecho: imagen del personaje con glow decorativo */}
        <div className="lp-hero-right">
          <div className="lp-hero-glow"></div>
          <img src={heroImg} alt="Nexus Cobalt AI" className="lp-hero-img" />
        </div>
      </section>

      {/* ── 3. ESTADÍSTICAS ─────────────────────────────────────────────── */}
      {/* 4 métricas clave separadas por dividers verticales */}
      <section className="lp-stats" id="stats">
        <div className="lp-stat-card">
          <span className="stat-number">320+</span>
          <span className="stat-label">Startups</span>
        </div>
        <div className="lp-stat-divider"></div>
        <div className="lp-stat-card">
          <span className="stat-number">$45M</span>
          <span className="stat-label">Inversión Total</span>
        </div>
        <div className="lp-stat-divider"></div>
        <div className="lp-stat-card">
          <span className="stat-number">85</span>
          <span className="stat-label">Inversores</span>
        </div>
        <div className="lp-stat-divider"></div>
        <div className="lp-stat-card">
          <span className="stat-number">40</span>
          <span className="stat-label">Aceleradoras</span>
        </div>
      </section>

      {/* ── 4. FUNCIONALIDADES ──────────────────────────────────────────── */}
      {/* 4 cards descriptivas de las características principales de la plataforma */}
      <section className="lp-features" id="features">
        <div className="lp-feature-card">
          <div className="feature-icon">🗺️</div>
          <h3>Mapa Interactivo</h3>
          <p>Visualiza el ecosistema como un grafo de nodos conectados. Filtra por sector, etapa y tipo de entidad.</p>
        </div>
        <div className="lp-feature-card">
          <div className="feature-icon">🔗</div>
          <h3>Relaciones y Conexiones</h3>
          <p>Descubre qué inversores apoyan qué startups, qué aceleradoras tienen mejores redes y más.</p>
        </div>
        <div className="lp-feature-card">
          <div className="feature-icon">📊</div>
          <h3>Análisis y Reportes</h3>
          <p>Exporta datos, analiza tendencias por sector y mide el crecimiento del ecosistema en el tiempo.</p>
        </div>
        <div className="lp-feature-card">
          <div className="feature-icon">🔔</div>
          <h3>Alertas de Oportunidad</h3>
          <p>Recibe notificaciones cuando una aceleradora abra convocatorias o un inversor busque startups en tu sector.</p>
        </div>
      </section>

    </div>
  );
};

export default LandpageView;
