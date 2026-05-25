import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { startupService } from '../../services/startupService';
import { useAuth } from '../../context/AuthContext';
import Pagination from '../Common/Pagination';
import '../../styles/EntityList.css'; // Estilos de .el-header, .el-grid, .el-card, etc.

/** Opciones del filtro de etapa de inversión */
const STAGES = ['Todas', 'Idea', 'Semilla', 'Serie A', 'Serie B', 'Escalamiento'];

/**
 * Colores de badge por etapa de inversión
 */
const STAGE_COLOR = {
  'Idea':         { bg: 'rgba(255,255,255,0.05)', color: '#aaaaaa' },
  'Semilla':      { bg: 'rgba(0,170,255,0.1)',    color: '#00aaff' },
  'Serie A':      { bg: 'rgba(124,58,237,0.1)',   color: '#a78bfa' },
  'Serie B':      { bg: 'rgba(16,185,129,0.1)',   color: '#10b981' },
  'Escalamiento': { bg: 'rgba(245,158,11,0.1)',   color: '#f59e0b' },
};

/**
 * StartupsView — Lista de startups del ecosistema con búsqueda, filtros y paginación
 */
const StartupsView = () => {
  const { token } = useAuth();
  
  // Estados de datos
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Paginación y búsqueda
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState(''); // Texto del buscador
  const [stage,  setStage]  = useState('Todas'); // Etapa seleccionada

  // Carga de datos desde el backend
  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        page: currentPage,
        limit: 6, // 6 por página para el grid
        search: search || undefined,
        fase: stage !== 'Todas' ? stage : undefined
      };
      
      const data = await startupService.getAll(params, token);
      
      // El backend devuelve { totalItems, totalPages, currentPage, startups }
      setItems(data.startups || []);
      setTotalPages(data.totalPages || 1);
      setTotalItems(data.totalItems || 0);
    } catch (err) {
      console.error(err);
      setError('No se pudieron cargar las startups. Verifica la conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  // Recargar al cambiar página, búsqueda o filtros
  useEffect(() => {
    fetchData();
  }, [currentPage, stage, token]);

  // Manejador de búsqueda con "enter" o al perder el foco (para no saturar el server)
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      setCurrentPage(1);
      fetchData();
    }
  };

  return (
    <>
      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <div className="el-header">
        <div>
          <h1 className="el-title">🚀 Startups</h1>
          <p className="el-subtitle">
            {loading ? 'Cargando...' : `${totalItems} startups encontradas`}
          </p>
        </div>
        <button className="el-add-btn">+ Registrar Startup</button>
      </div>

      {/* ── FILTROS ─────────────────────────────────────────────────────── */}
      <div className="el-filters">
        <div className="el-search-wrap">
          <span>🔍</span>
          <input
            className="el-search"
            placeholder="Buscar por nombre... (Presiona Enter)"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyPress={handleSearchKeyPress}
          />
        </div>
        <div className="el-filter-pills">
          {STAGES.map(s => (
            <button
              key={s}
              className={`el-pill ${stage === s ? 'active' : ''}`}
              onClick={() => {
                setStage(s);
                setCurrentPage(1);
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* ── MENSAJES DE ESTADO ─────────────────────────────────────────── */}
      {error && <div className="el-error-msg">{error}</div>}

      {/* ── GRID DE TARJETAS ────────────────────────────────────────────── */}
      {loading ? (
        <div className="el-loading-wrap">Cargando startups...</div>
      ) : items.length === 0 ? (
        <div className="el-empty-msg">No se encontraron startups que coincidan con los filtros.</div>
      ) : (
        <div className="el-grid">
          {items.map(s => (
            <Link
              className="el-card"
              key={s.id}
              to={`/startup/${s.nombre_comercial.toLowerCase().replace(/ /g, '-')}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div className="el-card-top">
                <div className="el-card-logo">
                  {s.logo_url ? <img src={s.logo_url} alt={s.nombre_comercial} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : '🚀'}
                </div>
                <span
                  className="el-stage-badge"
                  style={{ 
                    background: STAGE_COLOR[s.fase]?.bg || 'rgba(255,255,255,0.05)', 
                    color: STAGE_COLOR[s.fase]?.color || '#aaa' 
                  }}
                >
                  {s.fase || 'N/A'}
                </span>
              </div>
              <h3 className="el-card-name">{s.nombre_comercial}</h3>
              <p className="el-card-meta">{s.descripcion ? s.descripcion.substring(0, 60) + '...' : 'Sin descripción'}</p>
              <div className="el-card-footer">
                <div className="el-card-stat">
                  <span className="el-stat-val">S/D</span>
                  <span className="el-stat-key">Levantado</span>
                </div>
                <span className="el-status active">Activa</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* ── PAGINACIÓN ────────────────────────────────────────────────── */}
      <Pagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={(page) => setCurrentPage(page)} 
      />
    </>
  );
};

export default StartupsView;
