/**
 * models/Role.js — Modelo Sequelize de roles
 *
 * Tabla: `roles`
 *
 * Roles del sistema (insertados automáticamente al arrancar en app.js):
 *   admin       → administrador de la plataforma
 *   startup     → usuario de tipo startup
 *   aceleradora → usuario de tipo aceleradora
 *   inversor    → usuario de tipo inversor
 *
 * Campos:
 *   id     — PK autoincremental
 *   nombre — nombre único del rol (max 50 chars)
 *
 * Opciones:
 *   timestamps: false → la tabla de roles no tiene created_at ni updated_at
 *
 * Asociaciones (definidas en models/index.js raíz):
 *   Role hasMany User (onDelete: 'RESTRICT') → no se puede eliminar un rol con usuarios
 *
 * Nota de seguridad:
 *   Los roles no deben modificarse en runtime. Son una tabla de catálogo fija.
 *   El cambio de role_id en User está bloqueado a nivel de hooks (User.js).
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Role = sequelize.define('Role', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true // No puede haber dos roles con el mismo nombre
  }
}, {
  tableName:  'roles',
  timestamps: false // Tabla de catálogo — no requiere auditoría de tiempo
});

module.exports = Role;
