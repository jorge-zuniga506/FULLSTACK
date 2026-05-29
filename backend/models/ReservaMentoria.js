const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ReservaMentoria = sequelize.define('ReservaMentoria', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  mentor_id: { type: DataTypes.INTEGER, allowNull: false },
  startup_id: { type: DataTypes.INTEGER, allowNull: false },
  fecha_hora: { type: DataTypes.DATE },
  estado: {
    type: DataTypes.ENUM('pendiente', 'confirmada', 'cancelada'),
    defaultValue: 'pendiente'
  },
  notas: { type: DataTypes.TEXT },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'reservas_mentoria',
  timestamps: false
});

module.exports = ReservaMentoria;
