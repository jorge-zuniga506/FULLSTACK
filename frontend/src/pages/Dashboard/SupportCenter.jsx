import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supportService } from '../../services/supportService';

const CATEGORIES = [
  { value: 'bug', label: 'Bug' },
  { value: 'queja', label: 'Queja' },
  { value: 'sugerencia', label: 'Sugerencia' },
  { value: 'incidente', label: 'Incidente' },
  { value: 'otro', label: 'Otro' }
];

const PRIORITIES = [
  { value: 'baja', label: 'Baja' },
  { value: 'media', label: 'Media' },
  { value: 'alta', label: 'Alta' },
  { value: 'critica', label: 'Critica' }
];

const STATUS_LABEL = {
  nuevo: 'Nuevo',
  en_proceso: 'En proceso',
  resuelto: 'Resuelto',
  cerrado: 'Cerrado'
};

const STATUS_COLOR = {
  nuevo: '#f59e0b',
  en_proceso: '#60a5fa',
  resuelto: '#4ade80',
  cerrado: '#a78bfa'
};

const formatDate = (value) => {
  if (!value) return '-';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return String(value);
  return parsed.toLocaleString('es-CR');
};

const statusBadgeStyle = (estado) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  padding: '4px 10px',
  borderRadius: '999px',
  fontSize: '11px',
  fontWeight: '700',
  background: `${STATUS_COLOR[estado] || '#94a3b8'}22`,
  color: STATUS_COLOR[estado] || '#94a3b8',
  border: `1px solid ${(STATUS_COLOR[estado] || '#94a3b8')}55`
});

