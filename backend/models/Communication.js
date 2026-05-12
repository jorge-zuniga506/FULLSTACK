const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Mensaje = sequelize.define('Mensaje', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  emisor_id: { type: DataTypes.INTEGER, allowNull: false },
  chat_id: { type: DataTypes.INTEGER, allowNull: false },
  contenido: { type: DataTypes.TEXT, allowNull: false },
  leido: { type: DataTypes.BOOLEAN, defaultValue: false }
}, { 
  tableName: 'mensajes',
  timestamps: true,
  createdAt: 'fecha_envio',
  updatedAt: false
});

const ConsultaIA = sequelize.define('ConsultaIA', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  pregunta_usuario: { type: DataTypes.TEXT, allowNull: false },
  respuesta_ia: { type: DataTypes.TEXT('long'), allowNull: false },
  modelo: { type: DataTypes.STRING(100) }
}, { 
  tableName: 'consultas_ia',
  timestamps: false 
});

module.exports = { Mensaje, ConsultaIA };
