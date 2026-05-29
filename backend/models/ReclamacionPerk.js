const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ReclamacionPerk = sequelize.define('ReclamacionPerk', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  perk_id: { type: DataTypes.INTEGER, allowNull: false },
  startup_id: { type: DataTypes.INTEGER, allowNull: false },
  estado: {
    type: DataTypes.ENUM('pendiente', 'aprobada', 'rechazada'),
    defaultValue: 'pendiente'
  },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'reclamaciones_perks',
  timestamps: false
});

module.exports = ReclamacionPerk;
