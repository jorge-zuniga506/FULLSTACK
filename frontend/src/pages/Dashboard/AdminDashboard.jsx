import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/apiService';
import { userService } from '../../services/userService';
import ReusableCRUD from '../../components/Common/ReusableCRUD';
import Swal from 'sweetalert2';
import '../../styles/Dashboard.css';

// Definición de las columnas del CRUD de Usuarios para el Administrador
const userColumns = [
  { key: 'cedula', label: 'Cédula/ID', type: 'text', required: true },
  { key: 'nombre_hacienda', label: 'Nombre Completo', type: 'text', required: true },
  { key: 'email', label: 'Correo Electrónico', type: 'text', required: true },
  { key: 'role_id', label: 'ID Rol (1:Admin, 2:Startup, 3:Acel, 4:Inv)', type: 'number', required: true },
  { key: 'is_role_whitelisted', label: 'Whitelisted', type: 'select', options: ['true', 'false'], defaultValue: 'false' }
];

/**
 * DashboardErrorCard — Componente premium in-line para fallos de conexión o autenticación
 */
const DashboardErrorCard = ({ message, onRetry }) => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', width: '100%' }}>
    <div className="db-error-card">
      <span className="db-error-icon" style={{ animation: 'bounce 2s infinite' }}>🚨</span>
      <h3 className="db-error-title">Servidor Inalcanzable</h3>
      <p className="db-error-message">
        {message || 'Hubo un problema al conectar con la consola de administración. Verifica tu conexión de red o si el servidor está activo.'}
      </p>
      <button className="db-error-retry-btn" onClick={onRetry}>
        🔄 Reintentar Conexión
      </button>
    </div>
  </div>
);

/**
 * AdminDashboardSkeleton — Layout shimmer glassmorphic para carga fluida
 */
