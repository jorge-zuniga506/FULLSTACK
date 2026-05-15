import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Profile.css'; // Estilos del dashboard de usuario (.pf-*)

// ─── Datos Mock ───────────────────────────────────────────────────────────────
// TODO: reemplazar con el historial real del usuario autenticado

/**
 * Historial de actividad reciente del usuario
 * Cada ítem describe una acción, la entidad involucrada, su tipo y cuándo ocurrió
 */
const activity = [
  { action: 'Registraste',      entity: 'AgroTech CR',    type: 'startup',     time: 'Hace 2 días'   },
  { action: 'Exploraste',       entity: 'Fondo Innovar',  type: 'investor',    time: 'Hace 5 días'   },
  { action: 'Exportaste datos', entity: 'Sector Fintech', type: 'export',      time: 'Hace 1 semana' },
  { action: 'Exploraste',       entity: 'StartupLab CCA', type: 'accelerator', time: 'Hace 2 semanas'},
];

/**
 * ProfileView — Dashboard personal del usuario autenticado
 *
 * Tiene su propio sidebar (no usa DashboardLayout — está dentro del layout
 * del DashboardLayout cuando se sirve desde /profile).
 *
 * Secciones:
 * 1. Hero del perfil: avatar, nombre, email, badges y estadísticas
 * 2. Tabs de navegación:
 *    - "Mi Información": formulario editable con datos del perfil
 *    - "Actividad":      historial de acciones del usuario
 *    - "Configuración":  toggles de preferencias y zona de peligro
 *
 * Estado:
 * - activeTab: tab activa ('info' | 'activity' | 'settings')
 *
 * TODO: conectar con AuthContext para mostrar datos reales del usuario
 * TODO: hacer funcionales los toggles y el formulario (llamadas a la API)
 */
