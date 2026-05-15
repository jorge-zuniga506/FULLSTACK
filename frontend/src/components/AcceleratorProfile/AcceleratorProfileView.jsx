import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProfileHero from '../EntityProfile/ProfileHero';
import MiniGraph   from '../EntityProfile/MiniGraph';
import '../../styles/SharedProfile.css';       // Estilos base compartidos (.sp-*)
import '../../styles/AcceleratorProfile.css';  // Overrides de color verde (#059669) para aceleradoras

// ─── Base de datos Mock ───────────────────────────────────────────────────────
// TODO: reemplazar con GET /api/accelerators/:slug

/** Datos de aceleradoras indexados por slug */
const ACCELERATORS_DB = {
  'startuplab-cca': {
    logo: '⚡',
    name: 'StartupLab CCA',
    tagline: 'El motor de las startups de alto impacto en la región',
    country: 'Costa Rica',
    type: 'Aceleradora',
    typeMeta: 'Generalist',  // Subtipo del programa
    egresadas: 45,           // Total de startups que completaron el programa
    duration: '6 meses',
    benefit: '$15K + Red de mentores',
    survival: '82%',         // Tasa de supervivencia de las egresadas
    success: '$4.2M levantados', // Capital total levantado por el portfolio
    description: 'StartupLab CCA es la aceleradora líder en Centroamérica, diseñada para llevar startups en etapa Seed a su siguiente ronda de inversión mediante un programa intensivo de 6 meses enfocado en producto y growth.',
    program: 'Nuestro programa incluye mentoría 1:1 con fundadores exitosos, acceso exclusivo a una red de +50 inversores ángeles y VCs, y espacios de coworking premium.',
    sectors: ['Fintech', 'SaaS', 'Marketplaces', 'Logística'],
    open: true, // true = convocatoria actualmente abierta
    mentors: [
      { name: 'Esteban G.', role: 'Growth Expert',      company: 'Uber LATAM'   },
      { name: 'Valeria M.', role: 'Product Strategy',   company: 'Google'        },
      { name: 'Jorge Z.',   role: 'Software Architect',  company: 'Nexus Cobalt' },
    ],
    egresadasList: [
      { name: 'AgroTech CR', year: 2022, logo: '🌱' },
      { name: 'LogiSmart',   year: 2023, logo: '🚚' },
      { name: 'FinBridge',   year: 2023, logo: '🏦' },
    ],
    connections: [
      { id: 1, label: 'AgroTech CR',   type: 'startup',  color: '#0055ff', relType: 'acceleration' },
      { id: 2, label: 'Fondo Innovar', type: 'investor', color: '#7c3aed', relType: 'alliance'     },
      { id: 3, label: 'INCAE Hub',     type: 'hub',      color: '#d97706', relType: 'alliance'     },
    ],
  },
};

/**
 * AcceleratorProfileView — Perfil standalone de una aceleradora
 *
 * Página independiente (sin sidebar del DashboardLayout) con:
 * - Navbar superior con link de retorno al ecosistema
 * - Hero de entidad (via ProfileHero) con acento verde (#059669)
 * - Fila de KPIs exclusiva de aceleradoras (egresadas, duración, supervivencia, etc.)
 * - Banner de convocatoria abierta (solo si data.open === true)
 * - Layout de dos columnas:
 *     IZQUIERDA: tabs (Programa / Egresadas / Mentores) con contenido intercambiable
 *     DERECHA:   acciones + grafo de conexiones + lista rápida de egresadas
 * - Modal de aplicación al programa (controlado por showApply)
 *
 * Clase de tema: 'accelerator-theme' (overrides verde en SharedProfile.css)
 *
 * Estado:
 * - activeTab: tab activa ('programa' | 'egresadas' | 'mentores')
 * - showApply: controla la visibilidad del modal de aplicación
 */
