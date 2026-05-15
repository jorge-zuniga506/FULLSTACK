import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Dashboard.css'; // Estilos del layout con sidebar y cards

// ─── Datos Mock ───────────────────────────────────────────────────────────────
// TODO: reemplazar con llamadas a la API cuando el backend esté conectado

/** Estadísticas globales del ecosistema */
const stats = [
  { id: 1, label: 'Startups',        value: '324',    change: '+12',   icon: '🚀', color: '#00aaff' },
  { id: 2, label: 'Inversores',      value: '87',     change: '+5',    icon: '💼', color: '#7c3aed' },
  { id: 3, label: 'Aceleradoras',    value: '42',     change: '+3',    icon: '⚡', color: '#059669' },
  { id: 4, label: 'Inversión Total', value: '$45.2M', change: '+$3.1M',icon: '💰', color: '#d97706' },
];

/** Últimas entidades registradas/actualizadas en el ecosistema */
const recentEntities = [
  { id: 1, name: 'AgroTech CR',    type: 'Startup',     sector: 'Agritech',   stage: 'Seed',     logo: '🌱' },
  { id: 2, name: 'Fondo Innovar',  type: 'Inversor',    sector: 'Fintech',    stage: 'Serie A',  logo: '💎' },
  { id: 3, name: 'StartupLab CCA', type: 'Aceleradora', sector: 'General',    stage: 'Pre-seed', logo: '⚡' },
  { id: 4, name: 'MedIA Health',   type: 'Startup',     sector: 'Healthtech', stage: 'Serie A',  logo: '🏥' },
  { id: 5, name: 'EduFuturo',      type: 'Startup',     sector: 'Edtech',     stage: 'Seed',     logo: '📚' },
  { id: 6, name: 'FinBridge',      type: 'Startup',     sector: 'Fintech',    stage: 'Pre-seed', logo: '🏦' },
];

/** Sectores más activos con conteo y porcentaje de representación */
const sectors = [
  { name: 'Fintech',    count: 68, pct: 82 },
  { name: 'Healthtech', count: 54, pct: 65 },
  { name: 'Edtech',     count: 47, pct: 56 },
  { name: 'Agritech',   count: 38, pct: 46 },
  { name: 'Logística',  count: 29, pct: 35 },
  { name: 'Legaltech',  count: 21, pct: 25 },
];

/**
 * Colores por tipo de entidad para los badges en la lista de entidades recientes
 * Cada tipo tiene: fondo, borde y color de texto
 */
const typeColors = {
  'Startup':     { bg: 'rgba(0,170,255,0.1)',  border: 'rgba(0,170,255,0.3)',  text: '#00aaff' },
  'Inversor':    { bg: 'rgba(124,58,237,0.1)', border: 'rgba(124,58,237,0.3)', text: '#a78bfa' },
  'Aceleradora': { bg: 'rgba(5,150,105,0.1)',  border: 'rgba(5,150,105,0.3)',  text: '#34d399' },
};

/**
 * DashboardView — Vista principal del ecosistema emprendedor
 *
 * Renderiza (sin sidebar propio, lo provee DashboardLayout):
 * 1. Header con título y botón "Abrir Explorador"
 * 2. Grid de 4 tarjetas KPI (Startups, Inversores, Aceleradoras, Inversión)
 * 3. Grid inferior con:
 *    - Lista de entidades recientes con badge de tipo
 *    - Gráfico de barras de sectores principales
 */
const DashboardView = () => {
  return (
    <>
      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <div className="db-header">
        <div>
          <h1 className="db-title">Dashboard del Ecosistema</h1>
          <p className="db-subtitle">Vista general del ecosistema emprendedor local</p>
        </div>
        {/* Acceso rápido al explorador interactivo */}
        <Link to="/explorer" className="db-explore-btn">🗺️ Abrir Explorador</Link>
      </div>

      {/* ── KPI CARDS ───────────────────────────────────────────────────── */}
      {/* 4 tarjetas con cifras clave del ecosistema + barra de progreso */}
      <div className="db-stats-grid">
        {stats.map(s => (
          <div className="db-stat-card" key={s.id} style={{ '--accent': s.color }}>
            <div className="db-stat-top">
              <span className="db-stat-icon">{s.icon}</span>
              {/* Indicador de cambio positivo */}
              <span className="db-stat-change">+{s.change}</span>
            </div>
            <p className="db-stat-value">{s.value}</p>
            <p className="db-stat-label">{s.label}</p>
            {/* Barra decorativa de progreso animada vía CSS */}
            <div className="db-stat-bar">
              <div className="db-stat-fill" style={{ background: s.color }}></div>
            </div>
          </div>
        ))}
      </div>

      {/* ── BOTTOM GRID ─────────────────────────────────────────────────── */}
      <div className="db-bottom-grid">

        {/* Entidades recientes ─────────────────────────────────────────── */}
        <div className="db-card">
          <div className="db-card-header">
            <h2 className="db-card-title">Entidades Recientes</h2>
            <Link to="/explorer" className="db-card-link">Ver todas →</Link>
          </div>
          <div className="db-entities-list">
            {recentEntities.map(e => (
              <div className="db-entity-row" key={e.id}>
                <div className="db-entity-logo">{e.logo}</div>
                <div className="db-entity-info">
                  <p className="db-entity-name">{e.name}</p>
                  <p className="db-entity-sector">{e.sector}</p>
                </div>
                {/* Badge de tipo con color dinámico según typeColors */}
                <div>
                  <span
                    className="db-entity-type"
                    style={{
                      background: typeColors[e.type]?.bg,
                      border: `1px solid ${typeColors[e.type]?.border}`,
                      color: typeColors[e.type]?.text,
                    }}
                  >
                    {e.type}
                  </span>
                </div>
                <span className="db-entity-stage">{e.stage}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sectores principales ────────────────────────────────────────── */}
        <div className="db-card">
          <div className="db-card-header">
            <h2 className="db-card-title">Sectores Principales</h2>
          </div>
          <div className="db-sectors-list">
            {sectors.map(s => (
              <div className="db-sector-row" key={s.name}>
                <div className="db-sector-info">
                  <span className="db-sector-name">{s.name}</span>
                  <span className="db-sector-count">{s.count} entidades</span>
                </div>
                {/* Barra de progreso proporcional al porcentaje */}
                <div className="db-sector-bar-wrap">
                  <div className="db-sector-bar" style={{ width: `${s.pct}%` }}></div>
                </div>
                <span className="db-sector-pct">{s.pct}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  );
};

export default DashboardView;
