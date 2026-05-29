import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/apiService';
import Swal from 'sweetalert2';
import '../../styles/Dashboard.css';
import ExchangeRatePanel from '../../components/Common/ExchangeRatePanel';

/* ── Tabs ─────────────────────────────────────────────────────────────────── */
const TABS = [
  { key: 'overview',  label: '📊 Mi Panel' },
  { key: 'demoday',  label: '🎓 Demo Day Virtual' },
  { key: 'solicitudes', label: '💌 Mis Solicitudes' },
];

/* ── Componente Principal ─────────────────────────────────────────────────── */
const InversorDashboard = () => {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [activeGuideTab, setActiveGuideTab] = useState('functions');
  const [activeFunction, setActiveFunction] = useState('capital');
  const [activeType, setActiveType] = useState('angel');

  // Demo Day data
  const [startups,     setStartups]     = useState([]);
  const [sectores,     setSectores]     = useState([]);
  const [filterSector, setFilterSector] = useState('');
  const [solicitudes,  setSolicitudes]  = useState([]);
  const [loadingSol,   setLoadingSol]   = useState({});

  /* ── Loaders ──────────────────────────────────────────────────────────── */
  const loadStartups = useCallback(async () => {
    try {
      const params = filterSector ? { sector_id: filterSector } : {};
      const r = await apiService.getAll('/api/demoday/startups', params, token);
      const data = r.data || [];
      setStartups(data);
      // Extraer sectores únicos del resultado para el filtro
      const sects = [...new Map(data.filter(s => s.Sector).map(s => [s.Sector.id, s.Sector])).values()];
      if (sects.length > 0) setSectores(prev => [...new Map([...prev, ...sects].map(s => [s.id, s])).values()]);
    } catch {}
  }, [token, filterSector]);

  const loadSolicitudes = useCallback(async () => {
    try {
      const r = await apiService.getOne('/api/demoday/mis-solicitudes', token);
      setSolicitudes(r.data || []);
    } catch {}
  }, [token]);

  useEffect(() => {
    if (!token) return;
    if (activeTab === 'demoday') loadStartups();
    if (activeTab === 'solicitudes') loadSolicitudes();
  }, [activeTab, token, filterSector]);

  /* ── Acciones ─────────────────────────────────────────────────────────── */
  const solicitarReunion = async (startupId, nombreStartup) => {
    const { value: mensaje, isConfirmed } = await Swal.fire({
      title: `Contactar a ${nombreStartup}`,
      input: 'textarea',
      inputLabel: 'Mensaje para los fundadores',
      inputPlaceholder: 'Describe tu interés en invertir, tu fondo, y por qué crees que pueden trabajar juntos...',
      inputAttributes: { rows: 4 },
      showCancelButton: true,
      confirmButtonText: '📤 Enviar Solicitud',
      cancelButtonText: 'Cancelar',
      background: '#080f1e',
      color: '#ffffff',
      confirmButtonColor: '#8b00dd',
      inputValidator: (v) => !v && 'Por favor escribe un mensaje.',
      customClass: { input: 'swal-textarea-dark' }
    });

    if (!isConfirmed) return;

    setLoadingSol(prev => ({ ...prev, [startupId]: true }));
    try {
      await apiService.create('/api/demoday/solicitar', { startup_id: startupId, mensaje }, token);
      Swal.fire({
        icon: 'success',
        title: '¡Solicitud enviada!',
        text: `${nombreStartup} recibirá tu solicitud de reunión.`,
        background: '#080f1e',
        color: '#fff',
        confirmButtonColor: '#8b00dd'
      });
      loadSolicitudes();
    } catch (err) {
      Swal.fire({ icon: 'info', title: 'Aviso', text: err.message, background: '#080f1e', color: '#fff' });
    } finally {
      setLoadingSol(prev => ({ ...prev, [startupId]: false }));
    }
  };

  /* ── Guía del inversor ──────────────────────────────────────────────── */
  const funcionesInversionista = [
    { key: 'capital', title: 'Inyección de Capital', icon: '💰', description: 'Proveen el financiamiento necesario para que las startups desarrollen su producto y sobrevivan en etapas iniciales.', detail: 'El capital es la savia vital. Permite superar el "valle de la muerte" antes de alcanzar la rentabilidad.' },
    { key: 'mentorship', title: 'Mentoría y Dirección', icon: '🧠', description: 'Utilizan su experiencia para guiar a los fundadores, ajustar el modelo de negocio y evitar errores comunes.', detail: 'Un inversor activo actúa como faro estratégico, ayudando a pivotar y optimizar operaciones.' },
    { key: 'networking', title: 'Networking', icon: '🌐', description: 'Conectan a los emprendedores con clientes potenciales, socios comerciales y futuros inversionistas.', detail: 'Una agenda de alto nivel puede acelerar el crecimiento comercial en meses o años.' },
    { key: 'validation', title: 'Validación del Negocio', icon: '✅', description: 'El respaldo de un inversionista reconocido aumenta la credibilidad de la startup en el mercado.', detail: 'La debida diligencia funciona como sello de aprobación ante clientes, proveedores y futuros socios.' }
  ];

  const tiposInversionistas = [
    { key: 'angel', title: 'Inversores Ángel', badge: 'Fase Semilla o Pre-Semilla', icon: '👼', focus: 'Patrimonio Propio', description: 'Invierten en las fases más tempranas. Aportan montos menores y están muy involucrados en el día a día.', highlight: 'Cercanía diaria en fases iniciales.' },
    { key: 'vc',    title: 'Venture Capital', badge: 'Tracción & Crecimiento', icon: '🏢', focus: 'Fondos de Terceros', description: 'Fondos que gestionan dinero de terceros. Invierten sumas más grandes en empresas con tracción y crecimiento exponencial.', highlight: 'Invierten sumas grandes buscando alto impacto.' },
    { key: 'cvc',   title: 'Inversionistas Corporativos', badge: 'Estratégico & Sinergias', icon: '🏭', focus: 'Grandes Empresas', description: 'Grandes empresas que invierten para incorporar innovaciones tecnológicas y lograr acuerdos estratégicos.', highlight: 'Enlazan tecnología de punta con su núcleo corporativo.' }
  ];

  const stats = [
    { label: 'Capital Comprometido', value: '$1.4M', change: '80% desplegado', icon: '💼', color: '#eab308' },
    { label: 'Startups en Portafolio', value: '12', change: '+2 Q1', icon: '🚀', color: '#00aaff' },
    { label: 'Dealflow Analizado', value: '148', change: '24 prioritarias', icon: '🔍', color: '#8b00dd' },
    { label: 'Tasa Interna de Retorno', value: '24.8%', change: 'ROI Promedio', icon: '📈', color: '#b1f500' }
  ];

  const selectedFunc = funcionesInversionista.find(f => f.key === activeFunction);
  const selectedType = tiposInversionistas.find(t => t.key === activeType);

  /* ── Render ───────────────────────────────────────────────────────────── */
  return (
    <div style={{ padding: '10px 0' }}>
      {/* Header */}
      <div className="db-header" style={{ marginBottom: '24px' }}>
        <div>
          <h1 className="db-title">Panel de Control: Inversionista</h1>
          <p className="db-subtitle">Monitorea tu portafolio, accede al Demo Day Virtual y conecta con startups aceleradas</p>
        </div>
        <button style={S.goldBtn} onClick={() => setActiveTab('demoday')}>🎓 Acceder al Demo Day</button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', flexWrap: 'wrap', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px' }}>
        {TABS.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
            padding: '10px 18px', borderRadius: '10px', border: '1px solid transparent',
            background: activeTab === tab.key ? 'rgba(234,179,8,0.12)' : 'transparent',
            borderColor: activeTab === tab.key ? 'rgba(234,179,8,0.45)' : 'transparent',
            color: activeTab === tab.key ? '#fff' : '#8899aa',
            fontSize: '13px', fontWeight: '600', cursor: 'pointer',
            boxShadow: activeTab === tab.key ? '0 0 12px rgba(234,179,8,0.12)' : 'none',
            transition: 'all 0.25s ease'
          }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── TAB: Overview ─────────────────────────────────────────────────── */}
      {activeTab === 'overview' && (
        <div>
          {/* KPI Cards */}
          <div className="db-stats-grid">
            {stats.map((s, i) => (
              <div className="db-stat-card" key={i} style={{ '--accent': s.color, background: 'rgba(11,19,36,0.5)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="db-stat-top">
                  <span style={{ fontSize: '28px' }}>{s.icon}</span>
                  <span className="db-stat-change" style={{ color: s.color }}>{s.change}</span>
                </div>
                <p className="db-stat-value" style={{ fontSize: '32px', color: '#fff', fontWeight: '800' }}>{s.value}</p>
                <p className="db-stat-label" style={{ color: '#8899aa', fontSize: '14px' }}>{s.label}</p>
                <div className="db-stat-bar"><div className="db-stat-fill" style={{ background: s.color, width: '80%' }} /></div>
              </div>
            ))}
          </div>

          {/* Academia de Inversión */}
          <div style={{ background: 'rgba(11,19,36,0.45)', border: '1px solid rgba(234,179,8,0.15)', boxShadow: '0 0 25px rgba(234,179,8,0.05)', backdropFilter: 'blur(15px)', padding: '28px', borderRadius: '20px', marginTop: '28px', textAlign: 'left' }}>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'inline-block', padding: '6px 12px', fontSize: '11px', fontWeight: '700', color: '#eab308', background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.2)', borderRadius: '50px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>✨ Ecosistema de Startups</div>
              <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#fff', margin: '0 0 12px', letterSpacing: '-0.5px' }}>El Rol del Inversionista en el Ecosistema</h2>
              <p style={{ fontSize: '15px', color: '#a0aec0', lineHeight: '1.6', margin: 0, maxWidth: '900px' }}>
                Un inversionista impulsa el crecimiento de empresas emergentes aportando capital financiero, experiencia estratégica y su red de contactos. Su objetivo es asumir riesgos tempranos a cambio de obtener alta rentabilidad si la empresa se escala.
              </p>
            </div>

            {/* Sub-tabs */}
            <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px', marginBottom: '24px' }}>
              {[{ key: 'functions', label: '⚡ Funciones Principales' }, { key: 'types', label: '💼 Tipos de Inversionistas' }].map(t => (
                <button key={t.key} onClick={() => setActiveGuideTab(t.key)} style={{
                  padding: '10px 20px', borderRadius: '8px', border: '1px solid transparent', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s ease',
                  background: activeGuideTab === t.key ? 'rgba(234,179,8,0.12)' : 'transparent',
                  borderColor: activeGuideTab === t.key ? 'rgba(234,179,8,0.4)' : 'transparent',
                  color: activeGuideTab === t.key ? '#fff' : '#8899aa',
                  boxShadow: activeGuideTab === t.key ? '0 0 12px rgba(234,179,8,0.1)' : 'none'
                }}>{t.label}</button>
              ))}
            </div>

            {/* Functions grid */}
            {activeGuideTab === 'functions' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                {funcionesInversionista.map(f => (
                  <div key={f.key} onClick={() => setActiveFunction(f.key)} style={{
                    background: activeFunction === f.key ? 'rgba(234,179,8,0.03)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${activeFunction === f.key ? 'rgba(234,179,8,0.35)' : 'rgba(255,255,255,0.05)'}`,
                    borderRadius: '16px', padding: '20px', cursor: 'pointer',
                    transform: activeFunction === f.key ? 'translateY(-2px)' : 'none',
                    boxShadow: activeFunction === f.key ? '0 0 20px rgba(234,179,8,0.05)' : 'none',
                    transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)'
                  }}>
                    <div style={{ fontSize: '28px', marginBottom: '16px' }}>{f.icon}</div>
                    <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#fff', margin: '0 0 10px' }}>{f.title}</h4>
                    <p style={{ fontSize: '13px', color: '#8899aa', lineHeight: '1.5', margin: 0 }}>{f.description}</p>
                    {activeFunction === f.key && (
                      <div style={{ marginTop: '16px' }}>
                        <div style={{ height: '1px', background: 'linear-gradient(to right, rgba(234,179,8,0.3), transparent)', marginBottom: '12px' }} />
                        <p style={{ fontSize: '12.5px', color: '#eab308', lineHeight: '1.5', margin: 0, fontWeight: '500' }}>{f.detail}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Types */}
            {activeGuideTab === 'types' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', alignItems: 'start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {tiposInversionistas.map(t => (
                    <button key={t.key} onClick={() => setActiveType(t.key)} style={{
                      padding: '14px 18px', borderRadius: '12px', border: `1px solid ${activeType === t.key ? 'rgba(234,179,8,0.35)' : 'rgba(255,255,255,0.04)'}`,
                      background: activeType === t.key ? 'rgba(234,179,8,0.1)' : 'rgba(255,255,255,0.01)',
                      color: activeType === t.key ? '#fff' : '#8899aa', fontSize: '14px', fontWeight: '600',
                      textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center',
                      boxShadow: activeType === t.key ? '0 0 15px rgba(234,179,8,0.08)' : 'none',
                      transition: 'all 0.3s ease'
                    }}>
                      <span style={{ marginRight: '12px', fontSize: '20px' }}>{t.icon}</span>
                      {t.title.split(' (')[0]}
                    </button>
                  ))}
                </div>
                {selectedType && (
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '24px', minHeight: '220px', boxShadow: 'inset 0 0 20px rgba(255,255,255,0.01)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                      <span style={{ fontSize: '36px', background: 'rgba(234,179,8,0.1)', width: '60px', height: '60px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(234,179,8,0.2)', flexShrink: 0 }}>{selectedType.icon}</span>
                      <div>
                        <span style={{ display: 'inline-block', fontSize: '11px', fontWeight: '700', color: '#eab308', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>{selectedType.badge}</span>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', margin: 0 }}>{selectedType.title}</h3>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px', background: 'rgba(0,0,0,0.15)', padding: '12px 16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.02)' }}>
                      <div><span style={{ fontSize: '11px', color: '#8899aa', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '4px' }}>Origen del Capital</span><span style={{ fontSize: '13px', color: '#fff', fontWeight: '600' }}>{selectedType.focus}</span></div>
                      <div><span style={{ fontSize: '11px', color: '#8899aa', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '4px' }}>Enfoque Clave</span><span style={{ fontSize: '13px', color: '#fff', fontWeight: '600' }}>{selectedType.highlight}</span></div>
                    </div>
                    <p style={{ fontSize: '14px', color: '#cbd5e0', lineHeight: '1.6', margin: 0 }}>{selectedType.description}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Portfolio chart */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginTop: '24px' }}>
            <div style={S.card}>
              <h3 style={S.cardTitle}>📊 Distribución del Portafolio</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '160px', borderBottom: '1px solid rgba(255,255,255,0.08)', gap: '8px', padding: '10px 0' }}>
                {[65, 30, 45, 55, 75, 40].map((h, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: '100%', height: `${h}%`, background: 'linear-gradient(to top, #8b00dd, #eab308)', borderRadius: '6px 6px 0 0', transition: 'height 0.6s ease' }} />
                    <span style={{ fontSize: '10px', color: '#8899aa', marginTop: '6px' }}>Sec {i + 1}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={S.card}>
              <h3 style={S.cardTitle}>💎 Startups de Interés Reciente</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { name: 'TicoDeliveries', desc: 'Software última milla para farmacias', fase: 'Serie A', color: '#eab308' },
                  { name: 'EduCosta', desc: 'Plataforma LMS gamificada para escuelas', fase: 'Pre-Semilla', color: '#b1f500' },
                  { name: 'PuraVida Biotech', desc: 'Tratamiento de aguas residuales', fase: 'Semilla', color: '#00aaff' },
                ].map(s => (
                  <div key={s.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '10px' }}>
                    <div>
                      <p style={{ margin: '0 0 3px', fontSize: '13px', fontWeight: '600', color: '#fff' }}>{s.name}</p>
                      <p style={{ margin: 0, fontSize: '11px', color: '#8899aa' }}>{s.desc}</p>
                    </div>
                    <span style={{ padding: '3px 10px', fontSize: '11px', fontWeight: '700', borderRadius: '50px', background: `${s.color}15`, color: s.color }}>{s.fase}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <ExchangeRatePanel accent="#eab308" secondary="#8b00dd" />
        </div>
      )}

      {/* ── TAB: Demo Day Virtual ──────────────────────────────────────────── */}
      {activeTab === 'demoday' && (
        <div>
          {/* Banner */}
          <div style={{ background: 'linear-gradient(135deg, rgba(139,0,221,0.15), rgba(234,179,8,0.1))', border: '1px solid rgba(139,0,221,0.3)', borderRadius: '20px', padding: '28px 32px', marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
            <div style={{ fontSize: '52px' }}>🎓</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'inline-block', padding: '4px 12px', fontSize: '11px', fontWeight: '700', color: '#eab308', background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.25)', borderRadius: '50px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>🔴 Sala Activa</div>
              <h2 style={{ margin: '0 0 8px', color: '#fff', fontSize: '24px', fontWeight: '800', letterSpacing: '-0.5px' }}>Virtual Demo Day — Generación 2026</h2>
              <p style={{ margin: 0, color: '#a0aec0', fontSize: '14px', lineHeight: '1.5' }}>
                Startups verificadas y respaldadas por aceleradoras del ecosistema. Filtra por sector y solicita reuniones directas con los fundadores.
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: '0 0 4px', fontSize: '32px', fontWeight: '800', color: '#eab308' }}>{startups.length}</p>
              <p style={{ margin: 0, color: '#8899aa', fontSize: '13px' }}>Startups Graduadas</p>
            </div>
          </div>

          {/* Filtro */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: '#8899aa', fontWeight: '600' }}>Filtrar por sector:</span>
            <button onClick={() => setFilterSector('')} style={{ ...S.filterBtn, background: !filterSector ? 'rgba(234,179,8,0.15)' : 'rgba(255,255,255,0.02)', borderColor: !filterSector ? 'rgba(234,179,8,0.4)' : 'rgba(255,255,255,0.06)', color: !filterSector ? '#eab308' : '#8899aa' }}>
              Todos
            </button>
            {sectores.map(sec => (
              <button key={sec.id} onClick={() => setFilterSector(sec.id)} style={{ ...S.filterBtn, background: filterSector == sec.id ? 'rgba(234,179,8,0.15)' : 'rgba(255,255,255,0.02)', borderColor: filterSector == sec.id ? 'rgba(234,179,8,0.4)' : 'rgba(255,255,255,0.06)', color: filterSector == sec.id ? '#eab308' : '#8899aa' }}>
                {sec.nombre}
              </button>
            ))}
            <button onClick={loadStartups} style={{ ...S.filterBtn, marginLeft: 'auto' }}>🔄 Actualizar</button>
          </div>

          {/* Grid de startups */}
          {startups.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px', color: '#4a5568', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: '16px' }}>
              <p style={{ fontSize: '52px' }}>🎓</p>
              <p style={{ fontSize: '16px', marginBottom: '8px' }}>Sin startups graduadas disponibles</p>
              <p style={{ fontSize: '13px' }}>Las startups aparecen aquí cuando son <strong style={{ color: '#b1f500' }}>aceptadas</strong> por una aceleradora en la plataforma.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
              {startups.map(s => (
                <div key={s.id} style={{ background: 'rgba(11,19,36,0.6)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '18px', padding: '22px', transition: 'transform 0.2s ease, box-shadow 0.2s ease', cursor: 'default' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.3)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  {/* Header */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '14px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #8b00dd, #00aaff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0, overflow: 'hidden' }}>
                      {s.logo_url ? <img src={s.logo_url} alt={s.nombre_comercial} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '🚀'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: '0 0 4px', fontWeight: '800', color: '#fff', fontSize: '16px' }}>{s.nombre_comercial}</p>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {s.fase && <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: '700', background: 'rgba(0,170,255,0.12)', color: '#00aaff', textTransform: 'uppercase' }}>{s.fase}</span>}
                        {s.Sector && <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: '700', background: 'rgba(177,245,0,0.1)', color: '#b1f500', textTransform: 'uppercase' }}>{s.Sector.nombre}</span>}
                      </div>
                    </div>
                  </div>

                  {s.descripcion && <p style={{ margin: '0 0 14px', color: '#a0aec0', fontSize: '13px', lineHeight: '1.5' }}>{s.descripcion.length > 100 ? s.descripcion.slice(0, 100) + '...' : s.descripcion}</p>}

                  {/* Badge de respaldo */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'rgba(177,245,0,0.05)', border: '1px solid rgba(177,245,0,0.15)', borderRadius: '8px', marginBottom: '14px' }}>
                    <span style={{ fontSize: '14px' }}>⚡</span>
                    <div>
                      <p style={{ margin: 0, fontSize: '11px', color: '#8899aa' }}>Respaldada por</p>
                      <p style={{ margin: 0, fontSize: '12px', fontWeight: '700', color: '#b1f500' }}>{s.respaldadaPor || 'Aceleradora Verificada'}</p>
                    </div>
                    <span style={{ marginLeft: 'auto', fontSize: '10px', color: '#8899aa' }}>{s.batch || 'Gen. 2026'}</span>
                  </div>

                  {/* Fundador */}
                  {s.User && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', paddingBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#8b00dd', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', flexShrink: 0 }}>
                        {s.User.foto_perfil ? <img src={s.User.foto_perfil} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : '👤'}
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: '12px', fontWeight: '600', color: '#fff' }}>{s.User.nombre}</p>
                        <p style={{ margin: 0, fontSize: '11px', color: '#8899aa' }}>{s.User.email}</p>
                      </div>
                    </div>
                  )}

                  {/* CTA */}
                  <button
                    onClick={() => solicitarReunion(s.id, s.nombre_comercial)}
                    disabled={loadingSol[s.id]}
                    style={{
                      width: '100%', padding: '11px', borderRadius: '10px', border: 'none',
                      background: 'linear-gradient(135deg, #8b00dd 0%, #eab308 100%)',
                      color: '#fff', fontWeight: '700', fontSize: '13px', cursor: 'pointer',
                      boxShadow: '0 4px 15px rgba(139,0,221,0.25)', transition: 'all 0.2s ease',
                      opacity: loadingSol[s.id] ? 0.7 : 1
                    }}
                  >
                    {loadingSol[s.id] ? 'Enviando...' : '💼 Solicitar Reunión con Fundadores'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── TAB: Mis Solicitudes ──────────────────────────────────────────── */}
      {activeTab === 'solicitudes' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, color: '#fff', fontSize: '20px', fontWeight: '700' }}>💌 Mis Solicitudes de Reunión ({solicitudes.length})</h3>
            <button onClick={loadSolicitudes} style={S.filterBtn}>🔄 Actualizar</button>
          </div>

          {solicitudes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px', color: '#4a5568', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: '16px' }}>
              <p style={{ fontSize: '52px' }}>📭</p>
              <p style={{ fontSize: '16px', marginBottom: '8px' }}>Sin solicitudes enviadas</p>
              <p style={{ fontSize: '13px' }}>Ve al Demo Day Virtual y conecta con startups aceleradas.</p>
              <button onClick={() => setActiveTab('demoday')} style={{ ...S.goldBtn, marginTop: '16px', fontSize: '13px', padding: '10px 20px' }}>🎓 Ir al Demo Day</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {solicitudes.map(s => {
                const color = { pendiente: '#eab308', aceptada: '#b1f500', rechazada: '#ef4444' }[s.estado] || '#8899aa';
                return (
                  <div key={s.id} style={{ background: 'rgba(11,19,36,0.5)', border: `1px solid ${color}25`, borderRadius: '16px', padding: '20px 24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'linear-gradient(135deg, #8b00dd, #00aaff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0, overflow: 'hidden' }}>
                          {s.Startup?.logo_url ? <img src={s.Startup.logo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '🚀'}
                        </div>
                        <div>
                          <p style={{ margin: '0 0 4px', fontWeight: '800', color: '#fff', fontSize: '16px' }}>{s.Startup?.nombre_comercial}</p>
                          <p style={{ margin: 0, color: '#8899aa', fontSize: '12px' }}>{s.Startup?.User?.email}</p>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ display: 'inline-block', padding: '5px 14px', borderRadius: '50px', fontSize: '12px', fontWeight: '700', background: `${color}20`, color }}>
                          {s.estado === 'pendiente' ? '⏳ Pendiente' : s.estado === 'aceptada' ? '✅ Aceptada' : '❌ Rechazada'}
                        </span>
                        <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#8899aa' }}>{new Date(s.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    {s.mensaje && (
                      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', padding: '12px 14px' }}>
                        <p style={{ margin: 0, fontSize: '13px', color: '#cbd5e0', lineHeight: '1.5', fontStyle: 'italic' }}>"{s.mensaje}"</p>
                      </div>
                    )}
                    {s.estado === 'aceptada' && (
                      <div style={{ marginTop: '12px', padding: '12px 14px', background: 'rgba(177,245,0,0.06)', border: '1px solid rgba(177,245,0,0.2)', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '20px' }}>🎉</span>
                        <p style={{ margin: 0, fontSize: '13px', color: '#b1f500', fontWeight: '600' }}>¡La startup aceptó tu solicitud! Coordina los detalles de la reunión por mensaje directo.</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ── Estilos ──────────────────────────────────────────────────────────────── */
const S = {
  card: {
    background: 'rgba(11,19,36,0.5)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '16px',
    padding: '22px',
    backdropFilter: 'blur(10px)',
    textAlign: 'left'
  },
  cardTitle: {
    fontSize: '17px', fontWeight: '700', color: '#fff', margin: '0 0 16px'
  },
  goldBtn: {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #8b00dd 0%, #eab308 100%)',
    border: 'none', borderRadius: '10px', color: '#fff',
    fontWeight: '700', fontSize: '14px', cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(139,0,221,0.3)', transition: 'all 0.2s ease'
  },
  filterBtn: {
    padding: '8px 16px',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '8px', color: '#8899aa', fontSize: '12px',
    fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s ease'
  }
};

export default InversorDashboard;
