const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Convocatoria = sequelize.define('Convocatoria', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  aceleradora_id: { type: DataTypes.INTEGER, allowNull: false },
  nombre_batch: { type: DataTypes.STRING(255), allowNull: false },
  descripcion: { type: DataTypes.TEXT },
  requisitos: { type: DataTypes.TEXT },
  fecha_inicio: { type: DataTypes.DATEONLY },
  fecha_cierre: { type: DataTypes.DATEONLY },
  estado: {
    type: DataTypes.ENUM('borrador', 'abierta', 'cerrada'),
    defaultValue: 'borrador'
  },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'convocatorias',
  timestamps: false
});

module.exports = Convocatoria;
