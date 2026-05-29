const sequelize = require('./config/db');

// Ensure profile role-validation hooks are attached at startup.
require('./models/Profiles');

const User = require('./models/User');
const Role = require('./models/Role');
const Sector = require('./models/Sector');
const Startup = require('./models/Startup');
const Session = require('./models/Session');
const Aceleradora = require('./models/Aceleradora');
const Inversor = require('./models/Inversor');

const {
  Geolocalizacion,
  ConexionGrafo,
  Solicitud,
  MetricaDashboard
} = require('./models/Ecosystem');

const { Mensaje, ConsultaIA } = require('./models/Communication');
const ContactoPublico = require('./models/ContactPublicMessage');
const Notificacion = require('./models/Notification');
const AdminAuditLog = require('./models/AdminAuditLog');
const SupportReport = require('./models/SupportReport');

// ── Nuevos modelos de Aceleradora ────────────────────────────────────────────
const Convocatoria = require('./models/Convocatoria');
const Postulacion = require('./models/Postulacion');
const KpiStartup = require('./models/KpiStartup');
const DemodaySolicitud = require('./models/DemodaySolicitud');
const Perk = require('./models/Perk');
const Mentor = require('./models/Mentor');
const ReservaMentoria = require('./models/ReservaMentoria');
const ReclamacionPerk = require('./models/ReclamacionPerk');
const StartupPost = require('./models/StartupPost');
const StartupComentario = require('./models/StartupComentario');
const AceleradoraPost = require('./models/AceleradoraPost');
const AceleradoraComentario = require('./models/AceleradoraComentario');
const InversorPost = require('./models/InversorPost');
const InversorComentario = require('./models/InversorComentario');

