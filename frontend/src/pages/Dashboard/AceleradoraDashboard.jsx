import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/apiService';
import Swal from 'sweetalert2';
import '../../styles/Dashboard.css';
import ExchangeRatePanel from '../../components/Common/ExchangeRatePanel';

/* ── Sub-componente: Columna Kanban ───────────────────────────────────────── */
const KanbanColumn = ({ title, color, items, onMover, convId }) => (
  <div style={{
    background: 'rgba(255,255,255,0.02)',
    border: `1px solid ${color}30`,
    borderRadius: '14px',
    padding: '16px',
    minWidth: '220px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: color }} />
      <span style={{ fontSize: '12px', fontWeight: '700', color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</span>
      <span style={{ marginLeft: 'auto', background: `${color}20`, color, padding: '2px 8px', borderRadius: '50px', fontSize: '11px', fontWeight: '700' }}>{items.length}</span>
    </div>
    {items.map(p => (
      <div key={p.id} style={{
        background: 'rgba(11,19,36,0.7)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '10px',
        padding: '12px',
        transition: 'all 0.2s ease'
      }}>
        <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: '700', color: '#fff' }}>
          {p.Startup?.nombre_comercial || 'Startup'}
        </p>
        <p style={{ margin: '0 0 10px', fontSize: '11px', color: '#8899aa' }}>
          {p.Startup?.User?.nombre || p.Startup?.User?.email || ''}
        </p>
        {p.pitch_deck_url && (
          <a href={p.pitch_deck_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '11px', color: '#8b00dd', textDecoration: 'none' }}>
            📄 Ver Pitch Deck
          </a>
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '10px' }}>
          {['Recibida', 'Entrevistada', 'Aceptada', 'Rechazada']
            .filter(e => e !== p.estado)
            .map(e => (
              <button key={e} onClick={() => onMover(p.id, e, convId)} style={{
                fontSize: '10px', padding: '3px 8px', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '6px', background: 'transparent', color: '#a0aec0', cursor: 'pointer'
              }}>→ {e}</button>
            ))
          }
        </div>
      </div>
    ))}
    {items.length === 0 && (
      <div style={{ textAlign: 'center', padding: '20px', color: '#4a5568', fontSize: '12px', border: '1px dashed rgba(255,255,255,0.06)', borderRadius: '8px' }}>
        Sin postulaciones
      </div>
    )}
  </div>
);

/* ── Tabs ─────────────────────────────────────────────────────────────────── */
const TABS = [
  { key: 'overview', label: '📊 Panel', icon: '📊' },
  { key: 'convocatorias', label: '📋 Convocatorias', icon: '📋' },
  { key: 'kanban', label: '🗂️ Kanban', icon: '🗂️' },
  { key: 'kpis', label: '📈 KPIs Cohorte', icon: '📈' },
  { key: 'perks', label: '🎁 Perks', icon: '🎁' },
  { key: 'mentores', label: '🧠 Mentores', icon: '🧠' },
];

/* ── Componente Principal ─────────────────────────────────────────────────── */
const AceleradoraDashboard = () => {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  // Data
  const [convocatorias, setConvocatorias] = useState([]);
  const [postulaciones, setPostulaciones] = useState([]);
  const [kpisCohorte, setKpisCohorte] = useState([]);
  const [perks, setPerks] = useState([]);
  const [mentores, setMentores] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [reclamaciones, setReclamaciones] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);

  // Forms
  const [formConv, setFormConv] = useState({ nombre_batch: '', descripcion: '', requisitos: '', fecha_inicio: '', fecha_cierre: '', estado: 'borrador' });
  const [formPerk, setFormPerk] = useState({ titulo: '', descripcion: '', tipo: 'otro', valor: '' });
  const [formMentor, setFormMentor] = useState({ nombre: '', especialidad: '', linkedin_url: '', foto_url: '' });

  const asArray = (value) => (Array.isArray(value) ? value : []);
  const getErrorMessage = (error, fallback) => error?.message || fallback;

  /* ── Loaders ──────────────────────────────────────────────────────────── */
  const loadConvocatorias = useCallback(async () => {
    try {
      const r = await apiService.getOne('/api/convocatorias/mis-convocatorias', token);
      setConvocatorias(asArray(r.data));
      setApiError('');
    } catch (error) {
      setConvocatorias([]);
      setApiError(getErrorMessage(error, 'No se pudieron cargar las convocatorias.'));
    }
  }, [token]);

  const loadPostulaciones = useCallback(async (convId) => {
    try {
      const r = await apiService.getAll('/api/convocatorias/postulaciones', convId ? { convocatoria_id: convId } : {}, token);
      setPostulaciones(asArray(r.data));
      setApiError('');
    } catch (error) {
      setPostulaciones([]);
      setApiError(getErrorMessage(error, 'No se pudieron cargar las postulaciones.'));
    }
  }, [token]);

  const loadKpis = useCallback(async () => {
    try {
      const r = await apiService.getOne('/api/kpis/cohorte', token);
      setKpisCohorte(asArray(r.data));
      setApiError('');
    } catch (error) {
      setKpisCohorte([]);
      setApiError(getErrorMessage(error, 'No se pudieron cargar los KPIs de cohorte.'));
    }
  }, [token]);

  const loadPerks = useCallback(async () => {
    try {
      const [rPerks, rRec] = await Promise.all([
        apiService.getOne('/api/programas/perks/mis-perks', token),
        apiService.getOne('/api/programas/perks/reclamaciones', token)
      ]);
      setPerks(asArray(rPerks.data));
      setReclamaciones(asArray(rRec.data));
      setApiError('');
    } catch (error) {
      setPerks([]);
      setReclamaciones([]);
      setApiError(getErrorMessage(error, 'No se pudo cargar la gestion de perks.'));
    }
  }, [token]);

  const loadMentores = useCallback(async () => {
    try {
      const [rMent, rRes] = await Promise.all([
        apiService.getOne('/api/programas/mentores/mis-mentores', token),
        apiService.getOne('/api/programas/mentores/reservas', token)
      ]);
      setMentores(asArray(rMent.data));
      setReservas(asArray(rRes.data));
      setApiError('');
    } catch (error) {
      setMentores([]);
      setReservas([]);
      setApiError(getErrorMessage(error, 'No se pudo cargar la gestion de mentores.'));
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;
    if (activeTab === 'convocatorias') loadConvocatorias();
    if (activeTab === 'kanban') { loadConvocatorias(); loadPostulaciones(selectedConv); }
    if (activeTab === 'kpis') loadKpis();
    if (activeTab === 'perks') loadPerks();
    if (activeTab === 'mentores') loadMentores();
  }, [activeTab, token, selectedConv, loadConvocatorias, loadKpis, loadMentores, loadPerks, loadPostulaciones]);

  /* ── Acciones ─────────────────────────────────────────────────────────── */
  const crearConvocatoria = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiService.create('/api/convocatorias', formConv, token);
      Swal.fire({ icon: 'success', title: '¡Convocatoria creada!', background: '#080f1e', color: '#fff', confirmButtonColor: '#8b00dd' });
      setFormConv({ nombre_batch: '', descripcion: '', requisitos: '', fecha_inicio: '', fecha_cierre: '', estado: 'borrador' });
      loadConvocatorias();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.message, background: '#080f1e', color: '#fff' });
    } finally { setLoading(false); }
  };


  const moverKanban = async (postId, nuevoEstado) => {
    try {
      await apiService.patch('/api/convocatorias/postulaciones', postId, { estado: nuevoEstado }, token);
      setApiError('');
      loadPostulaciones(selectedConv);
      Swal.fire({ icon: 'success', title: `Movido a ${nuevoEstado}`, toast: true, position: 'top-end', showConfirmButton: false, timer: 2000, background: '#080f1e', color: '#fff' });
    } catch (error) {
      setApiError(getErrorMessage(error, 'No se pudo mover la postulacion en el Kanban.'));
      Swal.fire({ icon: 'error', title: 'Error', text: getErrorMessage(error, 'No se pudo mover la postulacion.'), background: '#080f1e', color: '#fff' });
    }
  };

  const publicarConvocatoria = async (id, estadoActual) => {
    const nuevoEstado = estadoActual === 'abierta' ? 'cerrada' : 'abierta';
    try {
      await apiService.update('/api/convocatorias', id, { estado: nuevoEstado }, token);
      setApiError('');
      loadConvocatorias();
      Swal.fire({ icon: 'success', title: nuevoEstado === 'abierta' ? 'Convocatoria publicada' : 'Convocatoria cerrada', toast: true, position: 'top-end', showConfirmButton: false, timer: 2000, background: '#080f1e', color: '#fff' });
    } catch (error) {
      setApiError(getErrorMessage(error, 'No se pudo actualizar la convocatoria.'));
      Swal.fire({ icon: 'error', title: 'Error', text: getErrorMessage(error, 'No se pudo actualizar la convocatoria.'), background: '#080f1e', color: '#fff' });
    }
  };

  const crearPerk = async (e) => {
    e.preventDefault();
    try {
      await apiService.create('/api/programas/perks', formPerk, token);
      Swal.fire({ icon: 'success', title: '¡Perk creado!', toast: true, position: 'top-end', showConfirmButton: false, timer: 2000, background: '#080f1e', color: '#fff' });
      setFormPerk({ titulo: '', descripcion: '', tipo: 'otro', valor: '' });
      loadPerks();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.message, background: '#080f1e', color: '#fff' });
    }
  };

  const crearMentor = async (e) => {
    e.preventDefault();
    try {
      await apiService.create('/api/programas/mentores', formMentor, token);
      Swal.fire({ icon: 'success', title: '¡Mentor agregado!', toast: true, position: 'top-end', showConfirmButton: false, timer: 2000, background: '#080f1e', color: '#fff' });
      setFormMentor({ nombre: '', especialidad: '', linkedin_url: '', foto_url: '' });
      loadMentores();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.message, background: '#080f1e', color: '#fff' });
    }
  };

  const gestionarReserva = async (id, estado) => {
    try {
      await apiService.patch('/api/programas/mentores/reservas', id, { estado }, token);
      setApiError('');
      loadMentores();
    } catch (error) {
      setApiError(getErrorMessage(error, 'No se pudo actualizar la reserva.'));
      Swal.fire({ icon: 'error', title: 'Error', text: getErrorMessage(error, 'No se pudo actualizar la reserva.'), background: '#080f1e', color: '#fff' });
    }
  };

  const gestionarReclamacion = async (id, estado) => {
    try {
      await apiService.patch('/api/programas/perks/reclamaciones', id, { estado }, token);
      setApiError('');
      loadPerks();
    } catch (error) {
      setApiError(getErrorMessage(error, 'No se pudo actualizar la reclamacion.'));
      Swal.fire({ icon: 'error', title: 'Error', text: getErrorMessage(error, 'No se pudo actualizar la reclamacion.'), background: '#080f1e', color: '#fff' });
    }
  };

  /* ── Kanban groups ─────────────────────────────────────────────────────── */
  const kanbanGroups = {
    Recibida: postulaciones.filter(p => p.estado === 'Recibida'),
    Entrevistada: postulaciones.filter(p => p.estado === 'Entrevistada'),
    Aceptada: postulaciones.filter(p => p.estado === 'Aceptada'),
    Rechazada: postulaciones.filter(p => p.estado === 'Rechazada'),
  };

  /* ── Render ───────────────────────────────────────────────────────────── */
  return (
    <div style={{ padding: '10px 0' }}>
      {/* Header */}
      <div className="db-header" style={{ marginBottom: '24px' }}>
        <div>
          <h1 className="db-title">Panel de Control: Aceleradora</h1>
          <p className="db-subtitle">Gestiona convocatorias, cohortes, KPIs, perks y mentorías</p>
        </div>
      </div>

      {apiError && (
        <div style={{ marginBottom: '16px', padding: '12px 14px', borderRadius: '10px', color: '#fecaca', background: 'rgba(127,29,29,0.35)', border: '1px solid rgba(239,68,68,0.45)' }}>
          {apiError}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', flexWrap: 'wrap', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px' }}>
        {TABS.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
            padding: '10px 18px', borderRadius: '10px', border: '1px solid transparent',
            background: activeTab === tab.key ? 'rgba(139,0,221,0.15)' : 'transparent',
            borderColor: activeTab === tab.key ? 'rgba(139,0,221,0.5)' : 'transparent',
            color: activeTab === tab.key ? '#fff' : '#8899aa',
            fontSize: '13px', fontWeight: '600', cursor: 'pointer',
            boxShadow: activeTab === tab.key ? '0 0 12px rgba(139,0,221,0.2)' : 'none',
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
            {[
              { label: 'Startups Aceleradas', value: '28', change: '+4 esta cohorte', icon: '⚡', color: '#059669' },
              { label: 'Mentores Activos', value: mentores.length || '—', change: 'Especialistas', icon: '🧠', color: '#8b00dd' },
              { label: 'Convocatorias', value: convocatorias.length || '—', change: 'Totales', icon: '📋', color: '#00aaff' },
              { label: 'KPIs Registrados', value: kpisCohorte.length || '—', change: 'En cohorte', icon: '📈', color: '#b1f500' }
            ].map((s, i) => (
              <div className="db-stat-card" key={i} style={{ '--accent': s.color, background: 'rgba(11,19,36,0.5)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="db-stat-top">
                  <span style={{ fontSize: '28px' }}>{s.icon}</span>
                  <span className="db-stat-change" style={{ color: s.color }}>{s.change}</span>
                </div>
                <p className="db-stat-value" style={{ fontSize: '32px', color: '#fff', fontWeight: '800' }}>{s.value}</p>
                <p className="db-stat-label" style={{ color: '#8899aa', fontSize: '14px' }}>{s.label}</p>
                <div className="db-stat-bar"><div className="db-stat-fill" style={{ background: s.color, width: '65%' }} /></div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '28px', background: 'rgba(139,0,221,0.06)', border: '1px solid rgba(139,0,221,0.2)', borderRadius: '16px', padding: '24px' }}>
            <h3 style={{ color: '#fff', margin: '0 0 16px', fontSize: '18px', fontWeight: '700' }}>🚀 Acciones Rápidas</h3>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {[
                { label: '+ Nueva Convocatoria', tab: 'convocatorias' },
                { label: '🗂️ Ver Kanban', tab: 'kanban' },
                { label: '📈 Ver KPIs', tab: 'kpis' },
                { label: '🎁 Gestionar Perks', tab: 'perks' },
                { label: '🧠 Agregar Mentor', tab: 'mentores' },
              ].map(a => (
                <button key={a.tab} onClick={() => setActiveTab(a.tab)} style={{
                  padding: '10px 20px', background: 'rgba(139,0,221,0.15)', border: '1px solid rgba(139,0,221,0.35)',
                  borderRadius: '10px', color: '#fff', fontWeight: '600', fontSize: '13px', cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}>{a.label}</button>
              ))}
            </div>
          </div>
          <ExchangeRatePanel accent="#8b00dd" secondary="#00aaff" />
        </div>
      )}

      {/* ── TAB: Convocatorias ───────────────────────────────────────────── */}
      {activeTab === 'convocatorias' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '24px' }}>
          {/* Formulario crear */}
          <div style={S.card}>
            <h3 style={S.cardTitle}>+ Crear Convocatoria</h3>
            <form onSubmit={crearConvocatoria} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <InputField label="Nombre del Batch *" value={formConv.nombre_batch} onChange={v => setFormConv(f => ({ ...f, nombre_batch: v }))} placeholder="ej. Generación 2026-A" />
              <InputField label="Descripción" value={formConv.descripcion} onChange={v => setFormConv(f => ({ ...f, descripcion: v }))} multiline />
              <InputField label="Requisitos" value={formConv.requisitos} onChange={v => setFormConv(f => ({ ...f, requisitos: v }))} multiline />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <InputField label="Fecha Inicio" value={formConv.fecha_inicio} onChange={v => setFormConv(f => ({ ...f, fecha_inicio: v }))} type="date" />
                <InputField label="Fecha Cierre" value={formConv.fecha_cierre} onChange={v => setFormConv(f => ({ ...f, fecha_cierre: v }))} type="date" />
              </div>
              <div>
                <label style={S.label}>Estado</label>
                <select value={formConv.estado} onChange={e => setFormConv(f => ({ ...f, estado: e.target.value }))} style={S.select}>
                  <option value="borrador">Borrador</option>
                  <option value="abierta">Abierta (visible para startups)</option>
                  <option value="cerrada">Cerrada</option>
                </select>
              </div>
              <button type="submit" disabled={loading} style={S.submitBtn}>
                {loading ? 'Creando...' : '⚡ Crear Convocatoria'}
              </button>
            </form>
          </div>

          {/* Lista convocatorias */}
          <div style={S.card}>
            <h3 style={S.cardTitle}>Mis Convocatorias ({convocatorias.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '480px', overflowY: 'auto' }}>
              {convocatorias.length === 0 && <p style={{ color: '#4a5568', textAlign: 'center', padding: '30px' }}>No tienes convocatorias aún.</p>}
              {convocatorias.map(c => {
                const estadoColor = { abierta: '#b1f500', cerrada: '#ef4444', borrador: '#eab308' }[c.estado] || '#8899aa';
                return (
                  <div key={c.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: '0 0 4px', fontWeight: '700', color: '#fff', fontSize: '14px' }}>{c.nombre_batch}</p>
                        <p style={{ margin: '0 0 8px', color: '#8899aa', fontSize: '12px' }}>
                          {c.fecha_cierre ? `Cierre: ${c.fecha_cierre}` : 'Sin fecha límite'}
                        </p>
                      </div>
                      <span style={{ padding: '3px 10px', borderRadius: '50px', fontSize: '11px', fontWeight: '700', background: `${estadoColor}20`, color: estadoColor }}>
                        {c.estado}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <button onClick={() => publicarConvocatoria(c.id, c.estado)} style={S.miniBtn}>
                        {c.estado === 'abierta' ? '🔒 Cerrar' : '📢 Publicar'}
                      </button>
                      <button onClick={() => { setSelectedConv(c.id); setActiveTab('kanban'); loadPostulaciones(c.id); }} style={S.miniBtn}>
                        🗂️ Ver Kanban
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: Kanban ──────────────────────────────────────────────────── */}
      {activeTab === 'kanban' && (
        <div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
            <h3 style={{ margin: 0, color: '#fff', fontSize: '18px' }}>🗂️ Pipeline de Postulaciones</h3>
            <select value={selectedConv || ''} onChange={e => { const v = e.target.value || null; setSelectedConv(v); loadPostulaciones(v); }} style={{ ...S.select, maxWidth: '280px' }}>
              <option value="">— Todas las convocatorias —</option>
              {convocatorias.map(c => <option key={c.id} value={c.id}>{c.nombre_batch}</option>)}
            </select>
            <button onClick={() => loadPostulaciones(selectedConv)} style={S.miniBtn}>🔄 Actualizar</button>
          </div>
          <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '12px' }}>
            <KanbanColumn title="Recibidas" color="#8899aa" items={kanbanGroups.Recibida} onMover={moverKanban} />
            <KanbanColumn title="Entrevistadas" color="#eab308" items={kanbanGroups.Entrevistada} onMover={moverKanban} />
            <KanbanColumn title="Aceptadas" color="#b1f500" items={kanbanGroups.Aceptada} onMover={moverKanban} />
            <KanbanColumn title="Rechazadas" color="#ef4444" items={kanbanGroups.Rechazada} onMover={moverKanban} />
          </div>
          {postulaciones.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px', color: '#4a5568' }}>
              <p style={{ fontSize: '48px' }}>📭</p>
              <p>No hay postulaciones en esta convocatoria todavía.</p>
            </div>
          )}
        </div>
      )}

      {/* ── TAB: KPIs Cohorte ────────────────────────────────────────────── */}
      {activeTab === 'kpis' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, color: '#fff', fontSize: '18px' }}>📈 KPIs de Startups Aceptadas</h3>
            <button onClick={loadKpis} style={S.miniBtn}>🔄 Actualizar</button>
          </div>
          {kpisCohorte.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#4a5568' }}>
              <p style={{ fontSize: '48px' }}>📊</p>
              <p>Ninguna startup ha registrado KPIs aún. Las startups aceptadas verán su formulario en su panel.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {kpisCohorte.map(k => (
                <div key={k.id} style={{ ...S.card, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: '16px', alignItems: 'center' }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: '700', color: '#fff', fontSize: '14px' }}>{k.Startup?.nombre_comercial || '—'}</p>
                    <p style={{ margin: 0, color: '#8899aa', fontSize: '12px' }}>Periodo: {k.periodo}</p>
                  </div>
                  <div style={S.kpiCell}>
                    <span style={S.kpiLabel}>👥 Nuevos Usuarios</span>
                    <span style={S.kpiValue}>{k.nuevos_usuarios}</span>
                  </div>
                  <div style={S.kpiCell}>
                    <span style={S.kpiLabel}>💰 Ventas</span>
                    <span style={S.kpiValue}>${Number(k.ventas_mensuales).toLocaleString()}</span>
                  </div>
                  <div style={S.kpiCell}>
                    <span style={S.kpiLabel}>🎯 CAC</span>
                    <span style={S.kpiValue}>${Number(k.costo_adquisicion).toLocaleString()}</span>
                  </div>
                  <span style={{ padding: '4px 10px', background: 'rgba(177,245,0,0.1)', color: '#b1f500', borderRadius: '50px', fontSize: '11px', fontWeight: '700' }}>Registrado</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── TAB: Perks ───────────────────────────────────────────────────── */}
      {activeTab === 'perks' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={S.card}>
              <h3 style={S.cardTitle}>+ Agregar Beneficio (Perk)</h3>
              <form onSubmit={crearPerk} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <InputField label="Título *" value={formPerk.titulo} onChange={v => setFormPerk(f => ({ ...f, titulo: v }))} placeholder="ej. AWS Credits $10,000" />
                <InputField label="Descripción" value={formPerk.descripcion} onChange={v => setFormPerk(f => ({ ...f, descripcion: v }))} multiline />
                <div>
                  <label style={S.label}>Tipo</label>
                  <select value={formPerk.tipo} onChange={e => setFormPerk(f => ({ ...f, tipo: e.target.value }))} style={S.select}>
                    <option value="credito_cloud">☁️ Crédito Cloud (AWS/GCP)</option>
                    <option value="espacio_trabajo">🏢 Espacio de Trabajo</option>
                    <option value="beneficio_comercial">🤝 Beneficio Comercial</option>
                    <option value="otro">🎁 Otro</option>
                  </select>
                </div>
                <InputField label="Valor" value={formPerk.valor} onChange={v => setFormPerk(f => ({ ...f, valor: v }))} placeholder="ej. $10,000 créditos" />
                <button type="submit" style={S.submitBtn}>🎁 Crear Perk</button>
              </form>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={S.card}>
              <h3 style={S.cardTitle}>Perks Activos ({perks.length})</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '220px', overflowY: 'auto' }}>
                {perks.map(p => (
                  <div key={p.id} style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '10px', padding: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <p style={{ margin: '0 0 4px', fontWeight: '700', color: '#fff', fontSize: '13px' }}>{p.titulo}</p>
                    <p style={{ margin: 0, color: '#8899aa', fontSize: '12px' }}>{p.valor}</p>
                  </div>
                ))}
                {perks.length === 0 && <p style={{ color: '#4a5568', textAlign: 'center', padding: '20px' }}>Sin perks aún</p>}
              </div>
            </div>

            <div style={S.card}>
              <h3 style={S.cardTitle}>Reclamaciones Pendientes ({reclamaciones.filter(r => r.estado === 'pendiente').length})</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                {reclamaciones.map(r => (
                  <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <div>
                      <p style={{ margin: 0, fontSize: '13px', color: '#fff', fontWeight: '600' }}>{r.Startup?.nombre_comercial}</p>
                      <p style={{ margin: 0, fontSize: '11px', color: '#8899aa' }}>{r.Perk?.titulo}</p>
                    </div>
                    {r.estado === 'pendiente' ? (
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => gestionarReclamacion(r.id, 'aprobada')} style={{ ...S.miniBtn, background: 'rgba(177,245,0,0.1)', color: '#b1f500', borderColor: 'rgba(177,245,0,0.3)' }}>✓</button>
                        <button onClick={() => gestionarReclamacion(r.id, 'rechazada')} style={{ ...S.miniBtn, background: 'rgba(239,68,68,0.1)', color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }}>✗</button>
                      </div>
                    ) : (
                      <span style={{ fontSize: '11px', color: r.estado === 'aprobada' ? '#b1f500' : '#ef4444' }}>{r.estado}</span>
                    )}
                  </div>
                ))}
                {reclamaciones.length === 0 && <p style={{ color: '#4a5568', textAlign: 'center', padding: '20px' }}>Sin reclamaciones</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: Mentores ────────────────────────────────────────────────── */}
      {activeTab === 'mentores' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '24px' }}>
          <div style={S.card}>
            <h3 style={S.cardTitle}>+ Agregar Mentor</h3>
            <form onSubmit={crearMentor} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <InputField label="Nombre *" value={formMentor.nombre} onChange={v => setFormMentor(f => ({ ...f, nombre: v }))} placeholder="Dr. María González" />
              <InputField label="Especialidad" value={formMentor.especialidad} onChange={v => setFormMentor(f => ({ ...f, especialidad: v }))} placeholder="Growth Hacking, Fintech..." />
              <InputField label="LinkedIn URL" value={formMentor.linkedin_url} onChange={v => setFormMentor(f => ({ ...f, linkedin_url: v }))} placeholder="https://linkedin.com/in/..." />
              <button type="submit" style={S.submitBtn}>🧠 Agregar Mentor</button>
            </form>

            <div style={{ marginTop: '20px' }}>
              <p style={{ color: '#8899aa', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>Mentores ({mentores.length})</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '250px', overflowY: 'auto' }}>
                {mentores.map(m => (
                  <div key={m.id} style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '10px', padding: '10px 12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <p style={{ margin: '0 0 2px', fontWeight: '700', color: '#fff', fontSize: '13px' }}>{m.nombre}</p>
                    <p style={{ margin: 0, color: '#8b00dd', fontSize: '11px' }}>{m.especialidad}</p>
                  </div>
                ))}
                {mentores.length === 0 && <p style={{ color: '#4a5568', textAlign: 'center', padding: '20px' }}>Sin mentores</p>}
              </div>
            </div>
          </div>

          <div style={S.card}>
            <h3 style={S.cardTitle}>Reservas de Mentoría ({reservas.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '450px', overflowY: 'auto' }}>
              {reservas.map(r => {
                const estadoColor = { pendiente: '#eab308', confirmada: '#b1f500', cancelada: '#ef4444' }[r.estado] || '#8899aa';
                return (
                  <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div>
                      <p style={{ margin: '0 0 3px', fontSize: '14px', color: '#fff', fontWeight: '600' }}>{r.Startup?.nombre_comercial}</p>
                      <p style={{ margin: '0 0 3px', fontSize: '12px', color: '#8b00dd' }}>con {r.Mentor?.nombre}</p>
                      <p style={{ margin: 0, fontSize: '11px', color: '#8899aa' }}>{r.fecha_hora ? new Date(r.fecha_hora).toLocaleString() : '—'}</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' }}>
                      <span style={{ padding: '3px 10px', borderRadius: '50px', fontSize: '11px', fontWeight: '700', background: `${estadoColor}20`, color: estadoColor }}>
                        {r.estado}
                      </span>
                      {r.estado === 'pendiente' && (
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button onClick={() => gestionarReserva(r.id, 'confirmada')} style={{ ...S.miniBtn, fontSize: '10px', background: 'rgba(177,245,0,0.1)', color: '#b1f500', borderColor: 'rgba(177,245,0,0.3)' }}>✓ Confirmar</button>
                          <button onClick={() => gestionarReserva(r.id, 'cancelada')} style={{ ...S.miniBtn, fontSize: '10px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }}>✗ Cancelar</button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              {reservas.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: '#4a5568' }}>
                  <p style={{ fontSize: '36px' }}>📅</p>
                  <p>No hay reservas de mentoría todavía.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ── Input helper ─────────────────────────────────────────────────────────── */
const InputField = ({ label, value, onChange, placeholder, multiline, type = 'text' }) => (
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
    fontSize: '17px',
    fontWeight: '700',
    color: '#ffffff',
    margin: '0 0 18px',
  },
  label: {
    display: 'block',
    fontSize: '12px',
    fontWeight: '600',
    color: '#8899aa',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '6px'
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '13px',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit'
  },
  select: {
    width: '100%',
    padding: '10px 14px',
    background: 'rgba(11,19,36,0.8)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '13px',
    outline: 'none',
    cursor: 'pointer'
  },
  submitBtn: {
    padding: '12px',
    background: 'linear-gradient(135deg, #8b00dd 0%, #5500aa 100%)',
    border: 'none',
    borderRadius: '10px',
    color: '#fff',
    fontWeight: '700',
    fontSize: '14px',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(139,0,221,0.3)',
    transition: 'all 0.2s ease'
  },
  miniBtn: {
    padding: '6px 12px',
    background: 'rgba(139,0,221,0.1)',
    border: '1px solid rgba(139,0,221,0.3)',
    borderRadius: '8px',
    color: '#c084fc',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  kpiCell: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  },
  kpiLabel: {
    fontSize: '11px',
    color: '#8899aa',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  kpiValue: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#fff'
  }
};

export default AceleradoraDashboard;
