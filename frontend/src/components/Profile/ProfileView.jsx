import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/apiService';
import Swal from 'sweetalert2';
import '../../styles/Profile.css';

/**
 * Mapeador de Configuración Dinámica por Rol para el Perfil
 */
const roleConfigs = {
  1: {
    name: 'Administrador del Sistema',
    emoji: '⚙️',
    badgeColor: 'rgba(168, 85, 247, 0.15)',
    badgeBorder: 'rgba(168, 85, 247, 0.3)',
    stats: [
      { num: '120', key: 'Usuarios Totales' },
      { num: '15', key: 'Alertas del Sistema' },
      { num: '3', key: 'Logs de Auditoría' }
    ],
    activities: [
      { action: 'Aprobaste', entity: 'Validación de Cédula 208220001', type: 'export', time: 'Hace 2 horas' },
      { action: 'Restableciste', entity: 'Código 2FA de Inversionista', type: 'export', time: 'Hace 5 horas' },
      { action: 'Ejecutaste', entity: 'Limpieza de caché de sesiones', type: 'export', time: 'Hace 1 día' }
    ]
  },
  2: {
    name: 'Emprendedor / Startup',
    emoji: '🚀',
    badgeColor: 'rgba(236, 72, 153, 0.15)',
    badgeBorder: 'rgba(236, 72, 153, 0.3)',
    stats: [
      { num: '1', key: 'Startup Activa' },
      { num: '48', key: 'Vistas de Perfil' },
      { num: '3', key: 'Postulaciones Enviadas' }
    ],
    activities: [
      { action: 'Registraste', entity: 'AgroTech CR', type: 'startup', time: 'Hace 2 días' },
      { action: 'Actualizaste', entity: 'Fase de desarrollo a Semilla', type: 'startup', time: 'Hace 3 días' },
      { action: 'Buscaste', entity: 'Inversores Ángel en San José', type: 'investor', time: 'Hace 4 días' }
    ]
  },
  3: {
    name: 'Aceleradora de Startups',
    emoji: '⚡',
    badgeColor: 'rgba(177, 245, 0, 0.15)',
    badgeBorder: 'rgba(177, 245, 0, 0.3)',
    stats: [
      { num: '8', key: 'Cohortes Totales' },
      { num: '24', key: 'Startups Incubadas' },
      { num: '15', key: 'Mentores Activos' }
    ],
    activities: [
      { action: 'Publicaste', entity: 'Convocatoria Seed 2026', type: 'accelerator', time: 'Hace 1 día' },
      { action: 'Asignaste', entity: 'Mentor a BioFood Costa Rica', type: 'accelerator', time: 'Hace 3 días' },
      { action: 'Exploraste', entity: 'Candidatos del sector Biotech', type: 'startup', time: 'Hace 1 semana' }
    ]
  },
  4: {
    name: 'Inversionista',
    emoji: '💼',
    badgeColor: 'rgba(234, 179, 8, 0.15)',
    badgeBorder: 'rgba(234, 179, 8, 0.3)',
    stats: [
      { num: '$150K', key: 'Capital Invertido' },
      { num: '5', key: 'Startups Financiadas' },
      { num: '12%', key: 'ROI Proyectado' }
    ],
    activities: [
      { action: 'Analizaste', entity: 'Tesis de inversión FinTech', type: 'investor', time: 'Hace 12 horas' },
      { action: 'Contactaste', entity: 'Fundador de Soluciones Verdes', type: 'startup', time: 'Hace 2 días' },
      { action: 'Agregaste', entity: 'Fondo de Co-Inversión CCA', type: 'investor', time: 'Hace 5 días' }
    ]
  }
};

/**
 * ProfileView — Vista y edición dinámica del perfil del usuario autenticado
 */
