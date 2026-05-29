const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Mentor = sequelize.define('Mentor', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  aceleradora_id: { type: DataTypes.INTEGER, allowNull: false },
  nombre: { type: DataTypes.STRING(255), allowNull: false },
  especialidad: { type: DataTypes.STRING(255) },
  linkedin_url: { type: DataTypes.TEXT },
  foto_url: { type: DataTypes.TEXT },
  activo: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
  tableName: 'mentores',
  timestamps: false
});

module.exports = Mentor;
