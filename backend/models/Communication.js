const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Mensaje = sequelize.define('Mensaje', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
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
  pregunta_usuario: { type: DataTypes.TEXT, allowNull: false },
  respuesta_ia: { type: DataTypes.TEXT('long'), allowNull: false },
  modelo: { type: DataTypes.STRING(100) }
}, { 
  tableName: 'consultas_ia',
  timestamps: false 
});

// Relaciones con ON DELETE CASCADE
User.hasMany(Mensaje, { foreignKey: 'emisor_id', onDelete: 'CASCADE' });
Mensaje.belongsTo(User, { foreignKey: 'emisor_id', as: 'Emisor' });

User.hasMany(ConsultaIA, { foreignKey: 'user_id', onDelete: 'CASCADE' });
ConsultaIA.belongsTo(User, { foreignKey: 'user_id' });

module.exports = { Mensaje, ConsultaIA };