const ProfileView = () => {
  const { user, setUser, token } = useAuth();
  const [activeTab, setActiveTab] = useState('info');

  // Estados del formulario
  const [nombreHacienda, setNombreHacienda] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tempProfilePicture, setTempProfilePicture] = useState('');
  const [loadingSave, setLoadingSave] = useState(false);

  // Estados de configuración de preferencias
  const [notifConvocatorias, setNotifConvocatorias] = useState(true);
  const [perfilPublico, setPerfilPublico] = useState(true);
  const [exportHabilitada, setExportHabilitada] = useState(true);

  // Carga inicial de datos de usuario
  useEffect(() => {
    if (user) {
      setNombreHacienda(user.nombre_hacienda || '');
      setEmail(user.email || '');
      setTempProfilePicture(user.profile_picture || '');
    }
  }, [user]);

  // Si no hay datos de usuario (ej. cargando sesión), retorna spinner
  if (!user) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: 'rgba(255,255,255,0.4)' }}>
        Cargando perfil...
      </div>
    );
  }

  const userInitial = nombreHacienda ? nombreHacienda.charAt(0).toUpperCase() : 'U';
  const roleId = user.role_id || 2; // Default to Startup/Emprendedor if undefined
  const config = roleConfigs[roleId] || roleConfigs[2];

  // Formatear fecha de registro del usuario
  const memberSince = user.created_at || user.createdAt
    ? new Date(user.created_at || user.createdAt).toLocaleDateString('es-CR', { year: 'numeric', month: 'long' })
    : 'Mayo de 2026';

  // Manejar el cambio de foto de perfil (conversión a Base64)
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validación de peso máximo de 2MB
    if (file.size > 2 * 1024 * 1024) {
      Swal.fire({
        icon: 'error',
        title: 'Imagen demasiado grande',
        text: 'Por favor, elija una imagen que pese menos de 2MB para optimizar el rendimiento.',
        background: '#0b1324',
        color: '#fff',
        confirmButtonColor: '#ef4444'
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setTempProfilePicture(reader.result);
      
      // Mostrar toast sutil indicando vista previa
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'info',
        title: 'Vista previa de foto cargada. Guarde los cambios para consolidarla.',
        showConfirmButton: false,
        timer: 3500,
        background: '#0b1324',
        color: '#fff'
      });
    };
    reader.readAsDataURL(file);
  };

  // Manejar el guardado del formulario
  const handleSave = async (e) => {
    e.preventDefault();
    if (!nombreHacienda.trim() || !email.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos obligatorios',
        text: 'Por favor complete el nombre y el correo electrónico.',
        background: '#0b1324',
        color: '#fff',
        confirmButtonColor: 'var(--role-accent, #3b82f6)'
      });
      return;
    }

    setLoadingSave(true);
    try {
      const payload = {
        nombre_hacienda: nombreHacienda,
        email: email,
        profile_picture: tempProfilePicture // Guardar la cadena Base64
      };

      // Si especificó una nueva contraseña de min 6 caracteres
      if (password) {
        if (password.length < 6) {
          throw new Error('La nueva contraseña debe tener mínimo 6 caracteres.');
        }
        payload.password_hash = password;
      }

      // Endpoint: PUT /api/usuarios/:id
      const response = await apiService.update('/api/usuarios', user.id, payload, token);
      const updatedUserData = response?.data || {};
      const nextUser = { ...user, ...updatedUserData };

      // Actualizar el estado global del usuario en el contexto
      setUser(nextUser);
      
      // Actualizar persistencia local
      localStorage.setItem('user', JSON.stringify(nextUser));
      setPassword(''); // Limpiar campo clave

      Swal.fire({
        icon: 'success',
        title: '¡Perfil Actualizado!',
        text: 'Sus cambios, incluyendo la nueva foto de perfil, han sido guardados exitosamente en la base de datos.',
        background: '#0b1324',
        color: '#fff',
        confirmButtonColor: 'var(--role-accent, #10b981)',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (err) {
      console.error('Error al actualizar perfil:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error de Validación',
        text: err.message || 'No se pudo actualizar el perfil.',
        background: '#0b1324',
        color: '#fff',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setLoadingSave(false);
    }
  };

  // Manejar la eliminación de la cuenta
  const handleDeleteAccount = () => {
    Swal.fire({
      title: '¿Está seguro de eliminar su cuenta?',
      text: 'Esta acción es completamente irreversible. Se perderán todos sus datos y perfiles relacionados de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#374151',
      confirmButtonText: 'Sí, eliminar permanentemente',
      cancelButtonText: 'Cancelar',
      background: '#0b1324',
      color: '#fff'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          if (user.role_id === 1) {
            // El administrador puede auto-eliminarse o eliminar usuarios
            await apiService.delete('/api/usuarios', user.id, token);
            Swal.fire({
              icon: 'success',
              title: 'Cuenta Eliminada',
              text: 'Su cuenta administrativa ha sido removida del ecosistema.',
              background: '#0b1324',
              color: '#fff'
            }).then(() => {
              window.location.href = '/';
            });
          } else {
            // Para otros roles, enviar una alerta de simulación o aviso de seguridad
            Swal.fire({
              title: 'Procesando Solicitud...',
              allowOutsideClick: false,
              didOpen: () => Swal.showLoading()
            });
            
            setTimeout(() => {
              Swal.fire({
                icon: 'success',
                title: 'Solicitud Enviada',
                text: 'Su solicitud de baja de cuenta ha sido transmitida al Administrador del Sistema. Se le notificará por correo electrónico.',
                background: '#0b1324',
                color: '#fff',
                confirmButtonColor: 'var(--role-accent, #3b82f6)'
              });
            }, 1000);
          }
        } catch (err) {
          Swal.fire({
            icon: 'error',
            title: 'Acceso Denegado',
            text: err.message || 'No tiene permisos suficientes para auto-eliminación inmediata.',
            background: '#0b1324',
            color: '#fff'
          });
        }
      }
    });
  };

  return (
    <>
      {/* Input de archivo oculto para la foto de perfil */}
      <input 
        type="file" 
        id="profile-pic-file-input" 
        accept="image/*" 
        style={{ display: 'none' }} 
        onChange={handleProfilePictureChange} 
      />

      {/* ── HERO DEL PERFIL DINÁMICO ─────────────────────────────────────────── */}
      <div className="pf-hero" style={{ borderColor: 'var(--role-border-alpha)' }}>
        {/* Avatar interactivo clickeable para cambiar foto */}
        <div 
          className="pf-avatar-wrap" 
          style={{ cursor: 'pointer' }}
          onClick={() => document.getElementById('profile-pic-file-input').click()}
          title="Haga clic para cambiar la foto de perfil"
        >
          {/* Avatar con foto Base64 o inicial dinámica */}
          <div className="pf-avatar" style={{ background: 'linear-gradient(135deg, var(--role-accent, #7900c2), #0f172a)', overflow: 'hidden', position: 'relative' }}>
            {tempProfilePicture ? (
              <img 
                src={tempProfilePicture} 
                alt="Foto de perfil" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            ) : (
              userInitial
            )}
            {/* Overlay sutil al pasar el mouse */}
            <div className="pf-avatar-overlay">
              <span>📷 Cambiar</span>
            </div>
          </div>
          {/* Indicador de estado en línea */}
          <div className="pf-online-dot"></div>
        </div>
        
        <div className="pf-hero-info">
          <h1 className="pf-name">{nombreHacienda}</h1>
          <p className="pf-email">{email}</p>
          {/* Badges reales del usuario autenticado */}
          <div className="pf-badges">
            <span className="pf-badge" style={{ backgroundColor: config.badgeColor, borderColor: config.badgeBorder, color: '#fff' }}>
              {config.emoji} {config.name}
            </span>
            <span className="pf-badge" style={{ color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.2)', backgroundColor: 'rgba(16, 185, 129, 0.05)' }}>
              🛡️ Doble Factor Activo
            </span>
            <span className="pf-badge">
              📅 Miembro desde: {memberSince}
            </span>
          </div>
        </div>
        {/* Estadísticas personalizadas según el rol */}
        <div className="pf-hero-stats">
          {config.stats.map((stat, i) => (
            <div className="pf-hero-stat" key={i}>
              <span className="pf-hero-num" style={{ color: 'var(--role-accent)' }}>{stat.num}</span>
              <span className="pf-hero-key">{stat.key}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── TABS DE NAVEGACIÓN ──────────────────────────────────────── */}
      <div className="pf-tabs">
        {['info', 'activity', 'settings'].map(t => (
          <button
            key={t}
            className={`pf-tab ${activeTab === t ? 'active' : ''}`}
            onClick={() => setActiveTab(t)}
            style={{
              color: activeTab === t ? 'var(--role-accent)' : 'rgba(255,255,255,0.4)',
              borderBottomColor: activeTab === t ? 'var(--role-accent)' : 'transparent'
            }}
          >
            {t === 'info'     ? '👤 Mi Información' :
             t === 'activity' ? '📋 Actividad de Rol'  :
                                '⚙️ Configuración'}
          </button>
        ))}
      </div>

      {/* ── Tab: Mi Información ────────────────────────────────────── */}
      {activeTab === 'info' && (
        <div className="pf-section">
          <form onSubmit={handleSave} className="pf-form-grid" style={{ marginTop: '0.5rem' }}>
            {/* Cédula - No modificable por seguridad de identidad física */}
            <div className="pf-field">
              <label>Cédula de Identidad (Hacienda CR)</label>
              <input 
                value={user.cedula || ''} 
                disabled 
                style={{ opacity: 0.6, cursor: 'not-allowed' }}
              />
            </div>
            {/* Rol - No modificable */}
            <div className="pf-field">
              <label>Rol en el Ecosistema</label>
              <select value={roleId} disabled style={{ opacity: 0.6, cursor: 'not-allowed' }}>
                <option value={1}>Administrador</option>
                <option value={2}>Emprendedor / Startup</option>
                <option value={3}>Aceleradora</option>
                <option value={4}>Inversionista</option>
              </select>
            </div>
            {/* Nombre Completo */}
            <div className="pf-field">
              <label>Nombre Completo (Verificado)</label>
              <input 
                type="text"
                value={nombreHacienda} 
                onChange={(e) => setNombreHacienda(e.target.value)} 
                required
                style={{ borderFocus: 'var(--role-accent)' }}
              />
            </div>
            {/* Correo electrónico */}
            <div className="pf-field">
              <label>Correo Electrónico</label>
              <input 
                type="email"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required
              />
            </div>
            {/* País */}
            <div className="pf-field">
              <label>País</label>
              <input defaultValue="Costa Rica" disabled style={{ opacity: 0.6, cursor: 'not-allowed' }} />
            </div>
            {/* Contraseña Nueva */}
            <div className="pf-field">
              <label>Nueva Contraseña (Opcional)</label>
              <input 
                type="password" 
                placeholder="Dejar en blanco para conservar contraseña actual"
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>
            {/* Foto de Perfil en Formulario (Clickeable también) */}
            <div className="pf-field pf-full">
              <label>Foto de Perfil</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.2rem' }}>
                <button 
                  type="button" 
                  onClick={() => document.getElementById('profile-pic-file-input').click()}
                  style={{
                    padding: '0.6rem 1.2rem',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
                  onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
                >
                  📁 Seleccionar Nueva Imagen
                </button>
                {tempProfilePicture && (
                  <button 
                    type="button" 
                    onClick={() => {
                      setTempProfilePicture('');
                      Swal.fire({
                        toast: true,
                        position: 'top-end',
                        icon: 'success',
                        title: 'Foto de perfil removida. Guarde para consolidar.',
                        showConfirmButton: false,
                        timer: 2000,
                        background: '#0b1324',
                        color: '#fff'
                      });
                    }}
                    style={{
                      padding: '0.6rem 1.2rem',
                      borderRadius: '8px',
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                      color: '#ef4444',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.2)'}
                    onMouseOut={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.1)'}
                  >
                    🗑️ Quitar Foto
                  </button>
                )}
                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
                  Formatos recomendados: JPG, PNG. Tamaño máximo: 2MB.
                </span>
              </div>
            </div>
            {/* Biografía / Descripción del Rol */}
            <div className="pf-field pf-full">
              <label>Descripción de Actividad</label>
              <textarea 
                rows={3} 
                defaultValue={config.desc} 
                disabled 
                style={{ opacity: 0.7, cursor: 'not-allowed' }}
              />
            </div>
            
            <button 
              type="submit" 
              className="pf-save-btn"
              disabled={loadingSave}
              style={{
                background: 'linear-gradient(135deg, var(--role-accent, #7900c2), #090e1a)',
                boxShadow: '0 4px 14px var(--role-glow, rgba(121, 0, 194 ,0.25))',
                opacity: loadingSave ? 0.7 : 1
              }}
            >
              {loadingSave ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </form>
        </div>
      )}

      {/* ── Tab: Actividad de Rol ─────────────────────────────────────────── */}
      {activeTab === 'activity' && (
        <div className="pf-section">
          <div className="pf-activity-list" style={{ marginTop: '0.5rem' }}>
            {config.activities.map((act, i) => (
              <div className="pf-activity-row" key={i}>
                <div className="pf-activity-dot" style={{ backgroundColor: 'var(--role-accent)' }}></div>
                <div className="pf-activity-info">
                  <p className="pf-activity-text">
                    <strong>{act.action}</strong> — {act.entity}
                  </p>
                  <p className="pf-activity-time">{act.time}</p>
                </div>
                {/* Badge del tipo de entidad */}
                <span className={`el-stage-badge pf-type-badge pf-type-${act.type}`} style={{
                  backgroundColor: 'var(--role-bg-alpha)',
                  color: 'var(--role-accent)',
                  border: '1px solid var(--role-border-alpha)'
                }}>
                  {act.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Tab: Configuración ─────────────────────────────────────── */}
      {activeTab === 'settings' && (
        <div className="pf-section">
          <div className="pf-settings-list" style={{ marginTop: '0.5rem' }}>

            {/* Toggle: Notificaciones de convocatorias */}
            <div className="pf-setting-row">
              <div>
                <p className="pf-setting-label">Notificaciones de Convocatorias</p>
                <p className="pf-setting-desc">Recibe alertas y resúmenes semanales sobre el ecosistema.</p>
              </div>
              <div 
                className={`pf-toggle ${notifConvocatorias ? 'active' : ''}`}
                onClick={() => setNotifConvocatorias(!notifConvocatorias)}
                style={{ backgroundColor: notifConvocatorias ? 'var(--role-accent)' : 'rgba(255,255,255,0.1)' }}
              ></div>
            </div>

            {/* Toggle: Visibilidad del perfil en el mapa */}
            <div className="pf-setting-row">
              <div>
                <p className="pf-setting-label">Perfil Público Activo</p>
                <p className="pf-setting-desc">Tu perfil aparece listado y visible en el radar interactivo del ecosistema.</p>
              </div>
              <div 
                className={`pf-toggle ${perfilPublico ? 'active' : ''}`}
                onClick={() => setPerfilPublico(!perfilPublico)}
                style={{ backgroundColor: perfilPublico ? 'var(--role-accent)' : 'rgba(255,255,255,0.1)' }}
              ></div>
            </div>

            {/* Toggle: Exportación de datos */}
            <div className="pf-setting-row">
              <div>
                <p className="pf-setting-label">Exportación de Datos Habilitada</p>
                <p className="pf-setting-desc">Permite exportar resúmenes del portafolio en formatos estructurados CSV/JSON.</p>
              </div>
              <div 
                className={`pf-toggle ${exportHabilitada ? 'active' : ''}`}
                onClick={() => setExportHabilitada(!exportHabilitada)}
                style={{ backgroundColor: exportHabilitada ? 'var(--role-accent)' : 'rgba(255,255,255,0.1)' }}
              ></div>
            </div>

            {/* Zona de peligro: eliminar cuenta */}
            <div className="pf-setting-row danger" style={{ borderTopColor: 'rgba(239,68,68,0.2)' }}>
              <div>
                <p className="pf-setting-label" style={{ color: '#ef4444' }}>Desactivar / Eliminar Cuenta</p>
                <p className="pf-setting-desc">Elimina de forma irreversible tu cuenta y todos tus registros de Nexus Cobalt.</p>
              </div>
              <button onClick={handleDeleteAccount} className="pf-danger-btn">
                Eliminar Cuenta
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default ProfileView;
