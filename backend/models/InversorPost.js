const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const InversorPost = sequelize.define('InversorPost', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  inversor_id: { type: DataTypes.INTEGER, allowNull: false },
  contenido: { type: DataTypes.TEXT, allowNull: false },
  imagen_url: { type: DataTypes.TEXT, allowNull: true },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'inversor_posts', timestamps: false });

module.exports = InversorPost;
