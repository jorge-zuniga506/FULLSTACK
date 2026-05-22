import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { acceleratorService } from '../../services/acceleratorService';
import { useAuth } from '../../context/AuthContext';
import Pagination from '../Common/Pagination';
import '../../styles/EntityList.css';

/**
 * AcceleratorsView — Lista de aceleradoras con búsqueda y paginación
 */
const AcceleratorsView = () => {
  const { token } = useAuth();

  // Estados de datos
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Paginación y búsqueda
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState('');

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
      
      const data = await acceleratorService.getAll(params, token);
      
      setItems(data.aceleradoras || []);
      setTotalPages(data.totalPages || 1);
      setTotalItems(data.totalItems || 0);
    } catch (err) {
      console.error(err);
      setError('No se pudieron cargar las aceleradoras.');
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
      <div className="el-header">
        <div>
          <h1 className="el-title">⚡ Aceleradoras</h1>
          <p className="el-subtitle">
            {loading ? 'Cargando...' : `${totalItems} aceleradoras encontradas`}
          </p>
        </div>
        <button className="el-add-btn">+ Registrar Aceleradora</button>
      </div>

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

      {error && <div className="el-error-msg">{error}</div>}

      {loading ? (
        <div className="el-loading-wrap">Cargando aceleradoras...</div>
      ) : items.length === 0 ? (
        <div className="el-empty-msg">No se encontraron aceleradoras.</div>
      ) : (
        <div className="el-grid">
          {items.map(acc => (
            <Link
              className="el-card"
              key={acc.id}
              to={`/accelerator/${acc.nombre.toLowerCase().replace(/ /g, '-')}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div className="el-card-top">
                <div className="el-card-logo">⚡</div>
                <span className="el-stage-badge" style={{ background: 'rgba(124,58,237,0.1)', color: '#a78bfa' }}>
                  Aceleradora
                </span>
              </div>
              <h3 className="el-card-name">{acc.nombre}</h3>
              <p className="el-card-meta">
                {acc.programas_activos ? acc.programas_activos.substring(0, 100) + '...' : 'Sin programas activos'}
              </p>
              <div className="el-card-footer">
                <div className="el-card-stat">
                  <span className="el-stat-val">URL</span>
                  <span className="el-stat-key">{acc.sitio_web || 'No disponible'}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <Pagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={(page) => setCurrentPage(page)} 
      />
    </>
  );
};

export default AcceleratorsView;
