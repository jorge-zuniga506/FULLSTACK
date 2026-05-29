const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const DemodaySolicitud = sequelize.define('DemodaySolicitud', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  inversor_id: { type: DataTypes.INTEGER, allowNull: false },
  startup_id: { type: DataTypes.INTEGER, allowNull: false },
  mensaje: { type: DataTypes.TEXT },
  estado: {
    type: DataTypes.ENUM('pendiente', 'aceptada', 'rechazada'),
    defaultValue: 'pendiente'
  },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'demoday_solicitudes',
  timestamps: false
});

module.exports = DemodaySolicitud;
