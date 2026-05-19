import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/EntityList.css'; // Estilos compartidos de listas de entidades

// ─── Datos Mock ───────────────────────────────────────────────────────────────
// TODO: reemplazar con GET /api/accelerators cuando el backend esté conectado

/** Lista de programas de aceleración del ecosistema */
const ACCELERATORS = [
  {
    id: 1,
    name: 'StartupLab CCA',
    type: 'Aceleradora',
    duration: '6 meses',
    benefit: '$15K + mentoría',
    egresadas: 45,
    sectors: ['General'],
    country: 'Costa Rica',
    logo: '⚡',
    open: true,   // Convocatoria actualmente abierta
  },
  {
    id: 2,
    name: 'GreenAccel',
    type: 'Aceleradora',
    duration: '4 meses',
    benefit: '$10K + red',
    egresadas: 22,
    sectors: ['Agritech', 'Cleantech'],
    country: 'Costa Rica',
    logo: '🌿',
    open: false,  // Sin convocatoria activa
  },
];

/**
 * AcceleratorsView — Lista de aceleradoras con búsqueda por nombre
 *
 * Funcionalidades:
 * - Búsqueda en tiempo real por nombre (case-insensitive)
 * - Cada tarjeta enlaza al perfil detallado: /accelerator/:slug
 *
 * El slug se genera dinámicamente desde el nombre:
 *   "StartupLab CCA" → "startuplab-cca"
 *
 * Información mostrada por tarjeta:
 * - Logo + tipo de programa
 * - Sectores foco
 * - Duración del programa
 * - Número de startups egresadas
 *
 * Estado:
 * - search: texto de búsqueda actual
 */
const AcceleratorsView = () => {
  const [search, setSearch] = useState(''); // Texto del buscador

  // Filtra aceleradoras por nombre
  const filtered = ACCELERATORS.filter(a => {
    if (search && !a.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <>
      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <div className="el-header">
        <div>
          <h1 className="el-title">⚡ Aceleradoras</h1>
          <p className="el-subtitle">{filtered.length} programas</p>
        </div>
        {/* TODO: abrir modal o ruta de registro de programa */}
        <button className="el-add-btn">+ Registrar Programa</button>
      </div>

      {/* ── BUSCADOR ────────────────────────────────────────────────────── */}
      <div className="el-filters">
        <div className="el-search-wrap">
          <span>🔍</span>
          <input
            className="el-search"
            placeholder="Buscar programa..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* ── GRID DE TARJETAS ────────────────────────────────────────────── */}
      <div className="el-grid">
        {filtered.map(a => (
          // Enlaza al perfil de la aceleradora usando slug generado del nombre
          <Link
            className="el-card"
            key={a.id}
            to={`/accelerator/${a.name.toLowerCase().replace(/ /g, '-')}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div className="el-card-top">
              <div className="el-card-logo">{a.logo}</div>
              {/* Badge tipo aceleradora en verde */}
              <span className="el-stage-badge" style={{ background: 'rgba(5,150,105,0.1)', color: '#34d399' }}>
                {a.type}
              </span>
            </div>
            <h3 className="el-card-name">{a.name}</h3>
            {/* Sectores foco y país */}
            <p className="el-card-meta">{a.sectors.join(' · ')} · {a.country}</p>
            <div className="el-card-footer">
              {/* Duración del programa */}
              <div className="el-card-stat">
                <span className="el-stat-val">{a.duration}</span>
                <span className="el-stat-key">Duración</span>
              </div>
              {/* Startups que han completado el programa */}
              <div className="el-card-stat">
                <span className="el-stat-val">{a.egresadas}</span>
                <span className="el-stat-key">Egresadas</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default AcceleratorsView;
