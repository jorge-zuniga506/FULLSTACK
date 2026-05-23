import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/apiService';
import Swal from 'sweetalert2';
import '../../styles/Dashboard.css';

/**
 * DashboardErrorCard — Componente premium in-line para fallos de conexión o autenticación
 */
const DashboardErrorCard = ({ message, onRetry }) => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', width: '100%' }}>
    <div className="db-error-card" style={{ borderColor: 'rgba(0, 170, 255, 0.2)' }}>
      <span className="db-error-icon" style={{ animation: 'bounce 2s infinite' }}>🚀</span>
      <h3 className="db-error-title" style={{ color: '#00aaff' }}>Servicio Temporalmente Inactivo</h3>
      <p className="db-error-message">
        {message || 'No pudimos conectar con los servicios de tu Startup. Verifica tu conexión de red o vuelve a intentarlo.'}
      </p>
      <button className="db-error-retry-btn" style={{ background: 'linear-gradient(135deg, #00aaff 0%, #7c3aed 100%)' }} onClick={onRetry}>
        🔄 Reintentar Sincronización
      </button>
    </div>
  </div>
);

/**
 * StartupDashboardSkeleton — Layout shimmer glassmorphic para carga fluida con acento azul/magenta
 */
const StartupDashboardSkeleton = () => (
  <div style={styles.container}>
    <div className="db-header" style={{ marginBottom: '30px' }}>
      <div>
        <div className="db-shimmer" style={{ width: '320px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)' }} />
        <div className="db-shimmer" style={{ width: '400px', height: '14px', borderRadius: '4px', marginTop: '12px', background: 'rgba(255,255,255,0.02)' }} />
      </div>
      <div className="db-shimmer" style={{ width: '160px', height: '42px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)' }} />
    </div>

    {/* Stats Skeleton */}
    <div className="db-stats-grid" style={{ marginBottom: '30px' }}>
      {[1, 2, 3, 4].map(n => (
        <div className="db-skeleton-card" key={n} style={{ borderColor: 'rgba(0, 170, 255, 0.05)' }}>
          <div className="db-stat-top">
            <div className="db-shimmer db-skeleton-circle" style={{ background: 'rgba(0, 170, 255, 0.1)' }} />
            <div className="db-shimmer" style={{ width: '60px', height: '18px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)' }} />
          </div>
          <div className="db-shimmer" style={{ width: '110px', height: '32px', borderRadius: '6px', marginTop: '15px', background: 'rgba(255,255,255,0.03)' }} />
          <div className="db-shimmer" style={{ width: '130px', height: '14px', borderRadius: '4px', marginTop: '10px', background: 'rgba(255,255,255,0.02)' }} />
          <div className="db-stat-bar" style={{ marginTop: '15px' }}>
            <div className="db-shimmer" style={{ width: '100%', height: '100%' }} />
          </div>
        </div>
      ))}
    </div>

    {/* Grid Content Skeleton */}
    <div style={styles.grid2Col}>
      <div className="db-card" style={styles.card}>
        <div className="db-shimmer" style={{ width: '150px', height: '20px', borderRadius: '4px', marginBottom: '24px', background: 'rgba(255,255,255,0.03)' }} />
        <div style={styles.chartMock}>
          {[35, 55, 75, 45, 85, 95].map((h, i) => (
            <div key={i} style={styles.chartCol}>
              <div className="db-shimmer" style={{ width: '100%', height: `${h}%`, borderRadius: '6px 6px 0 0', background: 'linear-gradient(to top, rgba(0, 170, 255, 0.05), rgba(124, 58, 237, 0.15))' }} />
              <div className="db-shimmer" style={{ width: '35px', height: '10px', borderRadius: '2px', marginTop: '8px' }} />
            </div>
          ))}
        </div>
      </div>

      <div className="db-card" style={styles.card}>
        <div className="db-shimmer" style={{ width: '210px', height: '20px', borderRadius: '4px', marginBottom: '24px', background: 'rgba(255,255,255,0.03)' }} />
        <div style={styles.list}>
          {[1, 2, 3].map(n => (
            <div key={n} style={styles.listItem}>
              <div style={{ flex: 1 }}>
                <div className="db-shimmer" style={{ width: '60%', height: '14px', borderRadius: '4px', background: 'rgba(255,255,255,0.03)' }} />
                <div className="db-shimmer" style={{ width: '40%', height: '11px', borderRadius: '3px', marginTop: '8px', background: 'rgba(255,255,255,0.02)' }} />
              </div>
              <div className="db-shimmer" style={{ width: '80px', height: '20px', borderRadius: '50px', background: 'rgba(0,170,255,0.05)' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

/**
 * StartupDashboard — Vista premium para emprendedores y startups (role_id=2)
 */
const StartupDashboard = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dashboardData, setDashboardData] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiService.getOne('/api/dashboard/startup', token);
      setDashboardData(data);
    } catch (err) {
      console.error('Error al obtener datos del panel de startup:', err);
      setError(err.message || 'Error al conectar con los servicios de tu Startup.');
      Swal.fire({
        icon: 'error',
        title: 'Error de Conexión',
        text: 'No pudimos descargar el estado actual de tu tracción y métricas.',
        background: '#080f1e',
        color: '#ffffff',
        confirmButtonColor: '#00aaff'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  if (loading) {
    return <StartupDashboardSkeleton />;
  }

  if (error || !dashboardData) {
    return <DashboardErrorCard message={error} onRetry={fetchDashboardData} />;
  }

  // Paleta de colores neón adaptativa para Startup
  const accentColors = ['#00aaff', '#7c3aed', '#b1f500', '#eab308'];

  // Mapeamos dinámicamente las estadísticas del backend
  const stats = (dashboardData.stats || []).map((s, index) => ({
    ...s,
    id: index + 1,
    color: accentColors[index % accentColors.length]
  }));

  const metrics = dashboardData.metricsList || [];

  return (
    <div style={styles.container}>
      <div className="db-header">
        <div>
          <h1 className="db-title" style={styles.neonTitle}>{dashboardData.title || 'Panel de Control: Startup'}</h1>
          <p className="db-subtitle">{dashboardData.subtitle || 'Administra tu tracción, postulaciones y métricas clave de crecimiento'}</p>
        </div>
        <button style={styles.premiumBtn} onClick={() => {
          Swal.fire({
            title: 'Ronda de Inversión Abierta',
            text: '¡Tu pitch deck está visible para más de 50 inversionistas activos en la plataforma!',
            icon: 'success',
            background: '#080f1e',
            color: '#ffffff',
            confirmButtonColor: '#00aaff'
          });
        }}>🚀 Levantar Capital</button>
      </div>

      {/* KPI Cards Reales */}
      <div className="db-stats-grid">
        {stats.map(s => (
          <div className="db-stat-card" key={s.id} style={{ '--accent': s.color, ...styles.statCard }}>
            <div className="db-stat-top">
              <span className="db-stat-icon" style={{ fontSize: '28px' }}>{s.icon || '🚀'}</span>
              <span className="db-stat-change" style={{ color: s.color }}>{s.change}</span>
            </div>
            <p className="db-stat-value" style={styles.statValue}>{s.value}</p>
            <p className="db-stat-label" style={styles.statLabel}>{s.label}</p>
            <div className="db-stat-bar">
              <div className="db-stat-fill" style={{ background: s.color, width: '85%' }}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Startup Secciones Especiales */}
      <div style={styles.grid2Col}>
        <div className="db-card" style={styles.card}>
          <h3 style={styles.cardTitle}>📈 Tracción y Rendimiento Operativo</h3>
          <div style={styles.chartMock}>
            {metrics.map((m, i) => (
              <div key={i} style={styles.chartCol}>
                <div style={{ ...styles.chartBar, height: `${m.value}%`, background: `linear-gradient(to top, #7c3aed, ${m.color || '#00aaff'})` }}></div>
                <span style={styles.chartLabel} title={m.label}>{m.label.length > 12 ? m.label.slice(0, 10) + '..' : m.label}</span>
              </div>
            ))}
            {/* Relleno estético para completar 6 barras si es necesario */}
            {metrics.length < 6 && [35, 45, 60].slice(0, 6 - metrics.length).map((h, i) => (
              <div key={`fill-${i}`} style={styles.chartCol}>
                <div style={{ ...styles.chartBar, height: `${h}%`, background: 'linear-gradient(to top, rgba(255,255,255,0.02), rgba(255,255,255,0.1))' }}></div>
                <span style={styles.chartLabel}>Mes {metrics.length + i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="db-card" style={styles.card}>
          <h3 style={styles.cardTitle}>🏆 Postulaciones & Programas</h3>
          <div style={styles.list}>
            <div style={styles.listItem}>
              <div>
                <p style={styles.itemMain}>Aceleradora Sabor Tico 2026</p>
                <p style={styles.itemSub}>Fase de Pitch de Selección</p>
              </div>
              <span style={{ ...styles.badge, background: 'rgba(234,179,8,0.1)', color: '#eab308' }}>En revisión</span>
            </div>
            <div style={styles.listItem}>
              <div>
                <p style={styles.itemMain}>Fondo Startup Costa Rica</p>
                <p style={styles.itemSub}>Capital Semilla No Reembolsable</p>
              </div>
              <span style={{ ...styles.badge, background: 'rgba(177,245,0,0.1)', color: '#b1f500' }}>Aprobado</span>
            </div>
            <div style={styles.listItem}>
              <div>
                <p style={styles.itemMain}>Scale Up Centroamérica</p>
                <p style={styles.itemSub}>Filtro de Tracción Inicial</p>
              </div>
              <span style={{ ...styles.badge, background: 'rgba(0,170,255,0.1)', color: '#00aaff' }}>Recibido</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '10px 0',
  },
  neonTitle: {
    textShadow: '0 0 15px rgba(0, 170, 255, 0.2)',
  },
  premiumBtn: {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #00aaff 0%, #7c3aed 100%)',
    border: 'none',
    borderRadius: '12px',
    color: '#fff',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 5px 15px rgba(0, 170, 255, 0.3)',
    transition: 'all 0.3s ease',
  },
  statCard: {
    background: 'rgba(11, 19, 36, 0.5)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
  },
  statValue: {
    fontSize: '32px',
    color: '#ffffff',
    fontWeight: '800',
  },
  statLabel: {
    color: '#8899aa',
    fontSize: '14px',
  },
  grid2Col: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '24px',
    marginTop: '30px',
  },
  card: {
    background: 'rgba(11, 19, 36, 0.5)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    padding: '24px',
    borderRadius: '16px',
    textAlign: 'left',
  },
  cardTitle: {
    fontSize: '18px',
    color: '#ffffff',
    margin: '0 0 20px 0',
    fontWeight: '700',
  },
  chartMock: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: '180px',
    padding: '10px 0',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  chartCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '28%',
  },
  chartBar: {
    width: '100%',
    borderRadius: '6px 6px 0 0',
    transition: 'all 0.6s ease',
  },
  chartLabel: {
    fontSize: '11px',
    color: '#8899aa',
    marginTop: '8px',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.04)',
    borderRadius: '10px',
  },
  itemMain: {
    margin: 0,
    fontSize: '14px',
    fontWeight: '600',
    color: '#ffffff',
  },
  itemSub: {
    margin: '4px 0 0 0',
    fontSize: '12px',
    color: '#8899aa',
  },
  badge: {
    padding: '4px 10px',
    fontSize: '11px',
    fontWeight: '700',
    borderRadius: '50px',
    textTransform: 'uppercase',
  },
};

export default StartupDashboard;
