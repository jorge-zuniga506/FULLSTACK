import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProfileHero from '../EntityProfile/ProfileHero';
import MiniGraph   from '../EntityProfile/MiniGraph';
import '../../styles/SharedProfile.css';    // Estilos base compartidos (.sp-*)
import '../../styles/InvestorProfile.css';  // Overrides de color violeta (#7c3aed) para inversores

// ─── Base de datos Mock ───────────────────────────────────────────────────────
// TODO: reemplazar con GET /api/investors/:slug

/** Datos de inversores indexados por slug */
const DATA = {
  'fondo-innovar': {
    logo: '💎',
    name: 'Fondo Innovar',
    tagline: 'Venture Capital regional para el ecosistema centroamericano',
    country: 'Costa Rica',
    type: 'VC',           // Tipo de inversor (VC / Ángel / Family Office)
    focus: 'Serie A',     // Etapa de inversión objetivo
    ticket: '$100K – $500K',
    totalInvested: '$8.2M',
    companies: 14,        // Número de empresas en portfolio
    description: 'Fondo especializado en startups tecnológicas con alto potencial de escalabilidad en Centroamérica. Invertimos en equipos excepcionales con visión regional.',
    thesis: 'Buscamos startups B2B en etapa Serie A con producto validado, tracción de $30K MRR y ambición de expansión panregional.',
    sectors: ['Fintech', 'SaaS B2B', 'Healthtech', 'Logística'],
    connections: [
      { id: 1, label: 'AgroTech CR',  type: 'startup', color: '#00aaff', relType: 'investment' },
      { id: 2, label: 'MedIA Health', type: 'startup', color: '#00aaff', relType: 'investment' },
      { id: 3, label: 'FinBridge',    type: 'startup', color: '#00aaff', relType: 'investment' },
    ],
  },
};

/**
 * InvestorProfileView — Perfil standalone de un inversor
 *
 * Página independiente (sin sidebar del DashboardLayout) con:
 * - Navbar superior con link de retorno al ecosistema
 * - Hero de entidad (via ProfileHero) con acento violeta (#7c3aed)
 * - Layout de dos columnas:
 *     IZQUIERDA: tabs (Tesis / Portfolio / Sectores) con contenido intercambiable
 *     DERECHA:   acciones + grafo de red de inversión (MiniGraph)
 *
 * El slug leído de la URL (:slug) se usa para buscar en DATA.
 * Si el slug no existe, se carga el fallback 'fondo-innovar'.
 *
 * Clase de tema: 'investor-theme' (overrides violeta en SharedProfile.css)
 *
 * Estado:
 * - activeTab: tab activa ('tesis' | 'portfolio' | 'sectores')
 */
