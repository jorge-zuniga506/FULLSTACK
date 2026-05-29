const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Perk = sequelize.define('Perk', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  aceleradora_id: { type: DataTypes.INTEGER, allowNull: false },
  titulo: { type: DataTypes.STRING(255), allowNull: false },
  descripcion: { type: DataTypes.TEXT },
  tipo: {
    type: DataTypes.ENUM('credito_cloud', 'espacio_trabajo', 'beneficio_comercial', 'otro'),
    defaultValue: 'otro'
  },
  valor: { type: DataTypes.STRING(100) },
  activo: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
  tableName: 'perks',
  timestamps: false
});

module.exports = Perk;
