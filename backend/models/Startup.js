const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Startup = sequelize.define('Startup', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false, unique: true },
  nombre_comercial: { type: DataTypes.STRING(255), allowNull: false },
  descripcion: { type: DataTypes.TEXT },
  fase: {
    type: DataTypes.ENUM('Idea', 'Semilla', 'Serie A', 'Serie B', 'Escalamiento'),
    allowNull: true
  },
  logo_url: { type: DataTypes.TEXT },
  sector_id: { type: DataTypes.INTEGER, allowNull: true }
}, {
  tableName: 'startups',
  timestamps: false
});

module.exports = Startup;
