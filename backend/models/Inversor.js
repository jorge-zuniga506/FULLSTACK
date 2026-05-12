const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Inversor = sequelize.define('Inversor', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false, unique: true },
  nombre: { type: DataTypes.STRING(255), allowNull: false },
  presupuesto_min: { type: DataTypes.DECIMAL(15, 2) },
  presupuesto_max: { type: DataTypes.DECIMAL(15, 2) },
  sectores_interes: { type: DataTypes.JSON }
}, {
  tableName: 'inversores',
  timestamps: false
});

module.exports = Inversor;