const ProfileView = () => {
  const [activeTab, setActiveTab] = useState('info'); // Tab activa por defecto

  return (
    <div className="el-container">

      {/* ── SIDEBAR ─────────────────────────────────────────────────────── */}
      <aside className="el-sidebar">
        {/* Logo de la plataforma */}
        <div className="db-logo">
          <span className="logo-nexus">NEXUS</span>
          <span className="logo-cobalt">COBALT</span>
        </div>
        {/* Navegación — las rutas del ecosistema */}
        <nav className="db-nav">
          <Link to="/dashboard"    className="db-nav-item">📊 Dashboard</Link>
          <Link to="/explorer"     className="db-nav-item">🗺️ Explorador</Link>
          <Link to="/startups"     className="db-nav-item">🚀 Startups</Link>
          <Link to="/investors"    className="db-nav-item">💼 Inversores</Link>
          <Link to="/accelerators" className="db-nav-item">⚡ Aceleradoras</Link>
        </nav>
        {/* Info del usuario + salida */}
        <div className="db-sidebar-bottom">
          <div className="db-user-card">
            <div className="db-avatar">U</div>
            <div>
              <p className="db-username">Usuario</p>
              <p className="db-role">Explorer</p>
            </div>
          </div>
          <Link to="/" className="db-logout">← Salir</Link>
        </div>
      </aside>

      {/* ── MAIN CONTENT ────────────────────────────────────────────────── */}
      <main className="el-main">

        {/* ── HERO DEL PERFIL ─────────────────────────────────────────── */}
        <div className="pf-hero">
          <div className="pf-avatar-wrap">
            {/* Avatar con inicial del usuario */}
            <div className="pf-avatar">U</div>
            {/* Indicador de estado en línea */}
            <div className="pf-online-dot"></div>
          </div>
          <div className="pf-hero-info">
            <h1 className="pf-name">Usuario Explorer</h1>
            <p className="pf-email">usuario@nexuscobalt.com</p>
            {/* Badges de estado del usuario */}
            <div className="pf-badges">
              <span className="pf-badge">🔵 Explorer</span>
              <span className="pf-badge">✅ Verificado</span>
              <span className="pf-badge">📅 Miembro desde 2024</span>
            </div>
          </div>
          {/* Estadísticas de actividad del usuario */}
          <div className="pf-hero-stats">
            <div className="pf-hero-stat">
              <span className="pf-hero-num">12</span>
              <span className="pf-hero-key">Registradas</span>
            </div>
            <div className="pf-hero-stat">
              <span className="pf-hero-num">48</span>
              <span className="pf-hero-key">Exploradas</span>
            </div>
            <div className="pf-hero-stat">
              <span className="pf-hero-num">3</span>
              <span className="pf-hero-key">Exportaciones</span>
            </div>
          </div>
        </div>

        {/* ── TABS DE NAVEGACIÓN ──────────────────────────────────────── */}
        <div className="pf-tabs">
          {['info', 'activity', 'settings'].map(t => (
            <button
              key={t}
              className={`pf-tab ${activeTab === t ? 'active' : ''}`}
              onClick={() => setActiveTab(t)}
            >
              {t === 'info'     ? '👤 Mi Información' :
               t === 'activity' ? '📋 Actividad'      :
                                  '⚙️ Configuración'}
            </button>
          ))}
        </div>

        {/* ── Tab: Mi Información ────────────────────────────────────── */}
        {activeTab === 'info' && (
          <div className="pf-section">
            <div className="pf-form-grid">
              {/* Nombre completo */}
              <div className="pf-field">
                <label>Nombre completo</label>
                <input defaultValue="Usuario Explorer" />
              </div>
              {/* Correo electrónico */}
              <div className="pf-field">
                <label>Correo electrónico</label>
                <input defaultValue="usuario@nexuscobalt.com" />
              </div>
              {/* País de origen */}
              <div className="pf-field">
                <label>País</label>
                <input defaultValue="Costa Rica" />
              </div>
              {/* Rol en el ecosistema */}
              <div className="pf-field">
                <label>Rol en ecosistema</label>
                <select defaultValue="emprendedor">
                  <option value="emprendedor">Emprendedor</option>
                  <option value="inversor">Inversor</option>
                  <option value="aceleradora">Aceleradora</option>
                  <option value="investigador">Investigador</option>
                </select>
              </div>
              {/* Bio — ocupa el ancho completo (pf-full) */}
              <div className="pf-field pf-full">
                <label>Descripción / Bio</label>
                <textarea rows={3} defaultValue="Emprendedor apasionado por la tecnología y el ecosistema de startups latinoamericano." />
              </div>
            </div>
            {/* TODO: conectar con PATCH /api/users/me */}
            <button className="pf-save-btn">Guardar Cambios</button>
          </div>
        )}

        {/* ── Tab: Actividad ─────────────────────────────────────────── */}
        {activeTab === 'activity' && (
          <div className="pf-section">
            <div className="pf-activity-list">
              {activity.map((a, i) => (
                <div className="pf-activity-row" key={i}>
                  {/* Punto del timeline */}
                  <div className="pf-activity-dot"></div>
                  <div className="pf-activity-info">
                    <p className="pf-activity-text">
                      <strong>{a.action}</strong> — {a.entity}
                    </p>
                    <p className="pf-activity-time">{a.time}</p>
                  </div>
                  {/* Badge del tipo de entidad con clase dinámica */}
                  <span className={`el-stage-badge pf-type-badge pf-type-${a.type}`}>
                    {a.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Tab: Configuración ─────────────────────────────────────── */}
        {activeTab === 'settings' && (
          <div className="pf-section">
            <div className="pf-settings-list">

              {/* Toggle: Notificaciones de convocatorias */}
              <div className="pf-setting-row">
                <div>
                  <p className="pf-setting-label">Notificaciones de convocatorias</p>
                  <p className="pf-setting-desc">Recibe alertas cuando aceleradoras abran convocatorias</p>
                </div>
                {/* TODO: conectar estado de toggles con preferencias del usuario */}
                <div className="pf-toggle active"></div>
              </div>

              {/* Toggle: Visibilidad del perfil en el mapa */}
              <div className="pf-setting-row">
                <div>
                  <p className="pf-setting-label">Perfil público en el mapa</p>
                  <p className="pf-setting-desc">Tu perfil aparece como nodo en el explorador</p>
                </div>
                <div className="pf-toggle"></div>
              </div>

              {/* Toggle: Exportación de datos */}
              <div className="pf-setting-row">
                <div>
                  <p className="pf-setting-label">Exportación de datos habilitada</p>
                  <p className="pf-setting-desc">Permite exportar entidades en CSV/JSON</p>
                </div>
                <div className="pf-toggle active"></div>
              </div>

              {/* Zona de peligro: eliminar cuenta */}
              <div className="pf-setting-row danger">
                <div>
                  <p className="pf-setting-label">Eliminar cuenta</p>
                  <p className="pf-setting-desc">Esta acción no se puede deshacer</p>
                </div>
                {/* TODO: mostrar confirmación antes de llamar a DELETE /api/users/me */}
                <button className="pf-danger-btn">Eliminar</button>
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default ProfileView;
