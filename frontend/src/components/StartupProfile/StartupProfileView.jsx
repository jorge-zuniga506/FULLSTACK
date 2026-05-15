import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProfileHero from '../EntityProfile/ProfileHero';
import MiniGraph   from '../EntityProfile/MiniGraph';
import '../../styles/SharedProfile.css';    // Estilos base: .sp-page, .sp-nav, .sp-card, etc.
import '../../styles/StartupProfile.css';   // Overrides de color azul (#00aaff) para startups

// ─── Base de datos Mock ───────────────────────────────────────────────────────
// Keyed por slug (nombre en lowercase con guiones)
// TODO: reemplazar con GET /api/startups/:slug cuando el backend esté listo

/** Datos de startups indexados por slug */
const DATA = {
  'agrotech-cr': {
    logo: '🌱', name: 'AgroTech CR', tagline: 'Revolucionando el campo con IA',
    country: 'Costa Rica', sector: 'Agritech', stage: 'Seed', raised: '$250K',
    description: 'Plataforma líder en optimización de cultivos mediante sensores IoT y algoritmos predictivos de rendimiento agrícola.',
    sectors: ['Agritech', 'IoT', 'IA'],
    team: [
      { name: 'Carlos V.', role: 'CEO & Co-founder', company: 'AgroTech CR' },
      { name: 'Laura M.',  role: 'CTO',              company: 'AgroTech CR' },
    ],
    connections: [
      { id: 1, label: 'Fondo Innovar', type: 'investor',    color: '#7c3aed', relType: 'investment'   },
      { id: 2, label: 'StartupLab',   type: 'accelerator', color: '#059669', relType: 'acceleration' },
    ],
  },
  'media-health': {
    logo: '🏥', name: 'MedIA Health', tagline: 'Diagnóstico inteligente para Centroamérica',
    country: 'Costa Rica', sector: 'Healthtech', stage: 'Serie A', raised: '$2M',
    description: 'IA para análisis de radiografías y gestión hospitalaria eficiente. Reducimos el tiempo de diagnóstico en un 60%.',
    sectors: ['Healthtech', 'IA', 'SaaS'],
    team: [
      { name: 'Diana R.', role: 'CEO', company: 'MedIA Health' },
    ],
    connections: [
      { id: 3, label: 'TechVentures', type: 'investor', color: '#7c3aed', relType: 'investment' },
    ],
  },
};

/**
 * StartupProfileView — Perfil standalone de una startup
 *
 * Página independiente (sin sidebar del DashboardLayout) con:
 * - Navbar superior con link de retorno al ecosistema
 * - Hero de entidad (via ProfileHero) con acento azul (#00aaff)
 * - Layout de dos columnas:
 *     IZQUIERDA: tabs (Info / Red / Equipo) con contenido intercambiable
 *     DERECHA:   acciones rápidas + grafo de conexiones (MiniGraph)
 *
 * El slug leído de la URL (:slug) se usa para buscar en DATA.
 * Si el slug no existe, se carga el fallback 'agrotech-cr'.
 *
 * Clase de tema: 'startup-theme' (sobreescribe color de acento en SharedProfile.css)
 *
 * Estado:
 * - activeTab: tab activa ('info' | 'red' | 'equipo')
 */
