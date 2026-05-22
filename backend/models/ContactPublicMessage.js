const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ContactoPublico = sequelize.define('ContactoPublico', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(150), allowNull: false },
  email: { type: DataTypes.STRING(150), allowNull: false },
  asunto: { type: DataTypes.STRING(200), allowNull: false },
  mensaje: { type: DataTypes.TEXT, allowNull: false },
  leido: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
  tableName: 'mensajes_contacto_publico',
  timestamps: true,
  createdAt: 'fecha_envio',
  updatedAt: false
});

module.exports = ContactoPublico;
