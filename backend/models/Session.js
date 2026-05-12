const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Session = sequelize.define('Session', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  token_jwt: { type: DataTypes.TEXT, allowNull: false },
  expiracion: { type: DataTypes.DATE, allowNull: false },
  es_valido: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
  tableName: 'sessions',
  timestamps: false
});

module.exports = Session;
