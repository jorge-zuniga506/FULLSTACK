import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/apiService';
import Swal from 'sweetalert2';
import '../../styles/Dashboard.css';
import ExchangeRatePanel from '../../components/Common/ExchangeRatePanel';

/* ── Tabs ─────────────────────────────────────────────────────────────────── */
const TABS = [
  { key: 'overview',    label: '📊 Mi Panel' },
  { key: 'postular',   label: '🚀 Postular' },
  { key: 'kpis',       label: '📈 Mis KPIs' },
  { key: 'perks',      label: '🎁 Perks' },
  { key: 'mentores',   label: '🧠 Mentorías' },
  { key: 'demoday',    label: '💼 Demo Day' },
];

/* ── Componente Principal ─────────────────────────────────────────────────── */
const StartupDashboard = () => {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Data
  const [dashboardData,    setDashboardData]    = useState(null);
  const [convPublicas,     setConvPublicas]      = useState([]);
  const [misPost,          setMisPost]           = useState([]);
  const [misKpis,          setMisKpis]           = useState([]);
  const [perksDisp,        setPerksDisp]         = useState([]);
  const [mentoresDisp,     setMentoresDisp]      = useState([]);
  const [misReservas,      setMisReservas]       = useState([]);
  const [solicitudesDD,    setSolicitudesDD]     = useState([]);

  // Forms
  const [formPost,  setFormPost]  = useState({ convocatoria_id: '', pitch_deck_url: '', mensaje: '' });
  const [formKpi,   setFormKpi]   = useState({ periodo: '', nuevos_usuarios: '', ventas_mensuales: '', costo_adquisicion: '', notas: '' });
  const [formReserva, setFormReserva] = useState({ mentor_id: '', fecha_hora: '', notas: '' });

  const [loadingPost, setLoadingPost] = useState(false);
  const [loadingKpi,  setLoadingKpi]  = useState(false);

  /* ── Loaders ──────────────────────────────────────────────────────────── */
  const loadDashboard = useCallback(async () => {
    try {
      const r = await apiService.getOne('/api/dashboard/startup', token);
      setDashboardData(r.data || r);
    } catch {}
  }, [token]);

  const loadConvPublicas = useCallback(async () => {
    try {
      const r = await apiService.getOne('/api/convocatorias/publicas', token);
      setConvPublicas(r.data || []);
    } catch {}
  }, [token]);

  const loadMisPostulaciones = useCallback(async () => {
    try {
      const r = await apiService.getOne('/api/convocatorias/mis-postulaciones', token);
      setMisPost(r.data || []);
    } catch {}
  }, [token]);

  const loadMisKpis = useCallback(async () => {
    try {
      const r = await apiService.getOne('/api/kpis/mis-kpis', token);
      setMisKpis(r.data || []);
    } catch {}
  }, [token]);

  const loadPerks = useCallback(async () => {
    try {
      const r = await apiService.getOne('/api/programas/perks/disponibles', token);
      setPerksDisp(r.data || []);
    } catch {}
  }, [token]);

  const loadMentores = useCallback(async () => {
    try {
      const [rM, rR] = await Promise.all([
        apiService.getOne('/api/programas/mentores/disponibles', token),
        apiService.getOne('/api/programas/mentores/mis-reservas', token),
      ]);
      setMentoresDisp(rM.data || []);
      setMisReservas(rR.data || []);
    } catch {}
  }, [token]);

  const loadDemoday = useCallback(async () => {
    try {
      const r = await apiService.getOne('/api/demoday/solicitudes-recibidas', token);
      setSolicitudesDD(r.data || []);
    } catch {}
  }, [token]);

  useEffect(() => {
    if (!token) return;
    loadDashboard();
    if (activeTab === 'postular')  { loadConvPublicas(); loadMisPostulaciones(); }
    if (activeTab === 'kpis')      loadMisKpis();
    if (activeTab === 'perks')     loadPerks();
    if (activeTab === 'mentores')  loadMentores();
    if (activeTab === 'demoday')   loadDemoday();
  }, [activeTab, token]);

  /* ── Acciones ─────────────────────────────────────────────────────────── */
  const postular = async (e) => {
    e.preventDefault();
    if (!formPost.convocatoria_id) return Swal.fire({ icon: 'warning', title: 'Selecciona una convocatoria', background: '#080f1e', color: '#fff' });
    setLoadingPost(true);
    try {
      await apiService.create('/api/convocatorias/postular', formPost, token);
      Swal.fire({ icon: 'success', title: '¡Postulación enviada!', text: 'La aceleradora revisará tu perfil y Pitch Deck.', background: '#080f1e', color: '#fff', confirmButtonColor: '#00aaff' });
      setFormPost({ convocatoria_id: '', pitch_deck_url: '', mensaje: '' });
      loadMisPostulaciones();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.message, background: '#080f1e', color: '#fff' });
    } finally { setLoadingPost(false); }
  };

  const registrarKpi = async (e) => {
    e.preventDefault();
    if (!formKpi.periodo) return Swal.fire({ icon: 'warning', title: 'El período es requerido', text: 'Ej: 2026-01', background: '#080f1e', color: '#fff' });
    setLoadingKpi(true);
    try {
      await apiService.create('/api/kpis', formKpi, token);
      Swal.fire({ icon: 'success', title: '¡KPI registrado!', background: '#080f1e', color: '#fff', confirmButtonColor: '#00aaff' });
      setFormKpi({ periodo: '', nuevos_usuarios: '', ventas_mensuales: '', costo_adquisicion: '', notas: '' });
      loadMisKpis();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.message, background: '#080f1e', color: '#fff' });
    } finally { setLoadingKpi(false); }
  };

  const reclamarPerk = async (perkId) => {
    try {
      await apiService.create('/api/programas/perks/reclamar', { perk_id: perkId }, token);
      Swal.fire({ icon: 'success', title: '¡Beneficio reclamado!', text: 'La aceleradora aprobará tu solicitud.', background: '#080f1e', color: '#fff', confirmButtonColor: '#00aaff' });
      loadPerks();
    } catch (err) {
      Swal.fire({ icon: 'info', title: 'Aviso', text: err.message, background: '#080f1e', color: '#fff' });
    }
  };

  const reservarMentoria = async (e) => {
    e.preventDefault();
    if (!formReserva.mentor_id || !formReserva.fecha_hora) {
      return Swal.fire({ icon: 'warning', title: 'Completa el mentor y la fecha', background: '#080f1e', color: '#fff' });
    }
    try {
      await apiService.create('/api/programas/mentores/reservar', formReserva, token);
      Swal.fire({ icon: 'success', title: '¡Mentoría agendada!', text: 'La aceleradora confirmará tu sesión.', background: '#080f1e', color: '#fff', confirmButtonColor: '#00aaff' });
      setFormReserva({ mentor_id: '', fecha_hora: '', notas: '' });
      loadMentores();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.message, background: '#080f1e', color: '#fff' });
    }
  };

  const responderSolicitud = async (id, estado) => {
    try {
      await apiService.patch('/api/demoday/solicitudes', id, { estado }, token);
      loadDemoday();
      Swal.fire({ icon: 'success', title: estado === 'aceptada' ? '¡Reunión aceptada!' : 'Solicitud rechazada', toast: true, position: 'top-end', showConfirmButton: false, timer: 2000, background: '#080f1e', color: '#fff' });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.message || 'No se pudo actualizar la solicitud.', background: '#080f1e', color: '#fff' });
    }
  };

  /* ── Helpers de color ─────────────────────────────────────────────────── */
  const estadoPostColor = {
    Recibida: '#8899aa', Entrevistada: '#eab308', Aceptada: '#b1f500', Rechazada: '#ef4444'
  };
  const estadoReservaColor = {
    pendiente: '#eab308', confirmada: '#b1f500', cancelada: '#ef4444'
  };

  const accentColors = ['#00aaff', '#8b00dd', '#b1f500', '#eab308'];
  const stats = (dashboardData?.stats || []).map((s, i) => ({ ...s, color: accentColors[i % accentColors.length] }));
  const metrics = dashboardData?.metricsList || [];

  /* ── Render ───────────────────────────────────────────────────────────── */
  return (
    <div style={{ padding: '10px 0' }}>
      {/* Header */}
      <div className="db-header" style={{ marginBottom: '24px' }}>
        <div>
          <h1 className="db-title">Panel de Control: Startup</h1>
          <p className="db-subtitle">Gestiona postulaciones, KPIs, mentorías y beneficios de tu programa</p>
        </div>
        <button style={S.accentBtn} onClick={() => setActiveTab('postular')}>🚀 Postular a Aceleradora</button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', flexWrap: 'wrap', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px' }}>
        {TABS.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
            padding: '10px 18px', borderRadius: '10px', border: '1px solid transparent',
            background: activeTab === tab.key ? 'rgba(0,170,255,0.12)' : 'transparent',
            borderColor: activeTab === tab.key ? 'rgba(0,170,255,0.45)' : 'transparent',
            color: activeTab === tab.key ? '#fff' : '#8899aa',
            fontSize: '13px', fontWeight: '600', cursor: 'pointer',
            boxShadow: activeTab === tab.key ? '0 0 12px rgba(0,170,255,0.15)' : 'none',
            transition: 'all 0.25s ease'
          }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── TAB: Overview ─────────────────────────────────────────────────── */}
      {activeTab === 'overview' && (
        <div>
          <div className="db-stats-grid">
            {stats.map((s, i) => (
              <div className="db-stat-card" key={i} style={{ '--accent': s.color, background: 'rgba(11,19,36,0.5)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="db-stat-top">
                  <span style={{ fontSize: '28px' }}>{s.icon || '🚀'}</span>
                  <span className="db-stat-change" style={{ color: s.color }}>{s.change}</span>
                </div>
                <p className="db-stat-value" style={{ fontSize: '32px', color: '#fff', fontWeight: '800' }}>{s.value}</p>
                <p className="db-stat-label" style={{ color: '#8899aa', fontSize: '14px' }}>{s.label}</p>
                <div className="db-stat-bar"><div className="db-stat-fill" style={{ background: s.color, width: '85%' }} /></div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginTop: '28px' }}>
            {/* Gráfico tracción */}
            <div style={S.card}>
              <h3 style={S.cardTitle}>📈 Tracción Operativa</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '160px', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.08)', gap: '8px' }}>
                {(metrics.length > 0 ? metrics : [{ label: 'Sin datos', value: 30, color: '#8899aa' }]).map((m, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                    <div style={{ width: '100%', height: `${m.value || 30}%`, background: `linear-gradient(to top, #00aaff, ${m.color || '#7c3aed'})`, borderRadius: '6px 6px 0 0', transition: 'height 0.6s ease' }} />
                    <span style={{ fontSize: '10px', color: '#8899aa', marginTop: '6px', textAlign: 'center' }}>{m.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Postulaciones rápidas */}
            <div style={S.card}>
              <h3 style={S.cardTitle}>🏆 Mis Postulaciones Recientes</h3>
              {misPost.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px', color: '#4a5568' }}>
                  <p style={{ fontSize: '32px' }}>📭</p>
                  <p style={{ fontSize: '13px' }}>Aún no has postulado.<br />¡Explora convocatorias abiertas!</p>
                  <button onClick={() => setActiveTab('postular')} style={{ ...S.accentBtn, marginTop: '12px', fontSize: '12px', padding: '8px 16px' }}>Ver Convocatorias</button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {misPost.slice(0, 3).map(p => (
                    <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.04)' }}>
                      <div>
                        <p style={{ margin: '0 0 3px', fontSize: '13px', fontWeight: '700', color: '#fff' }}>{p.Convocatoria?.nombre_batch}</p>
                        <p style={{ margin: 0, fontSize: '11px', color: '#8899aa' }}>{p.Convocatoria?.Aceleradora?.nombre}</p>
                      </div>
                      <span style={{ padding: '3px 10px', borderRadius: '50px', fontSize: '11px', fontWeight: '700', background: `${estadoPostColor[p.estado] || '#8899aa'}20`, color: estadoPostColor[p.estado] || '#8899aa' }}>
                        {p.estado}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Accesos rápidos */}
          <div style={{ marginTop: '24px', background: 'rgba(0,170,255,0.05)', border: '1px solid rgba(0,170,255,0.15)', borderRadius: '16px', padding: '20px' }}>
            <h3 style={{ color: '#fff', margin: '0 0 14px', fontSize: '16px', fontWeight: '700' }}>⚡ Acciones Rápidas</h3>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {[
                { label: '🚀 Postular', tab: 'postular' },
                { label: '📈 Registrar KPI', tab: 'kpis' },
                { label: '🎁 Ver Perks', tab: 'perks' },
                { label: '🧠 Agendar Mentoría', tab: 'mentores' },
                { label: '💼 Demo Day', tab: 'demoday' },
              ].map(a => (
                <button key={a.tab} onClick={() => setActiveTab(a.tab)} style={{ padding: '9px 16px', background: 'rgba(0,170,255,0.1)', border: '1px solid rgba(0,170,255,0.25)', borderRadius: '8px', color: '#fff', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>{a.label}</button>
              ))}
            </div>
          </div>
          <ExchangeRatePanel accent="#00aaff" secondary="#7c3aed" />
        </div>
      )}

      {/* ── TAB: Postular ─────────────────────────────────────────────────── */}
      {activeTab === 'postular' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '24px' }}>
          {/* Formulario */}
          <div style={S.card}>
            <h3 style={S.cardTitle}>🚀 Postular a Convocatoria</h3>
            <form onSubmit={postular} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={S.label}>Convocatoria *</label>
                <select value={formPost.convocatoria_id} onChange={e => setFormPost(f => ({ ...f, convocatoria_id: e.target.value }))} style={S.select}>
                  <option value="">— Selecciona una convocatoria —</option>
                  {convPublicas.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.nombre_batch} — {c.Aceleradora?.nombre || 'Aceleradora'}{c.fecha_cierre ? ` (cierra ${c.fecha_cierre})` : ''}
                    </option>
                  ))}
                </select>
                {convPublicas.length === 0 && (
                  <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#eab308' }}>⚠️ No hay convocatorias abiertas actualmente.</p>
                )}
              </div>
              <InputF label="URL del Pitch Deck" value={formPost.pitch_deck_url} onChange={v => setFormPost(f => ({ ...f, pitch_deck_url: v }))} placeholder="https://drive.google.com/..." />
              <InputF label="Mensaje para la Aceleradora" value={formPost.mensaje} onChange={v => setFormPost(f => ({ ...f, mensaje: v }))} multiline placeholder="Cuéntales por qué son la startup ideal para su programa..." />
              <button type="submit" disabled={loadingPost} style={S.accentBtn}>
                {loadingPost ? 'Enviando...' : '📤 Enviar Postulación'}
              </button>
            </form>
          </div>

          {/* Mis postulaciones */}
          <div style={S.card}>
            <h3 style={S.cardTitle}>Mis Postulaciones ({misPost.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '500px', overflowY: 'auto' }}>
              {misPost.length === 0 && <p style={{ color: '#4a5568', textAlign: 'center', padding: '40px', fontSize: '13px' }}>Todavía no has postulado a ninguna convocatoria.</p>}
              {misPost.map(p => {
                const color = estadoPostColor[p.estado] || '#8899aa';
                return (
                  <div key={p.id} style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${color}25`, borderRadius: '12px', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div>
                        <p style={{ margin: '0 0 3px', fontWeight: '700', color: '#fff', fontSize: '14px' }}>{p.Convocatoria?.nombre_batch}</p>
                        <p style={{ margin: 0, color: '#8899aa', fontSize: '12px' }}>{p.Convocatoria?.Aceleradora?.nombre}</p>
                      </div>
                      <span style={{ padding: '4px 12px', borderRadius: '50px', fontSize: '11px', fontWeight: '700', background: `${color}20`, color }}>
                        {p.estado}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px' }}>
                        <div style={{ height: '100%', borderRadius: '4px', background: color, width: { Recibida: '25%', Entrevistada: '60%', Aceptada: '100%', Rechazada: '100%' }[p.estado] || '25%', transition: 'width 0.6s ease' }} />
                      </div>
                      <span style={{ fontSize: '11px', color: '#8899aa', whiteSpace: 'nowrap' }}>
                        {new Date(p.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {p.pitch_deck_url && (
                      <a href={p.pitch_deck_url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: '8px', fontSize: '12px', color: '#00aaff', textDecoration: 'none' }}>📄 Mi Pitch Deck</a>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: KPIs ─────────────────────────────────────────────────────── */}
      {activeTab === 'kpis' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '24px' }}>
          {/* Form */}
          <div style={S.card}>
            <h3 style={S.cardTitle}>📈 Registrar KPI</h3>
            <p style={{ margin: '0 0 18px', fontSize: '13px', color: '#8899aa', lineHeight: '1.5' }}>
              Reporta tus métricas de crecimiento para que tu aceleradora realice seguimiento en tiempo real.
            </p>
            <form onSubmit={registrarKpi} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <InputF label="Período *" value={formKpi.periodo} onChange={v => setFormKpi(f => ({ ...f, periodo: v }))} placeholder="ej. 2026-05 (Año-Mes)" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <InputF label="👥 Nuevos Usuarios" value={formKpi.nuevos_usuarios} onChange={v => setFormKpi(f => ({ ...f, nuevos_usuarios: v }))} type="number" placeholder="0" />
                <InputF label="💰 Ventas ($)" value={formKpi.ventas_mensuales} onChange={v => setFormKpi(f => ({ ...f, ventas_mensuales: v }))} type="number" placeholder="0.00" />
              </div>
              <InputF label="🎯 Costo de Adquisición ($)" value={formKpi.costo_adquisicion} onChange={v => setFormKpi(f => ({ ...f, costo_adquisicion: v }))} type="number" placeholder="0.00" />
              <InputF label="Notas" value={formKpi.notas} onChange={v => setFormKpi(f => ({ ...f, notas: v }))} multiline placeholder="Observaciones del período..." />
              <button type="submit" disabled={loadingKpi} style={S.accentBtn}>
                {loadingKpi ? 'Guardando...' : '💾 Registrar KPI'}
              </button>
            </form>
          </div>

          {/* Historial */}
          <div style={S.card}>
            <h3 style={S.cardTitle}>Historial de KPIs ({misKpis.length})</h3>
            {misKpis.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', color: '#4a5568' }}>
                <p style={{ fontSize: '42px' }}>📉</p>
                <p>Aún no has registrado métricas. ¡Empieza ahora!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '480px', overflowY: 'auto' }}>
                {misKpis.map((k, i) => (
                  <div key={k.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>📅 {k.periodo}</span>
                      <span style={{ fontSize: '11px', color: '#8899aa' }}>{new Date(k.created_at).toLocaleDateString()}</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                      {[
                        { icon: '👥', label: 'Usuarios', value: k.nuevos_usuarios, color: '#00aaff' },
                        { icon: '💰', label: 'Ventas', value: `$${Number(k.ventas_mensuales).toLocaleString()}`, color: '#b1f500' },
                        { icon: '🎯', label: 'CAC', value: `$${Number(k.costo_adquisicion).toLocaleString()}`, color: '#eab308' },
                      ].map(m => (
                        <div key={m.label} style={{ background: `${m.color}08`, border: `1px solid ${m.color}20`, borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
                          <p style={{ margin: '0 0 2px', fontSize: '18px' }}>{m.icon}</p>
                          <p style={{ margin: '0 0 2px', fontSize: '16px', fontWeight: '700', color: m.color }}>{m.value}</p>
                          <p style={{ margin: 0, fontSize: '10px', color: '#8899aa', textTransform: 'uppercase' }}>{m.label}</p>
                        </div>
                      ))}
                    </div>
                    {k.notas && <p style={{ margin: '10px 0 0', fontSize: '12px', color: '#8899aa', fontStyle: 'italic', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '8px' }}>{k.notas}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB: Perks ────────────────────────────────────────────────────── */}
      {activeTab === 'perks' && (
        <div>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#fff', margin: '0 0 6px', fontSize: '20px', fontWeight: '700' }}>🎁 Beneficios del Programa</h3>
            <p style={{ margin: 0, color: '#8899aa', fontSize: '14px' }}>Estos beneficios están disponibles para ti como startup aceptada en el programa.</p>
          </div>
          {perksDisp.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px', color: '#4a5568' }}>
              <p style={{ fontSize: '52px' }}>🎁</p>
              <p style={{ fontSize: '16px', marginBottom: '8px' }}>Sin perks disponibles</p>
              <p style={{ fontSize: '13px' }}>Los perks aparecen aquí cuando eres <strong style={{ color: '#b1f500' }}>aceptada</strong> en el programa de una aceleradora.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '18px' }}>
              {perksDisp.map(p => {
                const tipoIcon = { credito_cloud: '☁️', espacio_trabajo: '🏢', beneficio_comercial: '🤝', otro: '🎁' }[p.tipo] || '🎁';
                const tipoColor = { credito_cloud: '#00aaff', espacio_trabajo: '#8b00dd', beneficio_comercial: '#eab308', otro: '#b1f500' }[p.tipo] || '#b1f500';
                const reclamado = p.reclamacion_estado;
                return (
                  <div key={p.id} style={{ background: 'rgba(11,19,36,0.6)', border: `1px solid ${tipoColor}25`, borderRadius: '16px', padding: '20px', transition: 'transform 0.2s ease', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '28px', background: `${tipoColor}15`, padding: '10px', borderRadius: '10px', border: `1px solid ${tipoColor}25` }}>{tipoIcon}</span>
                      <div>
                        <p style={{ margin: '0 0 2px', fontWeight: '700', color: '#fff', fontSize: '15px' }}>{p.titulo}</p>
                        <p style={{ margin: 0, color: tipoColor, fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{p.tipo.replace('_', ' ')}</p>
                      </div>
                    </div>
                    {p.descripcion && <p style={{ margin: 0, color: '#a0aec0', fontSize: '13px', lineHeight: '1.5' }}>{p.descripcion}</p>}
                    {p.valor && <p style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: tipoColor }}>💎 {p.valor}</p>}
                    <p style={{ margin: 0, fontSize: '12px', color: '#8899aa' }}>por {p.Aceleradora?.nombre}</p>
                    {reclamado ? (
                      <div style={{ padding: '10px', borderRadius: '8px', background: `${reclamado === 'aprobada' ? '#b1f500' : reclamado === 'rechazada' ? '#ef4444' : '#eab308'}15`, border: `1px solid ${reclamado === 'aprobada' ? '#b1f500' : reclamado === 'rechazada' ? '#ef4444' : '#eab308'}30`, textAlign: 'center' }}>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: reclamado === 'aprobada' ? '#b1f500' : reclamado === 'rechazada' ? '#ef4444' : '#eab308' }}>
                          {reclamado === 'aprobada' ? '✅ Aprobado' : reclamado === 'rechazada' ? '❌ Rechazado' : '⏳ Pendiente de aprobación'}
                        </span>
                      </div>
                    ) : (
                      <button onClick={() => reclamarPerk(p.id)} style={{ padding: '10px', background: `linear-gradient(135deg, ${tipoColor}40, ${tipoColor}20)`, border: `1px solid ${tipoColor}40`, borderRadius: '8px', color: '#fff', fontWeight: '700', fontSize: '13px', cursor: 'pointer', marginTop: 'auto' }}>
                        Reclamar Beneficio →
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── TAB: Mentorías ────────────────────────────────────────────────── */}
      {activeTab === 'mentores' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '24px' }}>
          {/* Reservar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={S.card}>
              <h3 style={S.cardTitle}>🗓️ Agendar Sesión</h3>
              <form onSubmit={reservarMentoria} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={S.label}>Mentor *</label>
                  <select value={formReserva.mentor_id} onChange={e => setFormReserva(f => ({ ...f, mentor_id: e.target.value }))} style={S.select}>
                    <option value="">— Selecciona un mentor —</option>
                    {mentoresDisp.map(m => (
                      <option key={m.id} value={m.id}>{m.nombre} — {m.especialidad}</option>
                    ))}
                  </select>
                  {mentoresDisp.length === 0 && <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#eab308' }}>⚠️ Sin mentores disponibles. Necesitas ser aceptada en un programa.</p>}
                </div>
                <InputF label="Fecha y Hora *" value={formReserva.fecha_hora} onChange={v => setFormReserva(f => ({ ...f, fecha_hora: v }))} type="datetime-local" />
                <InputF label="Tema / Notas" value={formReserva.notas} onChange={v => setFormReserva(f => ({ ...f, notas: v }))} multiline placeholder="¿Qué quieres abordar en la sesión?" />
                <button type="submit" style={S.accentBtn}>🧠 Confirmar Sesión</button>
              </form>
            </div>

            {/* Directorio de mentores */}
            <div style={S.card}>
              <h3 style={S.cardTitle}>Mentores Disponibles</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '280px', overflowY: 'auto' }}>
                {mentoresDisp.map(m => (
                  <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, #8b00dd, #00aaff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>
                      {m.foto_url ? <img src={m.foto_url} alt={m.nombre} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : '🧠'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: '0 0 2px', fontWeight: '700', color: '#fff', fontSize: '13px' }}>{m.nombre}</p>
                      <p style={{ margin: 0, color: '#8b00dd', fontSize: '11px' }}>{m.especialidad || '—'}</p>
                    </div>
                    {m.linkedin_url && (
                      <a href={m.linkedin_url} target="_blank" rel="noopener noreferrer" style={{ color: '#00aaff', fontSize: '18px', textDecoration: 'none' }}>in</a>
                    )}
                  </div>
                ))}
                {mentoresDisp.length === 0 && <p style={{ color: '#4a5568', textAlign: 'center', padding: '20px', fontSize: '13px' }}>Sin mentores</p>}
              </div>
            </div>
          </div>

          {/* Mis reservas */}
          <div style={S.card}>
            <h3 style={S.cardTitle}>Mis Sesiones Agendadas ({misReservas.length})</h3>
            {misReservas.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', color: '#4a5568' }}>
                <p style={{ fontSize: '42px' }}>📅</p>
                <p>Aún no has agendado ninguna mentoría.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '540px', overflowY: 'auto' }}>
                {misReservas.map(r => {
                  const color = estadoReservaColor[r.estado] || '#8899aa';
                  return (
                    <div key={r.id} style={{ background: `${color}06`, border: `1px solid ${color}25`, borderRadius: '12px', padding: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                        <div>
                          <p style={{ margin: '0 0 3px', fontWeight: '700', color: '#fff', fontSize: '15px' }}>🧠 {r.Mentor?.nombre}</p>
                          <p style={{ margin: 0, color: '#8b00dd', fontSize: '12px' }}>{r.Mentor?.especialidad}</p>
                        </div>
                        <span style={{ padding: '4px 12px', borderRadius: '50px', fontSize: '11px', fontWeight: '700', background: `${color}20`, color }}>
                          {r.estado}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#8899aa', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <span>📅 {r.fecha_hora ? new Date(r.fecha_hora).toLocaleString() : 'Fecha pendiente'}</span>
                      </div>
                      {r.notas && <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#a0aec0', fontStyle: 'italic' }}>{r.notas}</p>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB: Demo Day ─────────────────────────────────────────────────── */}
      {activeTab === 'demoday' && (
        <div>
          <div style={{ marginBottom: '24px', background: 'linear-gradient(135deg, rgba(0,170,255,0.08), rgba(139,0,221,0.08))', border: '1px solid rgba(0,170,255,0.2)', borderRadius: '16px', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '40px' }}>🎓</span>
            <div>
              <h3 style={{ margin: '0 0 4px', color: '#fff', fontSize: '18px', fontWeight: '700' }}>Virtual Demo Day</h3>
              <p style={{ margin: 0, color: '#8899aa', fontSize: '13px' }}>Los inversores pueden solicitar reuniones directamente contigo. Acepta o rechaza sus solicitudes aquí.</p>
            </div>
          </div>

          <h3 style={{ color: '#fff', fontSize: '17px', margin: '0 0 16px', fontWeight: '700' }}>
            💼 Solicitudes de Inversores ({solicitudesDD.length})
          </h3>

          {solicitudesDD.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px', color: '#4a5568', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: '16px' }}>
              <p style={{ fontSize: '52px' }}>💌</p>
              <p style={{ fontSize: '16px', marginBottom: '8px' }}>Sin solicitudes aún</p>
              <p style={{ fontSize: '13px' }}>Cuando seas aceptada en un programa, los inversores podrán ver tu perfil y solicitarte una reunión.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {solicitudesDD.map(s => {
                const color = { pendiente: '#eab308', aceptada: '#b1f500', rechazada: '#ef4444' }[s.estado] || '#8899aa';
                return (
                  <div key={s.id} style={{ background: 'rgba(11,19,36,0.5)', border: `1px solid ${color}25`, borderRadius: '14px', padding: '18px 20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '46px', height: '46px', borderRadius: '50%', background: 'linear-gradient(135deg, #eab308, #8b00dd)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                          {s.Inversor?.User?.foto_perfil ? <img src={s.Inversor.User.foto_perfil} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : '💼'}
                        </div>
                        <div>
                          <p style={{ margin: '0 0 2px', fontWeight: '700', color: '#fff', fontSize: '15px' }}>{s.Inversor?.User?.nombre || 'Inversor'}</p>
                          <p style={{ margin: 0, color: '#8899aa', fontSize: '12px' }}>{s.Inversor?.User?.email}</p>
                        </div>
                      </div>
                      <span style={{ padding: '5px 14px', borderRadius: '50px', fontSize: '12px', fontWeight: '700', background: `${color}20`, color }}>
                        {s.estado}
                      </span>
                    </div>
                    {s.mensaje && (
                      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '12px 14px', marginBottom: '12px' }}>
                        <p style={{ margin: 0, fontSize: '13px', color: '#cbd5e0', lineHeight: '1.5', fontStyle: 'italic' }}>"{s.mensaje}"</p>
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '11px', color: '#8899aa' }}>{new Date(s.created_at).toLocaleDateString()}</span>
                      {s.estado === 'pendiente' && (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => responderSolicitud(s.id, 'aceptada')} style={{ padding: '8px 16px', background: 'rgba(177,245,0,0.12)', border: '1px solid rgba(177,245,0,0.35)', borderRadius: '8px', color: '#b1f500', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}>
                            ✅ Aceptar Reunión
                          </button>
                          <button onClick={() => responderSolicitud(s.id, 'rechazada')} style={{ padding: '8px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', color: '#ef4444', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}>
                            ✗ Rechazar
                          </button>
                        </div>
                      )}
                    </div>
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

/* ── Input helper ─────────────────────────────────────────────────────────── */
const InputF = ({ label, value, onChange, placeholder, multiline, type = 'text' }) => (
  <div>
    <label style={S.label}>{label}</label>
    {multiline ? (
      <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} style={{ ...S.input, resize: 'vertical', height: 'auto' }} />
    ) : (
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={S.input} />
    )}
  </div>
);

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
  label: {
    display: 'block', fontSize: '12px', fontWeight: '600', color: '#8899aa',
    textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px'
  },
  input: {
    width: '100%', padding: '10px 14px',
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px', color: '#fff', fontSize: '13px', outline: 'none',
    boxSizing: 'border-box', fontFamily: 'inherit'
  },
  select: {
    width: '100%', padding: '10px 14px',
    background: 'rgba(11,19,36,0.8)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px', color: '#fff', fontSize: '13px', outline: 'none', cursor: 'pointer'
  },
  accentBtn: {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #00aaff 0%, #7c3aed 100%)',
    border: 'none', borderRadius: '10px', color: '#fff',
    fontWeight: '700', fontSize: '14px', cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(0,170,255,0.25)', transition: 'all 0.2s ease'
  }
};

export default StartupDashboard;