const AcceleratorProfileView = () => {
  const { slug } = useParams(); // Slug de la URL, ej: "startuplab-cca"
  const data = ACCELERATORS_DB[slug] || ACCELERATORS_DB['startuplab-cca']; // Fallback
  const [showApply, setShowApply] = useState(false); // Visibilidad del modal
  const [activeTab, setActiveTab] = useState('programa');

  // Definición de las tabs de navegación del perfil
  const tabs = [
    { key: 'programa',  label: '📋 Programa'  },
    { key: 'egresadas', label: '🚀 Egresadas' },
    { key: 'mentores',  label: '👥 Mentores'  },
  ];

  return (
    <div className="sp-page accelerator-theme">

      {/* ── NAVBAR SUPERIOR ─────────────────────────────────────────────── */}
      <nav className="sp-nav">
        <Link to="/dashboard" className="sp-nav-back">← Volver al Ecosistema</Link>
        <div className="sp-nav-logo">NEXUS<span>COBALT</span></div>
        <Link to="/profile" className="sp-nav-user">Mi Perfil</Link>
      </nav>

      {/* ── HERO DE LA ACELERADORA ──────────────────────────────────────── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', padding: '0 2rem', boxSizing: 'border-box' }}>
        <ProfileHero
          logo={data.logo}
          name={data.name}
          tagline={data.tagline}
          country={data.country}
          type={data.type}
          typeMeta={data.typeMeta}  // "Generalist", "Sector-specific", etc.
          typeColor="#059669"        // Verde esmeralda — identidad visual de Aceleradora
          isOwner={false}            // TODO: comparar con usuario autenticado
        />
      </div>

      <div className="sp-wrapper">

        {/* ── FILA DE KPIs (exclusiva de aceleradoras) ────────────────────
            Muestra métricas clave del programa en chips horizontales */}
        <div className="sp-kpis-row">
          {[
            { label: 'Egresadas',     value: data.egresadas, icon: '🎓' },
            { label: 'Duración',      value: data.duration,  icon: '⏳' },
            { label: 'Supervivencia', value: data.survival,  icon: '🛡️' },
            { label: 'Éxito Port.',   value: data.success,   icon: '💰' },
            { label: 'Beneficio',     value: data.benefit,   icon: '🎁' },
          ].map(k => (
            <div key={k.label} className="sp-kpi">
              <span className="sp-kpi-icon">{k.icon}</span>
              <span className="sp-kpi-val">{k.value}</span>
              <span className="sp-kpi-key">{k.label}</span>
            </div>
          ))}
        </div>

        {/* ── BANNER DE CONVOCATORIA ABIERTA ──────────────────────────────
            Solo se renderiza si data.open === true */}
        {data.open && (
          <div className="sp-opencall accel-call" style={{ marginBottom: '1rem' }}>
            <span className="sp-opencall-icon" style={{ fontSize: '1.5rem' }}>⚡</span>
            <div style={{ flex: 1 }}>
              <p className="sp-opencall-title">Convocatoria Abierta — Cohorte 2024</p>
              <p className="sp-opencall-sub">Buscamos startups con MVP validado y primeras ventas. ¡Aplica hoy!</p>
            </div>
            {/* CTA del banner — abre el modal de aplicación */}
            <button
              className="sp-btn-primary accel-btn-primary"
              style={{ width: 'auto', padding: '0.7rem 1.4rem' }}
              onClick={() => setShowApply(true)}
            >
              Aplicar Ahora →
            </button>
          </div>
        )}

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

            {/* ── Tab: Información del programa ── */}
            {activeTab === 'programa' && (
              <div className="sp-card">
                <p className="sp-section-title">Acerca del programa</p>
                <p className="sp-text">{data.description}</p>
                {/* Detalle del contenido del programa */}
                <p className="sp-text" style={{ marginTop: '1rem' }}>{data.program}</p>
                {/* Tags de sectores foco del programa */}
                <div style={{ marginTop: '1.5rem' }}>
                  <p className="sp-section-title">Sectores foco</p>
                  <div className="sp-tags">
                    {data.sectors.map(s => <span key={s} className="sp-tag accel-tag">{s}</span>)}
                  </div>
                </div>
              </div>
            )}

            {/* ── Tab: Startups egresadas ── */}
            {activeTab === 'egresadas' && (
              <div className="sp-card">
                <p className="sp-card-title">Startups egresadas</p>
                {/* Grid de tarjetas de egresadas — cada una enlaza al perfil de la startup */}
                <div className="sp-portfolio-grid">
                  {data.egresadasList.map((e, i) => (
                    <Link
                      key={i}
                      to={`/startup/${e.name.toLowerCase().replace(/ /g, '-')}`}
                      className="sp-port-card accel-port"
                    >
                      <div className="sp-port-logo">{e.logo}</div>
                      <p className="sp-port-name">{e.name}</p>
                      <p className="sp-port-meta">Clase {e.year}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* ── Tab: Red de mentores ── */}
            {activeTab === 'mentores' && (
              <div className="sp-card">
                <p className="sp-card-title">Red de mentores</p>
                <div className="sp-team-grid">
                  {data.mentors.map((m, i) => (
                    <div key={i} className="sp-team-card">
                      {/* Avatar con inicial del mentor, color verde de aceleradora */}
                      <div className="sp-team-avatar accel-avatar">{m.name.charAt(0)}</div>
                      <p className="sp-team-name">{m.name}</p>
                      <p className="sp-team-role">{m.role}</p>
                      <p className="sp-team-company">{m.company}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* COLUMNA DERECHA: Acciones + Grafo + Lista rápida de egresadas */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Card de acciones principales */}
            <div className="sp-card">
              <p className="sp-card-title">Acciones</p>
              <div className="sp-action-stack">
                {/* CTA principal — abre el modal de aplicación */}
                <button
                  className="sp-btn-primary accel-btn-primary"
                  onClick={() => setShowApply(true)}
                >
                  🚀 Aplicar al Programa
                </button>
                <button className="sp-btn-secondary">📥 Descargar Dossier</button>
                <button className="sp-btn-ghost">❤️ Guardar</button>
                <Link to="/explorer" className="sp-btn-ghost">📊 Ver en Explorador</Link>
              </div>
            </div>

            {/* Mini-grafo de conexiones: startups, inversores aliados y hubs */}
            <div className="sp-card">
              <p className="sp-card-title">🔗 Red de Conexiones</p>
              <MiniGraph
                centerLabel={data.name}
                centerColor="#059669"
                connections={data.connections}
              />
            </div>

            {/* Lista rápida de egresadas con enlace al perfil */}
            <div className="sp-card">
              <p className="sp-card-title">🎓 Egresadas Top</p>
              <div className="sp-conn-list">
                {data.egresadasList.map((e, i) => (
                  <Link
                    key={i}
                    to={`/startup/${e.name.toLowerCase().replace(/ /g, '-')}`}
                    className="sp-conn-row"
                  >
                    <span style={{ fontSize: '1rem' }}>{e.logo}</span>
                    <span className="sp-conn-name">{e.name}</span>
                    {/* Badge de tipo de relación en verde */}
                    <span className="sp-conn-rel accel-conn-rel">egresada</span>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── MODAL: Aplicar al programa ──────────────────────────────────────
          Se superpone sobre la página completa.
          Click en el overlay (sp-modal-overlay) cierra el modal.
          Click dentro del modal (e.stopPropagation()) evita que se cierre. */}
      {showApply && (
        <div className="sp-modal-overlay" onClick={() => setShowApply(false)}>
          <div className="sp-modal" onClick={e => e.stopPropagation()}>
            <h2 className="sp-modal-title">🚀 Aplicar a {data.name}</h2>
            <div className="sp-modal-body">
              {/* Campo: nombre de la startup que aplica */}
              <div className="sp-field">
                <label>Nombre de la startup</label>
                <input placeholder="Ej: AgroTech CR" />
              </div>
              {/* Campo: sitio web de la startup */}
              <div className="sp-field">
                <label>Sitio web</label>
                <input placeholder="https://..." />
              </div>
              {/* Campo: URL del pitch deck (Google Drive, Dropbox, etc.) */}
              <div className="sp-field">
                <label>Pitch deck (URL)</label>
                <input placeholder="Google Drive / Dropbox" />
              </div>
              {/* Campo: mensaje libre al comité de selección */}
              <div className="sp-field">
                <label>Mensaje al comité</label>
                <textarea rows={4} placeholder="¿Por qué quieres entrar al programa?" />
              </div>
            </div>
            <div className="sp-modal-footer">
              {/* Cancela y cierra el modal */}
              <button
                className="sp-btn-ghost"
                style={{ width: 'auto', padding: '0.65rem 1.2rem' }}
                onClick={() => setShowApply(false)}
              >
                Cancelar
              </button>
              {/* TODO: conectar con POST /api/applications */}
              <button
                className="sp-btn-primary accel-btn-primary"
                style={{ width: 'auto', padding: '0.65rem 1.4rem' }}
              >
                Enviar Aplicación
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcceleratorProfileView;
