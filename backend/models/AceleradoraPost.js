const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const AceleradoraPost = sequelize.define('AceleradoraPost', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  aceleradora_id: { type: DataTypes.INTEGER, allowNull: false },
  contenido: { type: DataTypes.TEXT, allowNull: false },
  imagen_url: { type: DataTypes.TEXT, allowNull: true },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'aceleradora_posts', timestamps: false });

module.exports = AceleradoraPost;
