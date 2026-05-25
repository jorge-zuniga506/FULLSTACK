import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Dashboard.css'; // Estilos del layout con sidebar y cards
import ReusableCRUD from '../Common/ReusableCRUD';
import { startupService } from '../../services/startupService';
import { apiService } from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';

// Definición de las columnas del CRUD de Startups
const startupColumns = [
  { key: 'nombre_comercial', label: 'Nombre Comercial', type: 'text', required: true },
  { key: 'descripcion', label: 'Descripción', type: 'textarea' },
  { key: 'fase', label: 'Etapa de Desarrollo', type: 'select', options: ['Idea', 'Semilla', 'Serie A', 'Serie B', 'Escalamiento'], required: true },
  { key: 'logo_url', label: 'Logo (URL o Emoji)', type: 'text' },
  { key: 'sector_id', label: 'ID Sector (Catálogo)', type: 'number', defaultValue: 1 },
  { key: 'user_id', label: 'ID Propietario (Usuario)', type: 'number', required: true }
];

/**
 * DashboardView — Vista general del ecosistema emprendedor con datos reales y refresco automático
 */
const DashboardView = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [recentEntities, setRecentEntities] = useState([]);

  // Carga de datos reales del dashboard (usando el endpoint de admin por ser el más completo)
  const fetchDashboardData = async () => {
    try {
      const data = await apiService.getOne('/api/dashboard/admin', token);
      
      // Mapeamos los stats del backend
      if (data.stats) {
        const accentColors = ['#00aaff', '#7c3aed', '#059669', '#d97706'];
        setStats(data.stats.map((s, i) => ({
          ...s,
          id: i,
          color: accentColors[i % accentColors.length]
        })));
      }

      // Para las entidades recientes, como el endpoint de admin no las trae, 
      // podemos traer las últimas 5 startups por ahora como fallback real
      const startupsData = await startupService.getAll({ limit: 5, sortBy: 'id', order: 'DESC' }, token);
      if (startupsData && startupsData.startups) {
        setRecentEntities(startupsData.startups.map(s => ({
          id: s.id,
          name: s.nombre_comercial,
          type: 'Startup',
          sector: 'Tecnología',
          stage: s.fase || 'N/A',
          logo: s.logo_url || '🚀'
        })));
      }

    } catch (err) {
      console.error('Error al cargar dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchDashboardData();
  }, [token]);

  // Colores por tipo de entidad
  const typeColors = {
    'Startup':     { bg: 'rgba(0,170,255,0.1)',  border: 'rgba(0,170,255,0.3)',  text: '#00aaff' },
    'Inversor':    { bg: 'rgba(124,58,237,0.1)', border: 'rgba(124,58,237,0.3)', text: '#a78bfa' },
    'Aceleradora': { bg: 'rgba(5,150,105,0.1)',  border: 'rgba(5,150,105,0.3)',  text: '#34d399' },
  };

  return (
    <>
      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <div className="db-header">
        <div>
          <h1 className="db-title">Dashboard del Ecosistema</h1>
          <p className="db-subtitle">Vista general del ecosistema emprendedor local</p>
        </div>
        <Link to="/explorer" className="db-explore-btn">🗺️ Abrir Explorador</Link>
      </div>

      {/* ── KPI CARDS ───────────────────────────────────────────────────── */}
      <div className="db-stats-grid">
        {loading ? (
          <p style={{ color: '#9ca3af' }}>Sincronizando métricas...</p>
        ) : stats.map(s => (
          <div className="db-stat-card" key={s.id} style={{ '--accent': s.color }}>
            <div className="db-stat-top">
              <span className="db-stat-icon">{s.icon || '📊'}</span>
              <span className="db-stat-change">{s.change}</span>
            </div>
            <p className="db-stat-value">{s.value}</p>
            <p className="db-stat-label">{s.label}</p>
            <div className="db-stat-bar">
              <div className="db-stat-fill" style={{ background: s.color }}></div>
            </div>
          </div>
        ))}
      </div>

      {/* ── BOTTOM GRID ─────────────────────────────────────────────────── */}
      <div className="db-bottom-grid">
        {/* Entidades recientes */}
        <div className="db-card">
          <div className="db-card-header">
            <h2 className="db-card-title">Entidades Recientes</h2>
            <Link to="/explorer" className="db-card-link">Ver todas →</Link>
          </div>
          <div className="db-entities-list">
            {loading ? (
              <p style={{ padding: '20px', color: '#9ca3af' }}>Cargando...</p>
            ) : recentEntities.length === 0 ? (
              <p style={{ padding: '20px', color: '#9ca3af' }}>No hay entidades registradas.</p>
            ) : recentEntities.map(e => (
              <div className="db-entity-row" key={e.id}>
                <div className="db-entity-logo">{e.logo}</div>
                <div className="db-entity-info">
                  <p className="db-entity-name">{e.name}</p>
                  <p className="db-entity-sector">{e.sector}</p>
                </div>
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

        {/* Gráfico de Sectores (Mock por ahora, pero estético) */}
        <div className="db-card">
          <div className="db-card-header">
            <h2 className="db-card-title">Sectores Principales</h2>
          </div>
          <div className="db-sectors-list">
            {[
              { name: 'Fintech',    count: 68, pct: 82 },
              { name: 'Healthtech', count: 54, pct: 65 },
              { name: 'Edtech',     count: 47, pct: 56 },
              { name: 'Agritech',   count: 38, pct: 46 },
            ].map(s => (
              <div className="db-sector-row" key={s.name}>
                <div className="db-sector-info">
                  <span className="db-sector-name">{s.name}</span>
                  <span className="db-sector-count">{s.count} entidades</span>
                </div>
                <div className="db-sector-bar-wrap">
                  <div className="db-sector-bar" style={{ width: `${s.pct}%` }}></div>
                </div>
                <span className="db-sector-pct">{s.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SECCIÓN DE GESTIÓN CRUD REUTILIZABLE ─────────────────────────── */}
      <div style={{ marginTop: '30px', textAlign: 'left' }}>
        <ReusableCRUD
          service={startupService}
          columns={startupColumns}
          title="Gestión de Startups"
          onActionSuccess={fetchDashboardData} // <--- REFRESCO AUTOMÁTICO TRAS ACCIÓN
        />
      </div>
    </>
  );
};


export default DashboardView;
