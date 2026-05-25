import React, { useState } from 'react';
import '../../styles/Dashboard.css';

/**
 * AceleradoraDashboard — Vista premium para Aceleradoras de Negocio (role_id=3)
 * Ahora enriquecido con la guía interactiva del rol de la Aceleradora en el Ecosistema.
 */
const AceleradoraDashboard = () => {
  const [activeFunction, setActiveFunction] = useState('funding');

  const stats = [
    { id: 1, label: 'Startups Aceleradas', value: '28', change: '+4 esta cohorte', icon: '⚡', color: '#059669' },
    { id: 2, label: 'Mentores Activos', value: '45', change: 'Especialistas', icon: '👨‍🏫', color: '#7c3aed' },
    { id: 3, label: 'Programas de Incubación', value: '6', change: '2 abiertos', icon: '🎓', color: '#00aaff' },
    { id: 4, label: 'Fondos Canalizados', value: '$210K', change: '+32% tracción', icon: '💎', color: '#b1f500' }
  ];

  const funcionesAceleradora = [
    {
      key: 'funding',
      title: 'Financiamiento Inicial',
      icon: '💵',
      subtitle: 'Capital semilla e impulso operativo',
      description: 'Proporcionan capital semilla (usualmente entre $40,000 y $150,000) para que la startup pueda validar su producto y operar durante sus primeros meses.',
      details: 'Este financiamiento permite al equipo fundador concentrarse a tiempo completo en el desarrollo técnico y la adquisición de sus primeros clientes sin preocuparse por la liquidez inmediata.'
    },
    {
      key: 'mentorship',
      title: 'Mentoría y Capacitación',
      icon: '🧠',
      subtitle: 'Estrategia y lecciones de expertos',
      description: 'Conectan a los fundadores con expertos, empresarios experimentados y líderes de la industria que guían la estrategia del negocio, el desarrollo del producto y las técnicas de venta.',
      details: 'El acompañamiento intensivo ayuda a evitar errores comunes, optimizar el ajuste producto-mercado (product-market fit) y perfeccionar el pitch de ventas.'
    },
    {
      key: 'networking',
      title: 'Ampliación de Redes',
      icon: '🌐',
      subtitle: 'Contactos y Venture Capital',
      description: 'Facilitan la interacción con otros fundadores y crean oportunidades para interactuar directamente con fondos de inversión de capital de riesgo (Venture Capital) y clientes potenciales.',
      details: 'Un ecosistema fuerte provee conexiones invaluables. El roce diario con otros emprendedores fomenta el co-aprendizaje y acelera las alianzas estratégicas.'
    },
    {
      key: 'demoday',
      title: 'Demo Day (Demostración)',
      icon: '📢',
      subtitle: 'Lanzamiento a gran escala',
      description: 'El programa suele culminar con este evento, donde las startups presentan sus avances, modelos de negocio y proyecciones frente a una audiencia de inversores.',
      details: 'Es la vitrina de mayor impacto del ecosistema, diseñada exclusivamente para captar la atención de fondos de Venture Capital e inversores ángeles para levantar rondas semilla o Serie A.'
    }
  ];

  return (
    <div style={styles.container}>
      <div className="db-header">
        <div>
          <h1 className="db-title" style={styles.neonTitle}>Panel de Control: Aceleradora</h1>
          <p className="db-subtitle">Administra convocatorias, cohortes de incubación y mentorías corporativas</p>
        </div>
        <button style={styles.premiumBtn}>⚡ Lanzar Convocatoria</button>
      </div>

      {/* KPI Cards */}
      <div className="db-stats-grid">
        {stats.map(s => (
          <div className="db-stat-card" key={s.id} style={{ '--accent': s.color, ...styles.statCard }}>
            <div className="db-stat-top">
              <span className="db-stat-icon" style={{ fontSize: '28px' }}>{s.icon}</span>
              <span className="db-stat-change" style={{ color: s.color === '#b1f500' ? '#b1f500' : undefined }}>{s.change}</span>
            </div>
            <p className="db-stat-value" style={styles.statValue}>{s.value}</p>
            <p className="db-stat-label" style={styles.statLabel}>{s.label}</p>
            <div className="db-stat-bar">
              <div className="db-stat-fill" style={{ background: s.color, width: '65%' }}></div>
            </div>
          </div>
        ))}
      </div>

      {/* SECCIÓN ACADEMIA DE ACELERACIÓN (MANUAL INTERACTIVO) */}
      <div className="db-card" style={styles.academySection}>
        <div style={styles.academyHeader}>
          <div style={styles.academyBadge}>⚡ Catalizador del Ecosistema</div>
          <h2 style={styles.academyTitle}>¿Qué es una Aceleradora de Startups?</h2>
          <p style={styles.academySubtitle}>
            Es un programa intensivo de corta duración (3 a 6 meses) diseñado para impulsar el crecimiento rápido de startups en etapas tempranas. A cambio de una pequeña participación accionaria (equity), ofrece capital semilla, mentoría especializada, espacios de trabajo y acceso a una red de contactos para conectar con futuros inversores.
          </p>
        </div>

        {/* Layout de dos columnas */}
        <div style={styles.handbookLayout}>
          {/* Columna Izquierda: Menú Selector */}
          <div style={styles.tabsCol}>
            <p style={styles.menuLabel}>Funciones Estratégicas Clave</p>
            <div style={styles.menuList}>
              {funcionesAceleradora.map((f) => (
                <button
                  key={f.key}
                  style={{
                    ...styles.menuItemBtn,
                    ...(activeFunction === f.key ? styles.menuItemBtnActive : {})
                  }}
                  onClick={() => setActiveFunction(f.key)}
                >
                  <span style={{ marginRight: '12px', fontSize: '18px' }}>{f.icon}</span>
                  <div style={{ textAlign: 'left' }}>
                    <p style={styles.menuItemTitle}>{f.title}</p>
                    <p style={styles.menuItemSub}>{f.subtitle}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Columna Derecha: Tarjeta de Detalle Premium */}
          {(() => {
            const selected = funcionesAceleradora.find(f => f.key === activeFunction);
            return (
              <div style={styles.detailCard}>
                <div style={styles.detailCardHeader}>
                  <span style={styles.detailCardIcon}>{selected.icon}</span>
                  <div>
                    <span style={styles.detailCardBadge}>Función Ecosistémica</span>
                    <h3 style={styles.detailCardTitle}>{selected.title}</h3>
                  </div>
                </div>
                <p style={styles.detailCardDesc}>{selected.description}</p>
                <div style={styles.detailCardDivider} />
                <div style={styles.detailCardExtra}>
                  <span style={{ fontSize: '20px', marginRight: '10px' }}>💡</span>
                  <p style={styles.detailCardExtraText}>{selected.details}</p>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Grid 2 Columnas (Estadísticas y Cohortes) */}
      <div style={styles.grid2Col}>
        <div className="db-card" style={styles.card}>
          <h3 style={styles.cardTitle}>🌱 Tráfico de Startups Postuladas</h3>
          <div style={styles.chartMock}>
            {[45, 60, 80, 50, 95, 110].map((h, i) => (
              <div key={i} style={styles.chartCol}>
                <div style={{ ...styles.chartBar, height: `${(h/110)*100}%`, background: 'linear-gradient(to top, #059669, #b1f500)' }}></div>
                <span style={styles.chartLabel}>Cohorte {i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="db-card" style={styles.card}>
          <h3 style={styles.cardTitle}>🔥 Cohorte Activa (Top Startups)</h3>
          <div style={styles.list}>
            <div style={styles.listItem}>
              <div>
                <p style={styles.itemMain}>EcoPack Costa Rica</p>
                <p style={styles.itemSub}>Empaques biodegradables a base de yuca</p>
              </div>
              <span style={{ ...styles.badge, background: 'rgba(5,150,105,0.1)', color: '#059669' }}>Incubación</span>
            </div>
            <div style={styles.listItem}>
              <div>
                <p style={styles.itemMain}>CyberGuard CR</p>
                <p style={styles.itemSub}>Ciberseguridad impulsada por IA para PyMEs</p>
              </div>
              <span style={{ ...styles.badge, background: 'rgba(0,170,255,0.1)', color: '#00aaff' }}>Aceleración</span>
            </div>
            <div style={styles.listItem}>
              <div>
                <p style={styles.itemMain}>FarmaEnvíos</p>
                <p style={styles.itemSub}>Distribución logística inteligente de salud</p>
              </div>
              <span style={{ ...styles.badge, background: 'rgba(121,0,194,0.1)', color: '#a78bfa' }}>Graduada</span>
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
    textShadow: '0 0 15px rgba(5, 150, 105, 0.2)',
  },
  premiumBtn: {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #059669 0%, #b1f500 100%)',
    border: 'none',
    borderRadius: '12px',
    color: '#fff',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 5px 15px rgba(5, 150, 105, 0.3)',
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
  academySection: {
    background: 'rgba(11, 19, 36, 0.45)',
    border: '1px solid rgba(5, 150, 105, 0.2)',
    boxShadow: '0 0 25px rgba(5, 150, 105, 0.05)',
    backdropFilter: 'blur(15px)',
    padding: '28px',
    borderRadius: '20px',
    marginTop: '30px',
    textAlign: 'left',
  },
  academyHeader: {
    marginBottom: '28px',
  },
  academyBadge: {
    display: 'inline-block',
    padding: '6px 12px',
    fontSize: '11px',
    fontWeight: '700',
    color: '#b1f500',
    background: 'rgba(177, 245, 0, 0.08)',
    border: '1px solid rgba(177, 245, 0, 0.15)',
    borderRadius: '50px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '12px',
  },
  academyTitle: {
    fontSize: '24px',
    fontWeight: '800',
    color: '#ffffff',
    margin: '0 0 12px 0',
    letterSpacing: '-0.5px',
  },
  academySubtitle: {
    fontSize: '15px',
    color: '#a0aec0',
    lineHeight: '1.6',
    margin: 0,
    maxWidth: '920px',
  },
  handbookLayout: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.2fr',
    gap: '32px',
  },
  tabsCol: {
    display: 'flex',
    flexDirection: 'column',
  },
  menuLabel: {
    fontSize: '11px',
    color: '#8899aa',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontWeight: '700',
    marginBottom: '12px',
    paddingLeft: '4px',
  },
  menuList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  menuItemBtn: {
    padding: '14px 18px',
    background: 'rgba(255, 255, 255, 0.01)',
    border: '1px solid rgba(255, 255, 255, 0.03)',
    borderRadius: '12px',
    color: '#8899aa',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
  },
  menuItemBtnActive: {
    color: '#ffffff',
    background: 'rgba(5, 150, 105, 0.12)',
    border: '1px solid rgba(5, 150, 105, 0.35)',
    boxShadow: '0 0 15px rgba(5, 150, 105, 0.08)',
  },
  menuItemTitle: {
    margin: 0,
    fontSize: '14px',
    fontWeight: '700',
    color: '#ffffff',
  },
  menuItemSub: {
    margin: '3px 0 0 0',
    fontSize: '11px',
    color: '#8899aa',
  },
  detailCard: {
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '16px',
    padding: '28px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    boxShadow: 'inset 0 0 30px rgba(255, 255, 255, 0.01)',
  },
  detailCardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '20px',
  },
  detailCardIcon: {
    fontSize: '32px',
    background: 'rgba(5, 150, 105, 0.12)',
    width: '56px',
    height: '56px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(5, 150, 105, 0.2)',
  },
  detailCardBadge: {
    display: 'inline-block',
    fontSize: '11px',
    fontWeight: '700',
    color: '#b1f500',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '4px',
  },
  detailCardTitle: {
    fontSize: '19px',
    fontWeight: '700',
    color: '#ffffff',
    margin: 0,
  },
  detailCardDesc: {
    fontSize: '14.5px',
    color: '#cbd5e0',
    lineHeight: '1.6',
    margin: '0 0 20px 0',
  },
  detailCardDivider: {
    height: '1px',
    background: 'linear-gradient(to right, rgba(5, 150, 105, 0.3), transparent)',
    marginBottom: '20px',
  },
  detailCardExtra: {
    display: 'flex',
    alignItems: 'start',
    background: 'rgba(0, 0, 0, 0.15)',
    padding: '16px',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.02)',
  },
  detailCardExtraText: {
    fontSize: '12.5px',
    color: '#a0aec0',
    lineHeight: '1.5',
    margin: 0,
    fontStyle: 'italic',
    textAlign: 'left',
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

export default AceleradoraDashboard;
