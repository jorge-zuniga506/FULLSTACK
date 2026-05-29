const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const StartupComentario = sequelize.define('StartupComentario', {
  id:         { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  post_id:    { type: DataTypes.INTEGER, allowNull: false },
  startup_id: { type: DataTypes.INTEGER, allowNull: false },
  contenido:  { type: DataTypes.TEXT, allowNull: false },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'startup_comentarios', timestamps: false });

module.exports = StartupComentario;