// ── Asociaciones originales ───────────────────────────────────────────────────
User.hasMany(Session, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Session.belongsTo(User, { foreignKey: 'user_id' });

Role.hasMany(User, { foreignKey: 'role_id', onDelete: 'RESTRICT' });
User.belongsTo(Role, { foreignKey: 'role_id' });

User.hasOne(Startup, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Startup.belongsTo(User, { foreignKey: 'user_id' });

User.hasOne(Aceleradora, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Aceleradora.belongsTo(User, { foreignKey: 'user_id' });

User.hasOne(Inversor, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Inversor.belongsTo(User, { foreignKey: 'user_id' });

Sector.hasMany(Startup, { foreignKey: 'sector_id', onDelete: 'SET NULL' });
Startup.belongsTo(Sector, { foreignKey: 'sector_id' });

User.hasMany(Geolocalizacion, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Geolocalizacion.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(ConexionGrafo, { foreignKey: 'actor_origen_id', as: 'ConexionesSalientes', onDelete: 'CASCADE' });
User.hasMany(ConexionGrafo, { foreignKey: 'actor_destino_id', as: 'ConexionesEntrantes', onDelete: 'CASCADE' });
ConexionGrafo.belongsTo(User, { foreignKey: 'actor_origen_id', as: 'Origen' });
ConexionGrafo.belongsTo(User, { foreignKey: 'actor_destino_id', as: 'Destino' });

User.hasMany(Solicitud, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Solicitud.belongsTo(User, { foreignKey: 'user_id' });

Startup.hasMany(MetricaDashboard, { foreignKey: 'startup_id', onDelete: 'CASCADE' });
MetricaDashboard.belongsTo(Startup, { foreignKey: 'startup_id' });

User.hasMany(Mensaje, { foreignKey: 'emisor_id', onDelete: 'CASCADE' });
Mensaje.belongsTo(User, { foreignKey: 'emisor_id', as: 'Emisor' });

User.hasMany(ConsultaIA, { foreignKey: 'user_id', onDelete: 'CASCADE' });
ConsultaIA.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Notificacion, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Notificacion.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(AdminAuditLog, { foreignKey: 'admin_user_id', as: 'AdminAuditLogs', onDelete: 'CASCADE' });
AdminAuditLog.belongsTo(User, { foreignKey: 'admin_user_id', as: 'AdminActor' });

User.hasMany(SupportReport, { foreignKey: 'reporter_user_id', as: 'SupportReports', onDelete: 'CASCADE' });
SupportReport.belongsTo(User, { foreignKey: 'reporter_user_id', as: 'Reporter' });

// ── Asociaciones: Convocatorias y Postulaciones ───────────────────────────────
Aceleradora.hasMany(Convocatoria, { foreignKey: 'aceleradora_id', onDelete: 'CASCADE' });
Convocatoria.belongsTo(Aceleradora, { foreignKey: 'aceleradora_id' });

Convocatoria.hasMany(Postulacion, { foreignKey: 'convocatoria_id', onDelete: 'CASCADE' });
Postulacion.belongsTo(Convocatoria, { foreignKey: 'convocatoria_id' });

Startup.hasMany(Postulacion, { foreignKey: 'startup_id', onDelete: 'CASCADE' });
Postulacion.belongsTo(Startup, { foreignKey: 'startup_id' });

// ── Asociaciones: KPIs ────────────────────────────────────────────────────────
Startup.hasMany(KpiStartup, { foreignKey: 'startup_id', onDelete: 'CASCADE' });
KpiStartup.belongsTo(Startup, { foreignKey: 'startup_id' });

Convocatoria.hasMany(KpiStartup, { foreignKey: 'convocatoria_id', onDelete: 'SET NULL' });
KpiStartup.belongsTo(Convocatoria, { foreignKey: 'convocatoria_id' });

// ── Asociaciones: Demo Day ────────────────────────────────────────────────────
Inversor.hasMany(DemodaySolicitud, { foreignKey: 'inversor_id', onDelete: 'CASCADE' });
DemodaySolicitud.belongsTo(Inversor, { foreignKey: 'inversor_id' });

Startup.hasMany(DemodaySolicitud, { foreignKey: 'startup_id', onDelete: 'CASCADE' });
DemodaySolicitud.belongsTo(Startup, { foreignKey: 'startup_id' });

// ── Asociaciones: Perks y Mentorías ───────────────────────────────────────────
Aceleradora.hasMany(Perk, { foreignKey: 'aceleradora_id', onDelete: 'CASCADE' });
Perk.belongsTo(Aceleradora, { foreignKey: 'aceleradora_id' });

Perk.hasMany(ReclamacionPerk, { foreignKey: 'perk_id', onDelete: 'CASCADE' });
ReclamacionPerk.belongsTo(Perk, { foreignKey: 'perk_id' });

Startup.hasMany(ReclamacionPerk, { foreignKey: 'startup_id', onDelete: 'CASCADE' });
ReclamacionPerk.belongsTo(Startup, { foreignKey: 'startup_id' });

Aceleradora.hasMany(Mentor, { foreignKey: 'aceleradora_id', onDelete: 'CASCADE' });
Mentor.belongsTo(Aceleradora, { foreignKey: 'aceleradora_id' });

Mentor.hasMany(ReservaMentoria, { foreignKey: 'mentor_id', onDelete: 'CASCADE' });
ReservaMentoria.belongsTo(Mentor, { foreignKey: 'mentor_id' });

Startup.hasMany(ReservaMentoria, { foreignKey: 'startup_id', onDelete: 'CASCADE' });
ReservaMentoria.belongsTo(Startup, { foreignKey: 'startup_id' });

// ── Asociaciones: Startup Feed ────────────────────────────────────────────────
Startup.hasMany(StartupPost, { foreignKey: 'startup_id', onDelete: 'CASCADE' });
StartupPost.belongsTo(Startup, { foreignKey: 'startup_id' });

StartupPost.hasMany(StartupComentario, { foreignKey: 'post_id', onDelete: 'CASCADE' });
StartupComentario.belongsTo(StartupPost, { foreignKey: 'post_id' });

Startup.hasMany(StartupComentario, { foreignKey: 'startup_id', onDelete: 'CASCADE' });
StartupComentario.belongsTo(Startup, { foreignKey: 'startup_id' });

// ── Asociaciones: Aceleradora Feed ────────────────────────────────────────────
Aceleradora.hasMany(AceleradoraPost, { foreignKey: 'aceleradora_id', onDelete: 'CASCADE' });
AceleradoraPost.belongsTo(Aceleradora, { foreignKey: 'aceleradora_id' });

AceleradoraPost.hasMany(AceleradoraComentario, { foreignKey: 'post_id', onDelete: 'CASCADE' });
AceleradoraComentario.belongsTo(AceleradoraPost, { foreignKey: 'post_id' });

Aceleradora.hasMany(AceleradoraComentario, { foreignKey: 'aceleradora_id', onDelete: 'CASCADE' });
AceleradoraComentario.belongsTo(Aceleradora, { foreignKey: 'aceleradora_id' });

// ── Asociaciones: Inversor Feed ───────────────────────────────────────────────
Inversor.hasMany(InversorPost, { foreignKey: 'inversor_id', onDelete: 'CASCADE' });
InversorPost.belongsTo(Inversor, { foreignKey: 'inversor_id' });

InversorPost.hasMany(InversorComentario, { foreignKey: 'post_id', onDelete: 'CASCADE' });
InversorComentario.belongsTo(InversorPost, { foreignKey: 'post_id' });

Inversor.hasMany(InversorComentario, { foreignKey: 'inversor_id', onDelete: 'CASCADE' });
InversorComentario.belongsTo(Inversor, { foreignKey: 'inversor_id' });

module.exports = {
  sequelize,
  User,
  Role,
  Sector,
  Startup,
  Session,
  Aceleradora,
  Inversor,
  Geolocalizacion,
  ConexionGrafo,
  Solicitud,
  MetricaDashboard,
  Mensaje,
  ConsultaIA,
  ContactoPublico,
  Notificacion,
  AdminAuditLog,
  SupportReport,
  Convocatoria,
  Postulacion,
  KpiStartup,
  DemodaySolicitud,
  Perk,
  Mentor,
  ReservaMentoria,
  ReclamacionPerk,
  StartupPost,
  StartupComentario,
  AceleradoraPost,
  AceleradoraComentario,
  InversorPost,
  InversorComentario
};
