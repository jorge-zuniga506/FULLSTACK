/**
 * models/Communication.js — Modelos de mensajería y consultas IA
 *
 * Agrupa 2 modelos relacionados con la comunicación en la plataforma:
 *
 * ── Mensaje ──────────────────────────────────────────────────────────────────
 * Tabla: `mensajes`
 * Mensajes de un sistema de chat entre usuarios del ecosistema.
 * Campos:
 *   emisor_id  → FK al usuario que envió el mensaje (users.id)
 *   chat_id    → ID del chat/conversación al que pertenece (sin modelo Chat por ahora)
 *   contenido  → Texto del mensaje (TEXT, requerido)
 *   leido      → Boolean, false por defecto (para marcar mensajes no leídos)
 *   fecha_envio → timestamp automático (createdAt mapeado a 'fecha_envio')
 *
 * Opciones especiales:
 *   timestamps: true + createdAt: 'fecha_envio' → guarda automáticamente
 *   la hora de envío en la columna 'fecha_envio'
 *   updatedAt: false → los mensajes no se actualizan (inmutables una vez enviados)
 *
 * ── ConsultaIA ────────────────────────────────────────────────────────────────
 * Tabla: `consultas_ia`
 * Registro de consultas que los usuarios hacen al asistente IA de la plataforma.
 * Campos:
 *   user_id          → FK al usuario que hizo la consulta
 *   pregunta_usuario → Pregunta en texto libre (TEXT)
 *   respuesta_ia     → Respuesta generada por la IA (TEXT long, puede ser extensa)
 *   modelo           → Nombre del modelo IA usado (ej: "gemini-pro", "gpt-4")
 *
 * Opciones: timestamps: false → el registro de fecha puede hacerse via trigger en BD
 *
 * Asociaciones (definidas en models/index.js raíz):
 *   User hasMany Mensaje   (por emisor_id, CASCADE)
 *   User hasMany ConsultaIA (por user_id, CASCADE)
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// ─── Mensaje ──────────────────────────────────────────────────────────────────
const Mensaje = sequelize.define('Mensaje', {
  id:        { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  emisor_id: { type: DataTypes.INTEGER, allowNull: false },
  chat_id:   { type: DataTypes.INTEGER, allowNull: false },  // Agrupa mensajes de una conversación
  contenido: { type: DataTypes.TEXT,    allowNull: false },  // Cuerpo del mensaje
  leido:     { type: DataTypes.BOOLEAN, defaultValue: false } // false = mensaje sin leer
}, {
  tableName:  'mensajes',
  timestamps: true,
  createdAt:  'fecha_envio', // Sequelize escribe en esta columna al crear
  updatedAt:  false          // Mensajes son inmutables (no se editan)
});

// ─── ConsultaIA ───────────────────────────────────────────────────────────────
const ConsultaIA = sequelize.define('ConsultaIA', {
  id:               { type: DataTypes.INTEGER,       primaryKey: true, autoIncrement: true },
  user_id:          { type: DataTypes.INTEGER,       allowNull: false },
  pregunta_usuario: { type: DataTypes.TEXT,          allowNull: false }, // Pregunta del usuario
  respuesta_ia:     { type: DataTypes.TEXT('long'),  allowNull: false }, // TEXT LONG: hasta 4GB
  modelo:           { type: DataTypes.STRING(100) }                      // Ej: "gemini-1.5-pro"
}, {
  tableName:  'consultas_ia',
  timestamps: false
});

module.exports = { Mensaje, ConsultaIA };