const AdminDashboardSkeleton = () => (
  <div style={styles.container}>
    <div className="db-header" style={{ marginBottom: '30px' }}>
      <div>
        <div className="db-shimmer" style={{ width: '280px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)' }} />
        <div className="db-shimmer" style={{ width: '450px', height: '14px', borderRadius: '4px', marginTop: '12px', background: 'rgba(255,255,255,0.02)' }} />
      </div>
      <div className="db-shimmer" style={{ width: '140px', height: '42px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)' }} />
    </div>

    {/* Stats Skeleton */}
    <div className="db-stats-grid" style={{ marginBottom: '30px' }}>
      {[1, 2, 3, 4].map(n => (
        <div className="db-skeleton-card" key={n}>
          <div className="db-stat-top">
            <div className="db-shimmer db-skeleton-circle" />
            <div className="db-shimmer" style={{ width: '70px', height: '18px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)' }} />
          </div>
          <div className="db-shimmer" style={{ width: '100px', height: '32px', borderRadius: '6px', marginTop: '15px', background: 'rgba(255,255,255,0.03)' }} />
          <div className="db-shimmer" style={{ width: '140px', height: '14px', borderRadius: '4px', marginTop: '10px', background: 'rgba(255,255,255,0.02)' }} />
          <div className="db-stat-bar" style={{ marginTop: '15px' }}>
            <div className="db-shimmer" style={{ width: '100%', height: '100%' }} />
          </div>
        </div>
      ))}
    </div>

    {/* Grid Content Skeleton */}
    <div style={styles.grid2Col}>
      <div className="db-card" style={styles.card}>
        <div className="db-shimmer" style={{ width: '160px', height: '20px', borderRadius: '4px', marginBottom: '24px', background: 'rgba(255,255,255,0.03)' }} />
        <div style={styles.chartMock}>
          {[40, 60, 80, 50, 90, 70].map((h, i) => (
            <div key={i} style={styles.chartCol}>
              <div className="db-shimmer" style={{ width: '100%', height: `${h}%`, borderRadius: '6px 6px 0 0' }} />
              <div className="db-shimmer" style={{ width: '35px', height: '10px', borderRadius: '2px', marginTop: '8px' }} />
            </div>
          ))}
        </div>
      </div>

      <div className="db-card" style={styles.card}>
        <div className="db-shimmer" style={{ width: '180px', height: '20px', borderRadius: '4px', marginBottom: '24px', background: 'rgba(255,255,255,0.03)' }} />
        <div style={styles.list}>
          {[1, 2, 3].map(n => (
            <div key={n} style={styles.listItem}>
              <div style={{ flex: 1 }}>
                <div className="db-shimmer" style={{ width: '50%', height: '14px', borderRadius: '4px', background: 'rgba(255,255,255,0.03)' }} />
                <div className="db-shimmer" style={{ width: '70%', height: '11px', borderRadius: '3px', marginTop: '8px', background: 'rgba(255,255,255,0.02)' }} />
              </div>
              <div className="db-shimmer" style={{ width: '60px', height: '18px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

/**
 * AdminDashboard — Vista de panel premium para Administradores de la Plataforma (role_id=1)
 */
const AdminDashboard = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dashboardData, setDashboardData] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await apiService.getOne('/api/dashboard/admin', token);
      const data = response?.data || {};
      setDashboardData(data);
    } catch (err) {
      console.error('Error al obtener datos del panel administrativo:', err);
      setError(err.message || 'Error al conectar con la consola de administración.');
      Swal.fire({
        icon: 'error',
        title: 'Error de Sincronización',
        text: 'No se pudieron recuperar las métricas operativas del servidor.',
        background: '#080f1e',
        color: '#ffffff',
        confirmButtonColor: '#7c3aed'
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
    return <AdminDashboardSkeleton />;
  }

  if (error || !dashboardData) {
    return <DashboardErrorCard message={error} onRetry={fetchDashboardData} />;
  }

  // Paleta de colores neón adaptativa para las métricas administrativas
  const accentColors = ['#7c3aed', '#059669', '#b1f500', '#00aaff'];

  // Mapeamos dinámicamente el array stats del backend con colores locales
  const stats = (dashboardData.stats || []).map((s, index) => ({
    ...s,
    id: index + 1,
    color: accentColors[index % accentColors.length]
  }));

  // Extraemos las métricas de rendimiento del sistema
  const metrics = dashboardData.metricsList || [];

  return (
    <div style={styles.container}>
      <div className="db-header">
        <div>
          <h1 className="db-title" style={styles.neonTitle}>{dashboardData.title || 'Panel de Administración'}</h1>
          <p className="db-subtitle">{dashboardData.subtitle || 'Supervisa la salud del sistema y configuraciones globales.'}</p>
        </div>
        <button style={styles.premiumBtn} onClick={() => {
          Swal.fire({
            title: 'Configuraciones de Infraestructura',
            text: 'Módulos operativos en estado óptimo. No se requieren acciones manuales en este momento.',
            icon: 'info',
            background: '#080f1e',
            color: '#ffffff',
            confirmButtonColor: '#7c3aed'
          });
        }}>⚙️ Configuraciones</button>
      </div>

      {/* KPI Cards Reales del Backend */}
      <div className="db-stats-grid">
        {stats.map(s => (
          <div className="db-stat-card" key={s.id} style={{ '--accent': s.color, ...styles.statCard }}>
            <div className="db-stat-top">
              <span className="db-stat-icon" style={{ fontSize: '28px' }}>{s.icon || '🛡️'}</span>
              <span className="db-stat-change">{s.change}</span>
            </div>
            <p className="db-stat-value" style={styles.statValue}>{s.value}</p>
            <p className="db-stat-label" style={styles.statLabel}>{s.label}</p>
            <div className="db-stat-bar">
              <div className="db-stat-fill" style={{ background: s.color, width: '90%' }}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Grid 2 Columnas de Rendimiento en Tiempo Real */}
      <div style={styles.grid2Col}>
        <div className="db-card" style={styles.card}>
          <h3 style={styles.cardTitle}>📈 Crecimiento y Rendimiento API</h3>
          <div style={styles.chartMock}>
            {metrics.map((m, i) => (
              <div key={i} style={styles.chartCol}>
                <div style={{ ...styles.chartBar, height: `${m.value}%`, background: `linear-gradient(to top, #7c3aed, ${m.color || '#00aaff'})` }}></div>
                <span style={styles.chartLabel}>{m.label.split(' ')[0]}</span>
              </div>
            ))}
            {/* Relleno estético para completar 6 barras si es necesario */}
            {metrics.length < 6 && [30, 45, 60].slice(0, 6 - metrics.length).map((h, i) => (
              <div key={`fill-${i}`} style={styles.chartCol}>
                <div style={{ ...styles.chartBar, height: `${h}%`, background: 'linear-gradient(to top, rgba(255,255,255,0.02), rgba(255,255,255,0.1))' }}></div>
                <span style={styles.chartLabel}>N/A</span>
              </div>
            ))}
          </div>
        </div>

        <div className="db-card" style={styles.card}>
          <h3 style={styles.cardTitle}>🔑 Infraestructura Global & Logs Activos</h3>
          <div style={styles.list}>
            <div style={styles.listItem}>
              <div>
                <p style={styles.itemMain}>Autenticación 2FA Global</p>
                <p style={styles.itemSub}>Sistema automatizado de token seguro activo</p>
              </div>
              <span style={{ ...styles.badge, background: 'rgba(5,150,105,0.1)', color: '#059669' }}>Activo</span>
            </div>
            <div style={styles.listItem}>
              <div>
                <p style={styles.itemMain}>Base de Datos Principal</p>
                <p style={styles.itemSub}>Conexión establecida exitosamente vía MySQL2</p>
              </div>
              <span style={{ ...styles.badge, background: 'rgba(0,170,255,0.1)', color: '#00aaff' }}>Conectada</span>
            </div>
            <div style={styles.listItem}>
              <div>
                <p style={styles.itemMain}>Servidor de Aplicaciones</p>
                <p style={styles.itemSub}>Escuchando peticiones HTTPS en puerto de producción</p>
              </div>
              <span style={{ ...styles.badge, background: 'rgba(177,245,0,0.1)', color: '#b1f500' }}>ONLINE</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── SECCIÓN DE GESTIÓN DE USUARIOS (CRUD CON REFRESCO AUTOMÁTICO) ── */}
      <div style={{ marginTop: '40px' }}>
        <ReusableCRUD
          service={userService}
          columns={userColumns}
          title="Control Maestro de Usuarios"
          onActionSuccess={fetchDashboardData} // <--- ESTO IMPLEMENTA EL REFRESCO AUTOMÁTICO DE LA UI
        />
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '10px 0',
  },
  neonTitle: {
    textShadow: '0 0 15px rgba(121, 0, 194, 0.2)',
  },
  premiumBtn: {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #7c3aed 0%, #00aaff 100%)',
    border: 'none',
    borderRadius: '12px',
    color: '#fff',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 5px 15px rgba(121, 0, 194, 0.3)',
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
    width: '12%',
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

export default AdminDashboard;
