const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const StartupPost = sequelize.define('StartupPost', {
  id:         { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  startup_id: { type: DataTypes.INTEGER, allowNull: false },
  contenido:  { type: DataTypes.TEXT, allowNull: false },
  imagen_url: { type: DataTypes.TEXT, allowNull: true },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'startup_posts', timestamps: false });

module.exports = StartupPost;
