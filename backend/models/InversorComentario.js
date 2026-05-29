const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const InversorComentario = sequelize.define('InversorComentario', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  post_id: { type: DataTypes.INTEGER, allowNull: false },
  inversor_id: { type: DataTypes.INTEGER, allowNull: false },
  contenido: { type: DataTypes.TEXT, allowNull: false },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'inversor_comentarios', timestamps: false });

module.exports = InversorComentario;
