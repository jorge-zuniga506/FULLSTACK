import React, { useState } from 'react';
import '../../styles/Dashboard.css';

/**
 * InversorDashboard — Vista premium para Inversores y Fondos de Venture Capital (role_id=4)
 * Ahora enriquecido con la guía interactiva del Ecosistema de Startups.
 */
const InversorDashboard = () => {
  const [activeGuideTab, setActiveGuideTab] = useState('functions');
  const [activeFunction, setActiveFunction] = useState('capital');
  const [activeType, setActiveType] = useState('angel');

  const stats = [
    { id: 1, label: 'Capital Comprometido', value: '$1.4M', change: '80% desplegado', icon: '💼', color: '#eab308' },
    { id: 2, label: 'Startups en Portafolio', value: '12', change: '+2 Q1', icon: '🚀', color: '#00aaff' },
    { id: 3, label: 'Dealflow Analizado', value: '148', change: '24 prioritarias', icon: '🔍', color: '#7c3aed' },
    { id: 4, label: 'Tasa Interna de Retorno', value: '24.8%', change: 'ROI Promedio', icon: '📈', color: '#b1f500' }
  ];

  const funcionesInversionista = [
    {
      key: 'capital',
      title: 'Inyección de Capital',
      icon: '💰',
      description: 'Proveen el financiamiento necesario para que las startups puedan desarrollar su producto, contratar talento y sobrevivir a sus etapas iniciales.',
      detail: 'El capital es la savia vital de una startup en etapas tempranas. Permite superar el "valle de la muerte" antes de alcanzar la rentabilidad.'
    },
    {
      key: 'mentorship',
      title: 'Mentoría y Dirección',
      icon: '🧠',
      description: 'Utilizan su experiencia para guiar a los fundadores, ayudarles a ajustar su modelo de negocio y evitar errores comunes.',
      detail: 'Al haber recorrido el camino empresarial, un inversor actúa como un faro estratégico, ayudando a pivotar y optimizar las operaciones.'
    },
    {
      key: 'networking',
      title: 'Networking (Red de Contactos)',
      icon: '🌐',
      description: 'Conectan a los emprendedores con clientes potenciales, socios comerciales y futuros inversionistas.',
      detail: 'Una agenda de contactos de alto nivel puede acelerar el crecimiento comercial en meses o años, abriendo puertas corporativas infranqueables.'
    },
    {
      key: 'validation',
      title: 'Validación del Negocio',
      icon: '✅',
      description: 'El respaldo de un inversionista reconocido aumenta la credibilidad de la startup en el mercado.',
      detail: 'La debida diligencia de un inversor prestigioso funciona como un sello de aprobación ante otros clientes, proveedores y futuros socios de financiamiento.'
    }
  ];

  const tiposInversionistas = [
    {
      key: 'angel',
      title: 'Inversores Ángel (Business Angels)',
      badge: 'Fase Semilla o Pre-Semilla',
      icon: '👼',
      focus: 'Patrimonio Propio',
      description: 'Suelen ser personas con patrimonio propio que invierten en las fases más tempranas (etapa semilla o pre-semilla). Aportan montos menores y están muy involucrados en el día a día del emprendimiento.',
      highlight: 'Aportan montos menores y cercanía diaria en fases iniciales.'
    },
    {
      key: 'vc',
      title: 'Capital de Riesgo (Venture Capital o VC)',
      badge: 'Tracción & Crecimiento Rápido',
      icon: '🏢',
      focus: 'Fondos de Terceros',
      description: 'Son firmas o fondos que gestionan dinero de terceros. Invierten sumas más grandes en empresas que ya tienen tracción y buscan un crecimiento rápido y exponencial.',
      highlight: 'Invierten sumas grandes buscando rendimientos de alto impacto.'
    },
    {
      key: 'cvc',
      title: 'Inversionistas Corporativos (CVC)',
      badge: 'Estratégico & Sinergias',
      icon: '🏭',
      focus: 'Grandes Empresas',
      description: 'Grandes empresas que invierten en startups para incorporar innovaciones tecnológicas a su propio negocio y lograr acuerdos comerciales estratégicos.',
      highlight: 'Enlazan tecnología de punta con su propio núcleo corporativo.'
    }
  ];

  return (
    <div style={styles.container}>
      <div className="db-header">
        <div>
          <h1 className="db-title" style={styles.neonTitle}>Panel de Control: Inversionista</h1>
          <p className="db-subtitle">Monitorea tu portafolio de inversión, dealflow entrante y retornos proyectados</p>
        </div>
        <button style={styles.premiumBtn}>💼 Buscar Oportunidades</button>
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
              <div className="db-stat-fill" style={{ background: s.color, width: '80%' }}></div>
            </div>
          </div>
        ))}
      </div>

      {/* SECCIÓN ACADEMIA DE INVERSIÓN (HANDBOOK INTERACTIVO) */}
      <div className="db-card" style={styles.academySection}>
        <div style={styles.academyHeader}>
          <div style={styles.academyBadge}>✨ Ecosistema de Startups</div>
          <h2 style={styles.academyTitle}>El Rol del Inversionista en el Ecosistema</h2>
          <p style={styles.academySubtitle}>
            Un inversionista impulsa el crecimiento de empresas emergentes aportando capital financiero, experiencia estratégica y su red de contactos. Su objetivo es asumir riesgos tempranos a cambio de obtener una alta rentabilidad si la empresa se escala y consolida.
          </p>
        </div>

        {/* Tabs Principales */}
        <div style={styles.tabsContainer}>
          <button 
            style={{
              ...styles.tabBtn,
              ...(activeGuideTab === 'functions' ? styles.tabBtnActive : {})
            }}
            onClick={() => setActiveGuideTab('functions')}
          >
            ⚡ Funciones Principales
          </button>
          <button 
            style={{
              ...styles.tabBtn,
              ...(activeGuideTab === 'types' ? styles.tabBtnActive : {})
            }}
            onClick={() => setActiveGuideTab('types')}
          >
            💼 Tipos de Inversionistas
          </button>
        </div>

        {/* Contenido Dinámico */}
        {activeGuideTab === 'functions' ? (
          <div style={styles.functionsGrid}>
            {funcionesInversionista.map((f) => (
              <div 
                key={f.key} 
                style={{
                  ...styles.functionCard,
                  ...(activeFunction === f.key ? styles.functionCardActive : {})
                }}
                onClick={() => setActiveFunction(f.key)}
              >
                <div style={styles.functionIcon}>{f.icon}</div>
                <h4 style={styles.functionTitle}>{f.title}</h4>
                <p style={styles.functionDesc}>{f.description}</p>
                {activeFunction === f.key && (
                  <div style={styles.functionDetail}>
                    <div style={styles.detailDivider} />
                    <p style={styles.detailText}>{f.detail}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.typesContainer}>
            <div style={styles.typesTabs}>
              {tiposInversionistas.map((t) => (
                <button
                  key={t.key}
                  style={{
                    ...styles.typeTabBtn,
                    ...(activeType === t.key ? styles.typeTabBtnActive : {})
                  }}
                  onClick={() => setActiveType(t.key)}
                >
                  <span style={{ marginRight: '12px', fontSize: '20px' }}>{t.icon}</span>
                  {t.title.split(' (')[0]}
                </button>
              ))}
            </div>

            {/* Panel de detalles */}
            {(() => {
              const selectedType = tiposInversionistas.find(t => t.key === activeType);
              return (
                <div style={styles.typeDetailCard}>
                  <div style={styles.typeDetailHeader}>
                    <span style={styles.typeIconLarge}>{selectedType.icon}</span>
                    <div>
                      <span style={styles.typeBadge}>{selectedType.badge}</span>
                      <h3 style={styles.typeDetailTitle}>{selectedType.title}</h3>
                    </div>
                  </div>
                  <div style={styles.typeMetaGrid}>
                    <div style={styles.typeMetaItem}>
                      <span style={styles.typeMetaLabel}>Origen del Capital</span>
                      <span style={styles.typeMetaValue}>{selectedType.focus}</span>
                    </div>
                    <div style={styles.typeMetaItem}>
                      <span style={styles.typeMetaLabel}>Enfoque Clave</span>
                      <span style={styles.typeMetaValue}>{selectedType.highlight}</span>
                    </div>
                  </div>
                  <p style={styles.typeDetailDesc}>{selectedType.description}</p>
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* Grid 2 Columnas (Estadísticas y Dealflow) */}
      <div style={styles.grid2Col}>
        <div className="db-card" style={styles.card}>
          <h3 style={styles.cardTitle}>📊 Distribución del Portafolio</h3>
          <div style={styles.chartMock}>
            {[65, 30, 45, 55, 75, 40].map((h, i) => (
              <div key={i} style={styles.chartCol}>
                <div style={{ ...styles.chartBar, height: `${h}%`, background: 'linear-gradient(to top, #7c3aed, #eab308)' }}></div>
                <span style={styles.chartLabel}>Sector {i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="db-card" style={styles.card}>
          <h3 style={styles.cardTitle}>💎 Startups de Interés Reciente (Dealflow)</h3>
          <div style={styles.list}>
            <div style={styles.listItem}>
              <div>
                <p style={styles.itemMain}>TicoDeliveries</p>
                <p style={styles.itemSub}>Software de última milla para farmacias regionales</p>
              </div>
              <span style={{ ...styles.badge, background: 'rgba(234,179,8,0.1)', color: '#eab308' }}>Serie A</span>
            </div>
            <div style={styles.listItem}>
              <div>
                <p style={styles.itemMain}>EduCosta</p>
                <p style={styles.itemSub}>Plataforma LMS gamificada para escuelas rurales</p>
              </div>
              <span style={{ ...styles.badge, background: 'rgba(177,245,0,0.1)', color: '#b1f500' }}>Pre-Semilla</span>
            </div>
            <div style={styles.listItem}>
              <div>
                <p style={styles.itemMain}>PuraVida Biotech</p>
                <p style={styles.itemSub}>Tratamiento de aguas residuales mediante hongos</p>
              </div>
              <span style={{ ...styles.badge, background: 'rgba(0,170,255,0.1)', color: '#00aaff' }}>Semilla</span>
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
    textShadow: '0 0 15px rgba(234, 179, 8, 0.2)',
  },
  premiumBtn: {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #7c3aed 0%, #eab308 100%)',
    border: 'none',
    borderRadius: '12px',
    color: '#fff',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 5px 15px rgba(124, 58, 237, 0.3)',
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
    border: '1px solid rgba(234, 179, 8, 0.15)',
    boxShadow: '0 0 25px rgba(234, 179, 8, 0.05)',
    backdropFilter: 'blur(15px)',
    padding: '28px',
    borderRadius: '20px',
    marginTop: '30px',
    textAlign: 'left',
  },
  academyHeader: {
    marginBottom: '24px',
  },
  academyBadge: {
    display: 'inline-block',
    padding: '6px 12px',
    fontSize: '11px',
    fontWeight: '700',
    color: '#eab308',
    background: 'rgba(234, 179, 8, 0.1)',
    border: '1px solid rgba(234, 179, 8, 0.2)',
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
    maxWidth: '900px',
  },
  tabsContainer: {
    display: 'flex',
    gap: '12px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    paddingBottom: '16px',
    marginBottom: '24px',
  },
  tabBtn: {
    padding: '10px 20px',
    background: 'transparent',
    border: '1px solid transparent',
    borderRadius: '8px',
    color: '#8899aa',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  tabBtnActive: {
    color: '#ffffff',
    background: 'rgba(234, 179, 8, 0.12)',
    border: '1px solid rgba(234, 179, 8, 0.4)',
    boxShadow: '0 0 12px rgba(234, 179, 8, 0.1)',
  },
  functionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
  },
  functionCard: {
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '16px',
    padding: '20px',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  functionCardActive: {
    background: 'rgba(234, 179, 8, 0.03)',
    border: '1px solid rgba(234, 179, 8, 0.35)',
    boxShadow: '0 0 20px rgba(234, 179, 8, 0.05)',
    transform: 'translateY(-2px)',
  },
  functionIcon: {
    fontSize: '28px',
    marginBottom: '16px',
  },
  functionTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#ffffff',
    margin: '0 0 10px 0',
  },
  functionDesc: {
    fontSize: '13px',
    color: '#8899aa',
    lineHeight: '1.5',
    margin: 0,
  },
  functionDetail: {
    marginTop: '16px',
    animation: 'fadeIn 0.3s ease-out',
  },
  detailDivider: {
    height: '1px',
    background: 'linear-gradient(to right, rgba(234, 179, 8, 0.3), transparent)',
    marginBottom: '12px',
  },
  detailText: {
    fontSize: '12.5px',
    color: '#eab308',
    lineHeight: '1.5',
    margin: 0,
    fontWeight: '500',
  },
  typesContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: '24px',
    alignItems: 'start',
  },
  typesTabs: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  typeTabBtn: {
    padding: '14px 18px',
    background: 'rgba(255, 255, 255, 0.01)',
    border: '1px solid rgba(255, 255, 255, 0.04)',
    borderRadius: '12px',
    color: '#8899aa',
    fontSize: '14px',
    fontWeight: '600',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
  },
  typeTabBtnActive: {
    color: '#ffffff',
    background: 'rgba(234, 179, 8, 0.1)',
    border: '1px solid rgba(234, 179, 8, 0.35)',
    boxShadow: '0 0 15px rgba(234, 179, 8, 0.08)',
  },
  typeDetailCard: {
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '16px',
    padding: '24px',
    minHeight: '220px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    boxShadow: 'inset 0 0 20px rgba(255, 255, 255, 0.01)',
  },
  typeDetailHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '20px',
  },
  typeIconLarge: {
    fontSize: '36px',
    background: 'rgba(234, 179, 8, 0.1)',
    width: '60px',
    height: '60px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(234, 179, 8, 0.2)',
  },
  typeBadge: {
    display: 'inline-block',
    fontSize: '11px',
    fontWeight: '700',
    color: '#eab308',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '4px',
  },
  typeDetailTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#ffffff',
    margin: 0,
  },
  typeMetaGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '20px',
    background: 'rgba(0, 0, 0, 0.15)',
    padding: '12px 16px',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.02)',
  },
  typeMetaItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  typeMetaLabel: {
    fontSize: '11px',
    color: '#8899aa',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  typeMetaValue: {
    fontSize: '13px',
    color: '#ffffff',
    fontWeight: '600',
  },
  typeDetailDesc: {
    fontSize: '14px',
    color: '#cbd5e0',
    lineHeight: '1.6',
    margin: 0,
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

export default InversorDashboard;
