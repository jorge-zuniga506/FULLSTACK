const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Startup = require('./Startup');

const Geolocalizacion = sequelize.define('Geolocalizacion', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  latitud: { type: DataTypes.DECIMAL(10, 8), allowNull: false },
  longitud: { type: DataTypes.DECIMAL(11, 8), allowNull: false },
  direccion: { type: DataTypes.TEXT }
}, { tableName: 'geolocalizacion', timestamps: false });

const ConexionGrafo = sequelize.define('ConexionGrafo', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  tipo_vinculo: { type: DataTypes.ENUM('Inversion', 'Alianza', 'Mentoria'), allowNull: false }
}, { tableName: 'conexiones_grafo', timestamps: false });

const Solicitud = sequelize.define('Solicitud', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  tipo: { type: DataTypes.ENUM('startup', 'aceleradora', 'inversor'), allowNull: false },
  estado: { type: DataTypes.ENUM('Pendiente', 'Aprobada', 'Rechazada'), defaultValue: 'Pendiente' },
  comentarios_admin: { type: DataTypes.TEXT }
}, { tableName: 'solicitudes', timestamps: false });

const MetricaDashboard = sequelize.define('MetricaDashboard', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  num_empleados: { type: DataTypes.INTEGER },
  valoracion_estimada: { type: DataTypes.DECIMAL(15, 2) },
  fecha_reporte: { type: DataTypes.DATEONLY }
}, { tableName: 'metricas_dashboard', timestamps: false });

// Relaciones con ON DELETE CASCADE
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

module.exports = { Geolocalizacion, ConexionGrafo, Solicitud, MetricaDashboard };
