const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Postulacion = sequelize.define('Postulacion', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  convocatoria_id: { type: DataTypes.INTEGER, allowNull: false },
  startup_id: { type: DataTypes.INTEGER, allowNull: false },
  pitch_deck_url: { type: DataTypes.TEXT },
  mensaje: { type: DataTypes.TEXT },
  estado: {
    type: DataTypes.ENUM('Recibida', 'Entrevistada', 'Aceptada', 'Rechazada'),
    defaultValue: 'Recibida'
  },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'postulaciones',
  timestamps: false
});

module.exports = Postulacion;
