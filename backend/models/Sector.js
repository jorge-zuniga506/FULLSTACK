const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Sector = sequelize.define('Sector', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  color_hex: {
    type: DataTypes.STRING(7),
    allowNull: false
  }
}, {
  tableName: 'sectores',
  timestamps: false
});

module.exports = Sector;
