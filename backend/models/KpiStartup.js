const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const KpiStartup = sequelize.define('KpiStartup', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  startup_id: { type: DataTypes.INTEGER, allowNull: false },
  convocatoria_id: { type: DataTypes.INTEGER, allowNull: true },
  periodo: { type: DataTypes.STRING(20), allowNull: false },
  nuevos_usuarios: { type: DataTypes.INTEGER, defaultValue: 0 },
  ventas_mensuales: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  costo_adquisicion: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  notas: { type: DataTypes.TEXT },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'kpis_startup',
  timestamps: false
});

module.exports = KpiStartup;