const SupportCenter = () => {
  const { token, user } = useAuth();
  const isAdmin = Number(user?.role_id) === 1;

  const [form, setForm] = useState({
    categoria: 'bug',
    prioridad: 'media',
    asunto: '',
    descripcion: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [reports, setReports] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('nuevo');

  const loadReports = useCallback(async () => {
    if (!token) return;
    setReportsLoading(true);
    try {
      if (isAdmin) {
        const result = await supportService.getAdminReports({ limit: 30, estado: statusFilter || undefined }, token);
        setReports(result?.data?.reportes || []);
      } else {
        const result = await supportService.getMyReports({ limit: 20 }, token);
        setReports(result?.data?.reportes || []);
      }
    } catch (err) {
      setError(err.message || 'No se pudieron cargar los reportes de soporte.');
    } finally {
      setReportsLoading(false);
    }
  }, [token, isAdmin, statusFilter]);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!form.asunto.trim()) {
      setError('El asunto es requerido.');
      return;
    }
    if (!form.descripcion.trim() || form.descripcion.trim().length < 10) {
      setError('La descripcion debe tener al menos 10 caracteres.');
      return;
    }

    setLoading(true);
    try {
      await supportService.createReport({
        ...form,
        pagina_url: window.location.pathname,
        contexto_tecnico: navigator.userAgent
      }, token);

      setForm({
        categoria: 'bug',
        prioridad: 'media',
        asunto: '',
        descripcion: ''
      });
      setSuccessMessage('Tu reporte fue enviado correctamente. Te enviamos un correo de confirmacion.');
      await loadReports();
    } catch (err) {
      setError(err.message || 'No se pudo enviar el reporte.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminStatusUpdate = async (reportId, estado) => {
    setError('');
    try {
      await supportService.updateReportStatus(reportId, { estado }, token);
      await loadReports();
    } catch (err) {
      setError(err.message || 'No se pudo actualizar el estado del reporte.');
    }
  };

  return (
    <div style={{ padding: '10px 0' }}>
      <div className="db-header" style={{ marginBottom: '22px' }}>
        <div>
          <h1 className="db-title">Centro de Soporte</h1>
          <p className="db-subtitle">
            {isAdmin
              ? 'Bandeja administrativa de reportes y seguimiento de incidencias.'
              : 'Reporta bugs, incidencias o sugerencias para mejorar tu experiencia.'}
          </p>
        </div>
      </div>

      {error && (
        <div style={{ marginBottom: '12px', padding: '11px 12px', borderRadius: '10px', border: '1px solid rgba(239,68,68,0.45)', background: 'rgba(127,29,29,0.35)', color: '#fecaca' }}>
          {error}
        </div>
      )}

      {successMessage && (
        <div style={{ marginBottom: '12px', padding: '11px 12px', borderRadius: '10px', border: '1px solid rgba(74,222,128,0.45)', background: 'rgba(20,83,45,0.35)', color: '#bbf7d0' }}>
          {successMessage}
        </div>
      )}

      {!isAdmin && (
        <div
          style={{
            background: 'rgba(11,19,36,0.5)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '20px',
            textAlign: 'left'
          }}
        >
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '14px' }}>
            <div>
              <label style={styles.label}>Categoria</label>
              <select value={form.categoria} onChange={(e) => setForm((prev) => ({ ...prev, categoria: e.target.value }))} style={styles.input}>
                {CATEGORIES.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={styles.label}>Prioridad</label>
              <select value={form.prioridad} onChange={(e) => setForm((prev) => ({ ...prev, prioridad: e.target.value }))} style={styles.input}>
                {PRIORITIES.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={styles.label}>Asunto</label>
              <input
                type="text"
                value={form.asunto}
                onChange={(e) => setForm((prev) => ({ ...prev, asunto: e.target.value }))}
                placeholder="Ej: No me deja publicar en el feed"
                style={styles.input}
                maxLength={180}
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={styles.label}>Descripcion</label>
              <textarea
                rows={5}
                value={form.descripcion}
                onChange={(e) => setForm((prev) => ({ ...prev, descripcion: e.target.value }))}
                placeholder="Cuentalo con detalle para ayudarte mas rapido..."
                style={{ ...styles.input, resize: 'vertical' }}
              />
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px 18px',
                  fontWeight: '700',
                  color: '#fff',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  background: 'linear-gradient(135deg,#8b00dd,#00aaff)',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? 'Enviando...' : 'Enviar reporte a soporte'}
              </button>
            </div>
          </form>
        </div>
      )}

      {isAdmin && (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
          {['nuevo', 'en_proceso', 'resuelto', 'cerrado'].map((estado) => (
            <button
              key={estado}
              type="button"
              onClick={() => setStatusFilter(estado)}
              style={{
                borderRadius: '999px',
                padding: '7px 12px',
                border: `1px solid ${statusFilter === estado ? '#a78bfa' : 'rgba(255,255,255,0.12)'}`,
                background: statusFilter === estado ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.03)',
                color: statusFilter === estado ? '#fff' : '#9aa9bc',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              {STATUS_LABEL[estado]}
            </button>
          ))}
        </div>
      )}

      <div
        style={{
          background: 'rgba(11,19,36,0.5)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '16px',
          padding: '20px',
          textAlign: 'left'
        }}
      >
        <h3 style={{ margin: '0 0 14px', color: '#fff', fontSize: '17px' }}>
          {isAdmin ? 'Bandeja de reportes recibidos' : 'Mis reportes enviados'}
        </h3>

        {reportsLoading ? (
          <p style={{ margin: 0, color: '#9aa9bc' }}>Cargando reportes...</p>
        ) : reports.length === 0 ? (
          <p style={{ margin: 0, color: '#9aa9bc' }}>No hay reportes para mostrar.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {reports.map((report) => (
              <div key={report.id} style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
                  <div>
                    <p style={{ margin: '0 0 4px', color: '#fff', fontWeight: '700' }}>
                      #{report.id} - {report.asunto}
                    </p>
                    <p style={{ margin: 0, color: '#9aa9bc', fontSize: '12px' }}>
                      {report.categoria} | prioridad {report.prioridad} | {formatDate(report.created_at)}
                    </p>
                    {isAdmin && report.Reporter?.email && (
                      <p style={{ margin: '4px 0 0', color: '#9aa9bc', fontSize: '12px' }}>
                        Reportado por: {report.Reporter.nombre_hacienda || 'Usuario'} ({report.Reporter.email})
                      </p>
                    )}
                  </div>
                  <span style={statusBadgeStyle(report.estado)}>{STATUS_LABEL[report.estado] || report.estado}</span>
                </div>

                <p style={{ margin: '10px 0 0', color: '#cbd5e1', lineHeight: 1.5 }}>{report.descripcion}</p>

                {isAdmin && (
                  <div style={{ marginTop: '10px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {['nuevo', 'en_proceso', 'resuelto', 'cerrado'].map((estado) => (
                      <button
                        key={`${report.id}-${estado}`}
                        type="button"
                        disabled={report.estado === estado}
                        onClick={() => handleAdminStatusUpdate(report.id, estado)}
                        style={{
                          padding: '6px 10px',
                          fontSize: '11px',
                          borderRadius: '8px',
                          border: '1px solid rgba(255,255,255,0.15)',
                          background: report.estado === estado ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.03)',
                          color: report.estado === estado ? '#fff' : '#9aa9bc',
                          cursor: report.estado === estado ? 'not-allowed' : 'pointer'
                        }}
                      >
                        Marcar {STATUS_LABEL[estado]}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  label: {
    display: 'block',
    marginBottom: '6px',
    fontSize: '12px',
    color: '#9aa9bc',
    textTransform: 'uppercase',
    letterSpacing: '0.4px',
    fontWeight: '700'
  },
  input: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '10px 12px',
    borderRadius: '9px',
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.03)',
    color: '#fff',
    outline: 'none'
  }
};

export default SupportCenter;
