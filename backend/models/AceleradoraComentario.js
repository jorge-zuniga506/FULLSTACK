const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const AceleradoraComentario = sequelize.define('AceleradoraComentario', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  post_id: { type: DataTypes.INTEGER, allowNull: false },
  aceleradora_id: { type: DataTypes.INTEGER, allowNull: false },
  contenido: { type: DataTypes.TEXT, allowNull: false },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'aceleradora_comentarios', timestamps: false });

module.exports = AceleradoraComentario;
