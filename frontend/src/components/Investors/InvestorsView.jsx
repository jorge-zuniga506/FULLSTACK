import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { investorService } from '../../services/investorService';
import { useAuth } from '../../context/AuthContext';
import Pagination from '../Common/Pagination';
import '../../styles/EntityList.css'; // Estilos compartidos de listas de entidades

/**
 * InvestorsView — Lista de inversores con búsqueda, filtros y paginación
 */
const InvestorsView = () => {
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

  // Carga de datos desde el backend
  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        page: currentPage,
        limit: 6,
        search: search || undefined
      };
      
      const data = await investorService.getAll(params, token);
      
      setItems(data.inversores || []);
      setTotalPages(data.totalPages || 1);
      setTotalItems(data.totalItems || 0);
    } catch (err) {
      console.error(err);
      setError('No se pudieron cargar los inversores.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, token]);

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
          <h1 className="el-title">💼 Inversores</h1>
          <p className="el-subtitle">
            {loading ? 'Cargando...' : `${totalItems} inversores encontrados`}
          </p>
        </div>
        <button className="el-add-btn">+ Registrar Inversor</button>
      </div>

      {/* ── BUSCADOR ────────────────────────────────────────────────────── */}
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
      </div>

      {/* ── MENSAJES DE ESTADO ─────────────────────────────────────────── */}
      {error && <div className="el-error-msg">{error}</div>}

      {/* ── GRID DE TARJETAS ────────────────────────────────────────────── */}
      {loading ? (
        <div className="el-loading-wrap">Cargando inversores...</div>
      ) : items.length === 0 ? (
        <div className="el-empty-msg">No se encontraron inversores.</div>
      ) : (
        <div className="el-grid">
          {items.map(inv => (
            <Link
              className="el-card"
              key={inv.id}
              to={`/investor/${inv.nombre.toLowerCase().replace(/ /g, '-')}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div className="el-card-top">
                <div className="el-card-logo">💎</div>
                <span className="el-stage-badge" style={{ background: 'rgba(0,170,255,0.1)', color: '#00aaff' }}>
                  Inversor
                </span>
              </div>
              <h3 className="el-card-name">{inv.nombre}</h3>
              <p className="el-card-meta">
                {Array.isArray(inv.sectores_interes) ? inv.sectores_interes.join(' · ') : (inv.sectores_interes || 'Sectores no definidos')}
              </p>
              <div className="el-card-footer">
                <div className="el-card-stat">
                  <span className="el-stat-val">${inv.presupuesto_min ? (inv.presupuesto_min / 1000) + 'K' : '0'}</span>
                  <span className="el-stat-key">Min Ticket</span>
                </div>
                <div className="el-card-stat">
                  <span className="el-stat-val">${inv.presupuesto_max ? (inv.presupuesto_max / 1000) + 'K' : '0'}</span>
                  <span className="el-stat-key">Max Ticket</span>
                </div>
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

export default InvestorsView;
