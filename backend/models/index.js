/**
 * models/index.js — Barril de modelos: punto de entrada único para toda la BD
 *
 * Importa y re-exporta todos los modelos Sequelize en un solo objeto.
 * Define todas las asociaciones (relaciones hasMany/belongsTo/hasOne) entre los modelos.
 */
const sequelize = require('../config/db');
const User = require('./User');
const Role = require('./Role');
const Sector = require('./Sector');
const { Session, Startup, Aceleradora, Inversor } = require('./Profiles');
const { Geolocalizacion, ConexionGrafo, Solicitud, MetricaDashboard } = require('./Ecosystem');
const { Mensaje, ConsultaIA } = require('./Communication');

const db = {
  sequelize,
  User,
  Role,
  Sector,
  Session,
  Startup,
  Aceleradora,
  Inversor,
  Geolocalizacion,
  ConexionGrafo,
  Solicitud,
  MetricaDashboard,
  Mensaje,
  ConsultaIA
};

// ─── Definir asociaciones entre modelos ────────────────────────────────────────

// Relaciones de Usuario y Sesión
User.hasMany(Session, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Session.belongsTo(User, { foreignKey: 'user_id' });

// Relaciones de Rol y Usuario
Role.hasMany(User, { foreignKey: 'role_id', onDelete: 'RESTRICT' });
User.belongsTo(Role, { foreignKey: 'role_id' });

// Relaciones de Usuario con perfiles específicos
User.hasOne(Startup, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Startup.belongsTo(User, { foreignKey: 'user_id' });

User.hasOne(Aceleradora, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Aceleradora.belongsTo(User, { foreignKey: 'user_id' });

User.hasOne(Inversor, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Inversor.belongsTo(User, { foreignKey: 'user_id' });

// Relaciones de Sector y Startup
Sector.hasMany(Startup, { foreignKey: 'sector_id', onDelete: 'SET NULL' });
Startup.belongsTo(Sector, { foreignKey: 'sector_id' });

// Relaciones de Usuario con Geolocalización
User.hasMany(Geolocalizacion, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Geolocalizacion.belongsTo(User, { foreignKey: 'user_id' });

// Relaciones de Usuario con Conexiones en el Grafo
User.hasMany(ConexionGrafo, { foreignKey: 'actor_origen_id', as: 'ConexionesSalientes', onDelete: 'CASCADE' });
User.hasMany(ConexionGrafo, { foreignKey: 'actor_destino_id', as: 'ConexionesEntrantes', onDelete: 'CASCADE' });
ConexionGrafo.belongsTo(User, { foreignKey: 'actor_origen_id', as: 'Origen' });
ConexionGrafo.belongsTo(User, { foreignKey: 'actor_destino_id', as: 'Destino' });

// Relaciones de Usuario con Solicitudes
User.hasMany(Solicitud, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Solicitud.belongsTo(User, { foreignKey: 'user_id' });

// Relaciones de Startup con Métricas del Dashboard
Startup.hasMany(MetricaDashboard, { foreignKey: 'startup_id', onDelete: 'CASCADE' });
MetricaDashboard.belongsTo(Startup, { foreignKey: 'startup_id' });

// Relaciones de Usuario con Mensajes
User.hasMany(Mensaje, { foreignKey: 'emisor_id', onDelete: 'CASCADE' });
Mensaje.belongsTo(User, { foreignKey: 'emisor_id', as: 'Emisor' });

// Relaciones de Usuario con Consultas a IA
User.hasMany(ConsultaIA, { foreignKey: 'user_id', onDelete: 'CASCADE' });
ConsultaIA.belongsTo(User, { foreignKey: 'user_id' });

module.exports = db;
