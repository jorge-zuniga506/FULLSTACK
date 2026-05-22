const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Notificacion = sequelize.define('Notificacion', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  titulo: { type: DataTypes.STRING(200), allowNull: false },
  mensaje: { type: DataTypes.TEXT, allowNull: false },
  tipo: { type: DataTypes.STRING(100), allowNull: true },
  leido: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
  tableName: 'notificaciones',
  timestamps: true,
  createdAt: 'fecha_creacion',
  updatedAt: false
});

module.exports = Notificacion;
