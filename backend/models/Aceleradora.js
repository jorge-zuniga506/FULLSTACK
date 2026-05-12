const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Aceleradora = sequelize.define('Aceleradora', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false, unique: true },
  nombre: { type: DataTypes.STRING(255), allowNull: false },
  programas_activos: { type: DataTypes.TEXT },
  sitio_web: { type: DataTypes.STRING(255) }
}, {
  tableName: 'aceleradoras',
  timestamps: false
});

module.exports = Aceleradora;
