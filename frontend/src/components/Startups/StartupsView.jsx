import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/EntityList.css'; // Estilos de .el-header, .el-grid, .el-card, etc.

// ─── Datos Mock ───────────────────────────────────────────────────────────────
// TODO: reemplazar con GET /api/startups cuando el backend esté conectado

/** Lista de startups del ecosistema */
const STARTUPS = [
  { id: 1, name: 'AgroTech CR',    sector: 'Agritech',   stage: 'Seed',     amount: '$250K', year: 2022, country: 'Costa Rica', logo: '🌱', status: 'Activa' },
  { id: 2, name: 'MedIA Health',   sector: 'Healthtech', stage: 'Serie A',  amount: '$2M',   year: 2021, country: 'Costa Rica', logo: '🏥', status: 'Activa' },
  { id: 3, name: 'EduFuturo',      sector: 'Edtech',     stage: 'Seed',     amount: '$180K', year: 2023, country: 'Guatemala',  logo: '📚', status: 'Activa' },
  { id: 4, name: 'FinBridge',      sector: 'Fintech',    stage: 'Pre-seed', amount: '$80K',  year: 2023, country: 'Panamá',     logo: '🏦', status: 'Activa' },
  { id: 5, name: 'LogiSmart',      sector: 'Logística',  stage: 'Seed',     amount: '$300K', year: 2022, country: 'Honduras',   logo: '🚚', status: 'Activa' },
  { id: 6, name: 'LegalAI',        sector: 'Legaltech',  stage: 'Pre-seed', amount: '$50K',  year: 2024, country: 'Costa Rica', logo: '⚖️', status: 'Activa' },
  { id: 7, name: 'GreenEnergy CR', sector: 'Cleantech',  stage: 'Serie A',  amount: '$3.5M', year: 2020, country: 'Costa Rica', logo: '⚡', status: 'Activa' },
];

/** Opciones del filtro de etapa de inversión */
const STAGES = ['Todas', 'Pre-seed', 'Seed', 'Serie A', 'Serie B'];

/**
 * Colores de badge por etapa de inversión
 * Usados inline en las tarjetas para diferenciar visualmente cada etapa
 */
const STAGE_COLOR = {
  'Pre-seed': { bg: 'rgba(255,255,255,0.05)', color: '#aaaaaa' },
  'Seed':     { bg: 'rgba(0,170,255,0.1)',    color: '#00aaff' },
  'Serie A':  { bg: 'rgba(124,58,237,0.1)',   color: '#a78bfa' },
};

/**
 * StartupsView — Lista de startups del ecosistema con búsqueda y filtros
 *
 * Funcionalidades:
 * - Búsqueda en tiempo real por nombre (case-insensitive)
 * - Filtro por etapa de inversión (pills de selección única)
 * - Cada tarjeta enlaza al perfil detallado: /startup/:slug
 *
 * El slug se genera dinámicamente desde el nombre:
 *   "AgroTech CR" → "agrotech-cr"
 *
 * Estado:
 * - search: texto de búsqueda actual
 * - stage:  etapa seleccionada para filtrar
 */
const StartupsView = () => {
  const [search, setSearch] = useState(''); // Texto del buscador
  const [stage,  setStage]  = useState('Todas'); // Etapa seleccionada

  // Filtra las startups según etapa y búsqueda por nombre
  const filtered = STARTUPS.filter(s => {
    if (stage !== 'Todas' && s.stage !== stage) return false;
    if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <>
      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <div className="el-header">
        <div>
          <h1 className="el-title">🚀 Startups</h1>
          {/* Contador dinámico de resultados filtrados */}
          <p className="el-subtitle">{filtered.length} startups en el ecosistema</p>
        </div>
        {/* TODO: abrir modal o ruta de registro de startup */}
        <button className="el-add-btn">+ Registrar Startup</button>
      </div>

      {/* ── FILTROS ─────────────────────────────────────────────────────── */}
      <div className="el-filters">
        {/* Campo de búsqueda */}
        <div className="el-search-wrap">
          <span>🔍</span>
          <input
            className="el-search"
            placeholder="Buscar startup..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {/* Pills de etapa — solo una puede estar activa a la vez */}
        <div className="el-filter-pills">
          {STAGES.map(s => (
            <button
              key={s}
              className={`el-pill ${stage === s ? 'active' : ''}`}
              onClick={() => setStage(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* ── GRID DE TARJETAS ────────────────────────────────────────────── */}
      <div className="el-grid">
        {filtered.map(s => (
          // Cada tarjeta es un Link al perfil de la startup con slug generado del nombre
          <Link
            className="el-card"
            key={s.id}
            to={`/startup/${s.name.toLowerCase().replace(/ /g, '-')}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div className="el-card-top">
              <div className="el-card-logo">{s.logo}</div>
              {/* Badge de etapa con color dinámico */}
              <span
                className="el-stage-badge"
                style={{ background: STAGE_COLOR[s.stage]?.bg, color: STAGE_COLOR[s.stage]?.color }}
              >
                {s.stage}
              </span>
            </div>
            <h3 className="el-card-name">{s.name}</h3>
            <p className="el-card-meta">{s.sector} · {s.country}</p>
            <div className="el-card-footer">
              {/* Monto levantado */}
              <div className="el-card-stat">
                <span className="el-stat-val">{s.amount}</span>
                <span className="el-stat-key">Levantado</span>
              </div>
              {/* Badge de estado (Activa / Adquirida) */}
              <span className={`el-status ${s.status === 'Activa' ? 'active' : 'acquired'}`}>
                {s.status}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default StartupsView;