const StartupProfileView = () => {
  const { slug } = useParams(); // Slug de la URL, ej: "agrotech-cr"
  const entity = DATA[slug] || DATA['agrotech-cr']; // Fallback al primer registro
  const [activeTab, setActiveTab] = useState('info');

  // Definición de las tabs de navegación del perfil
  const tabs = [
    { key: 'info',   label: '📋 Información' },
    { key: 'red',    label: '🔗 Red'         },
    { key: 'equipo', label: '👥 Equipo'      },
  ];

  return (
    <div className="sp-page startup-theme">

      {/* ── NAVBAR SUPERIOR ─────────────────────────────────────────────── */}
      <nav className="sp-nav">
        <Link to="/dashboard" className="sp-nav-back">← Volver al Ecosistema</Link>
        <div className="sp-nav-logo">NEXUS<span>COBALT</span></div>
        <Link to="/profile" className="sp-nav-user">Mi Perfil</Link>
      </nav>

      {/* ── HERO DE LA STARTUP ──────────────────────────────────────────── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', padding: '0 2rem', boxSizing: 'border-box' }}>
        <ProfileHero
          logo={entity.logo}
          name={entity.name}
          tagline={entity.tagline}
          country={entity.country}
          type="Startup"
          typeMeta={entity.sector}
          typeColor="#00aaff"   // Azul — identidad visual de Startup
          isOwner={false}       // TODO: comparar con usuario autenticado
        />
      </div>

      {/* ── CONTENIDO PRINCIPAL ─────────────────────────────────────────── */}
      <div className="sp-wrapper">
        <div className="sp-grid">

          {/* COLUMNA IZQUIERDA: Tabs de contenido */}
          <div>
            {/* Selector de tabs */}
            <div className="sp-tabs">
              {tabs.map(t => (
                <button
                  key={t.key}
                  className={`sp-tab-btn ${activeTab === t.key ? 'active' : ''}`}
                  onClick={() => setActiveTab(t.key)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* ── Tab: Información ── */}
            {activeTab === 'info' && (
              <div className="sp-card">
                <p className="sp-card-title">Acerca de</p>
                <p className="sp-text">{entity.description}</p>
                {/* Mini-estadísticas: monto levantado y etapa */}
                <div className="sp-mini-stats" style={{ marginTop: '1.5rem' }}>
                  <div className="sp-stat-chip">
                    <span>Monto levantado</span>
                    <strong>{entity.raised}</strong>
                  </div>
                  <div className="sp-stat-chip">
                    <span>Etapa</span>
                    <strong>{entity.stage}</strong>
                  </div>
                </div>
                {/* Tags de sectores */}
                <div style={{ marginTop: '1.5rem' }}>
                  <p className="sp-section-title">Sectores</p>
                  <div className="sp-tags">
                    {entity.sectors.map(s => <span key={s} className="sp-tag startup-tag">{s}</span>)}
                  </div>
                </div>
              </div>
            )}

            {/* ── Tab: Red ── */}
            {activeTab === 'red' && (
              <div className="sp-card">
                <p className="sp-card-title">Conexiones directas</p>
                <div className="sp-conn-list">
                  {entity.connections.map(c => (
                    <div key={c.id} className="sp-conn-row">
                      {/* Punto de color según tipo de conexión */}
                      <span className="startup-port-dot" style={{ background: c.color }} />
                      <span className="sp-conn-name">{c.label}</span>
                      {/* Etiqueta del tipo de relación con el color de la conexión */}
                      <span className="sp-conn-rel" style={{ color: c.color }}>{c.relType}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Tab: Equipo ── */}
            {activeTab === 'equipo' && (
              <div className="sp-card">
                <p className="sp-card-title">Equipo fundador</p>
                <div className="sp-team-grid">
                  {entity.team.map((m, i) => (
                    <div key={i} className="sp-team-card">
                      {/* Avatar con inicial del nombre, color azul de startup */}
                      <div className="sp-team-avatar startup-avatar">{m.name.charAt(0)}</div>
                      <p className="sp-team-name">{m.name}</p>
                      <p className="sp-team-role">{m.role}</p>
                      <p className="sp-team-company">{m.company}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* COLUMNA DERECHA: Acciones + Grafo de red */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Card de acciones rápidas */}
            <div className="sp-card">
              <p className="sp-card-title">Acciones</p>
              <div className="sp-action-stack">
                <button className="sp-btn-primary startup-btn-primary">🤝 Solicitar Conexión</button>
                <button className="sp-btn-secondary">📥 Descargar Pitch Deck</button>
                <button className="sp-btn-ghost">❤️ Guardar</button>
                <Link to="/explorer" className="sp-btn-ghost">📊 Ver en Explorador</Link>
              </div>
            </div>

            {/* Mini-grafo de conexiones locales de la startup */}
            <div className="sp-card">
              <p className="sp-card-title">🔗 Red de Conexiones</p>
              <MiniGraph
                centerLabel={entity.name}
                centerColor="#00aaff"
                connections={entity.connections}
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default StartupProfileView;
