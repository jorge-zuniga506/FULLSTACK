import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/EntityList.css'; // Estilos compartidos de listas de entidades

// ─── Datos Mock ───────────────────────────────────────────────────────────────
// TODO: reemplazar con GET /api/investors cuando el backend esté conectado

/** Lista de inversores del ecosistema */
const INVESTORS = [
  { id: 1, name: 'Fondo Innovar', type: 'VC',    sectors: ['Fintech', 'Edtech'],         ticket: '$100K–$500K', portfolio: 8,  country: 'Costa Rica', logo: '💎', focus: 'Serie A'  },
  { id: 2, name: 'AngelCR',       type: 'Ángel', sectors: ['Agritech', 'General'],        ticket: '$20K–$80K',  portfolio: 14, country: 'Costa Rica', logo: '😇', focus: 'Pre-seed' },
  { id: 3, name: 'TechVentures',  type: 'VC',    sectors: ['Healthtech', 'Fintech'],      ticket: '$500K–$2M',  portfolio: 6,  country: 'Panamá',     logo: '🏢', focus: 'Serie A'  },
];

/**
 * InvestorsView — Lista de inversores con búsqueda por nombre
 *
 * Funcionalidades:
 * - Búsqueda en tiempo real por nombre (case-insensitive)
 * - Cada tarjeta enlaza al perfil detallado: /investor/:slug
 *
 * El slug se genera dinámicamente desde el nombre:
 *   "Fondo Innovar" → "fondo-innovar"
 *
 * Información mostrada por tarjeta:
 * - Logo + tipo de inversor (VC / Ángel)
 * - Sectores de interés
 * - Ticket promedio
 * - Tamaño del portfolio
 *
 * Estado:
 * - search: texto de búsqueda actual
 */
const InvestorsView = () => {
  const [search, setSearch] = useState(''); // Texto del buscador

  // Filtra inversores por nombre
  const filtered = INVESTORS.filter(i => {
    if (search && !i.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <>
      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <div className="el-header">
        <div>
          <h1 className="el-title">💼 Inversores</h1>
          <p className="el-subtitle">{filtered.length} inversores en el ecosistema</p>
        </div>
        {/* TODO: abrir modal o ruta de registro de inversor */}
        <button className="el-add-btn">+ Registrar Inversor</button>
      </div>

      {/* ── BUSCADOR ────────────────────────────────────────────────────── */}
      <div className="el-filters">
        <div className="el-search-wrap">
          <span>🔍</span>
          <input
            className="el-search"
            placeholder="Buscar inversor..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* ── GRID DE TARJETAS ────────────────────────────────────────────── */}
      <div className="el-grid">
        {filtered.map(inv => (
          // Enlaza al perfil del inversor usando slug generado del nombre
          <Link
            className="el-card"
            key={inv.id}
            to={`/investor/${inv.name.toLowerCase().replace(/ /g, '-')}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div className="el-card-top">
              <div className="el-card-logo">{inv.logo}</div>
              {/* Badge con el tipo de inversor (VC / Ángel) */}
              <span className="el-stage-badge" style={{ background: 'rgba(0,170,255,0.1)', color: '#00aaff' }}>
                {inv.type}
              </span>
            </div>
            <h3 className="el-card-name">{inv.name}</h3>
            {/* Sectores separados por punto · y país */}
            <p className="el-card-meta">{inv.sectors.join(' · ')} · {inv.country}</p>
            <div className="el-card-footer">
              {/* Rango de ticket de inversión */}
              <div className="el-card-stat">
                <span className="el-stat-val">{inv.ticket}</span>
                <span className="el-stat-key">Ticket</span>
              </div>
              {/* Número de empresas en portfolio */}
              <div className="el-card-stat">
                <span className="el-stat-val">{inv.portfolio}</span>
                <span className="el-stat-key">Portfolio</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default InvestorsView;
