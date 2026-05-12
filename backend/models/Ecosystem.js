const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Startup = require('./Startup');

const Geolocalizacion = sequelize.define('Geolocalizacion', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  latitud: { type: DataTypes.DECIMAL(10, 8), allowNull: false },
  longitud: { type: DataTypes.DECIMAL(11, 8), allowNull: false },
  direccion: { type: DataTypes.TEXT }
}, { tableName: 'geolocalizacion', timestamps: false });

const ConexionGrafo = sequelize.define('ConexionGrafo', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  actor_origen_id: { type: DataTypes.INTEGER, allowNull: false },
  actor_destino_id: { type: DataTypes.INTEGER, allowNull: false },
  tipo_vinculo: { type: DataTypes.ENUM('Inversion', 'Alianza', 'Mentoria'), allowNull: false }
}, { tableName: 'conexiones_grafo', timestamps: false });

const Solicitud = sequelize.define('Solicitud', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  tipo: { type: DataTypes.ENUM('startup', 'aceleradora', 'inversor'), allowNull: false },
  estado: { type: DataTypes.ENUM('Pendiente', 'Aprobada', 'Rechazada'), defaultValue: 'Pendiente' },
  comentarios_admin: { type: DataTypes.TEXT }
}, { tableName: 'solicitudes', timestamps: false });

const MetricaDashboard = sequelize.define('MetricaDashboard', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  startup_id: { type: DataTypes.INTEGER, allowNull: false },
  num_empleados: { type: DataTypes.INTEGER },
  valoracion_estimada: { type: DataTypes.DECIMAL(15, 2) },
  fecha_reporte: { type: DataTypes.DATEONLY }
}, { tableName: 'metricas_dashboard', timestamps: false });

module.exports = { Geolocalizacion, ConexionGrafo, Solicitud, MetricaDashboard };