const InvestorProfileView = () => {
  const { slug } = useParams(); // Slug de la URL, ej: "fondo-innovar"
  const entity = DATA[slug] || DATA['fondo-innovar']; // Fallback al primer registro
  const [activeTab, setActiveTab] = useState('tesis');

  // Definición de las tabs de navegación del perfil
  const tabs = [
    { key: 'tesis',     label: '📋 Tesis'    },
    { key: 'portfolio', label: '💼 Portfolio' },
    { key: 'sectores',  label: '🏷️ Sectores' },
  ];

  return (
    <div className="sp-page investor-theme">

      {/* ── NAVBAR SUPERIOR ─────────────────────────────────────────────── */}
      <nav className="sp-nav">
        <Link to="/dashboard" className="sp-nav-back">← Volver al Ecosistema</Link>
        <div className="sp-nav-logo">NEXUS<span>COBALT</span></div>
        <Link to="/profile" className="sp-nav-user">Mi Perfil</Link>
      </nav>

      {/* ── HERO DEL INVERSOR ───────────────────────────────────────────── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', padding: '0 2rem', boxSizing: 'border-box' }}>
        <ProfileHero
          logo={entity.logo}
          name={entity.name}
          tagline={entity.tagline}
          country={entity.country}
          type={entity.type}        // "VC" o "Ángel"
          typeMeta={entity.focus}   // Etapa objetivo (ej: "Serie A")
          typeColor="#7c3aed"       // Violeta — identidad visual de Inversor
          isOwner={false}           // TODO: comparar con usuario autenticado
        />
      </div>

      {/* ── CONTENIDO PRINCIPAL ─────────────────────────────────────────── */}
      <div className="sp-wrapper">
        <div className="sp-grid">

          {/* COLUMNA IZQUIERDA: Tabs de contenido */}
          <div>
            {/* Selector de tabs — la clase 'investor-active' aplica acento violeta */}
            <div className="sp-tabs">
              {tabs.map(t => (
                <button
                  key={t.key}
                  className={`sp-tab-btn ${activeTab === t.key ? 'active investor-active' : ''}`}
                  onClick={() => setActiveTab(t.key)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* ── Tab: Tesis de inversión ── */}
            {activeTab === 'tesis' && (
              <div className="sp-card">
                <p className="sp-card-title">Tesis de inversión</p>
                <p className="sp-text">{entity.description}</p>
                {/* Tesis en cursiva y color suave para diferenciarla de la descripción */}
                <p className="sp-text" style={{ marginTop: '1rem', fontStyle: 'italic', color: 'rgba(255,255,255,0.45)' }}>
                  "{entity.thesis}"
                </p>
                {/* KPIs del inversor en chips */}
                <div className="sp-mini-stats" style={{ marginTop: '1.5rem' }}>
                  <div className="sp-stat-chip"><span>Ticket promedio</span><strong>{entity.ticket}</strong></div>
                  <div className="sp-stat-chip"><span>Etapa objetivo</span><strong>{entity.focus}</strong></div>
                  <div className="sp-stat-chip"><span>Total invertido</span><strong>{entity.totalInvested}</strong></div>
                  <div className="sp-stat-chip"><span>Empresas en portfolio</span><strong>{entity.companies}</strong></div>
                </div>
              </div>
            )}

            {/* ── Tab: Portfolio ── */}
            {activeTab === 'portfolio' && (
              <div className="sp-card">
                <p className="sp-card-title">Portfolio actual</p>
                {/* Lista de startups en portfolio (solo conexiones tipo 'startup') */}
                <div className="sp-portfolio-minimal">
                  {entity.connections.filter(c => c.type === 'startup').map(s => (
                    <Link
                      key={s.id}
                      to={`/startup/${s.label.toLowerCase().replace(/ /g, '-')}`}
                      className="sp-port-item"
                    >
                      {/* Punto violeta identificador de la startup */}
                      <span className="investor-port-dot" />
                      {s.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* ── Tab: Sectores de interés ── */}
            {activeTab === 'sectores' && (
              <div className="sp-card">
                <p className="sp-card-title">Sectores de interés</p>
                <div className="sp-tags">
                  {entity.sectors.map(s => (
                    <span key={s} className="sp-tag investor-tag">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* COLUMNA DERECHA: Acciones + Grafo de red de inversión */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Card de acciones rápidas para startups que visiten el perfil */}
            <div className="sp-card">
              <p className="sp-card-title">Acciones</p>
              <div className="sp-action-stack">
                <button className="sp-btn-primary investor-btn-primary">📩 Enviar Pitch</button>
                <button className="sp-btn-secondary">📅 Solicitar Reunión</button>
                <button className="sp-btn-ghost">❤️ Guardar</button>
                <Link to="/explorer" className="sp-btn-ghost">📊 Ver en Explorador</Link>
              </div>
            </div>

            {/* Mini-grafo mostrando las startups en las que ha invertido */}
            <div className="sp-card">
              <p className="sp-card-title">🔗 Red de Inversión</p>
              <MiniGraph
                centerLabel={entity.name}
                centerColor="#7c3aed"
                connections={entity.connections}
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestorProfileView;
