/**
 * models/Sector.js — Modelo Sequelize de sectores económicos
 *
 * Tabla: `sectores`
 *
 * Representa los sectores de actividad económica a los que pertenecen las startups.
 * Ejemplos: Fintech, Healthtech, Agritech, Edtech, Logística, Legaltech, Cleantech.
 *
 * Campos:
 *   id        — PK autoincremental
 *   nombre    — Nombre del sector (ej: "Fintech"), requerido
 *   color_hex — Color de identificación visual del sector en el mapa (ej: "#00aaff")
 *               Se usa en el frontend para colorear nodos del grafo por sector
 *
 * Opciones:
 *   timestamps: false → tabla de catálogo, sin auditoría de tiempo
 *
 * Asociaciones (definidas en models/index.js raíz):
 *   Sector hasMany Startup (foreignKey: 'sector_id', onDelete: 'SET NULL')
 *   → Si se elimina un sector, las startups quedan con sector_id = NULL
 *   → Esto evita borrar startups en cascada al eliminar un sector
 */
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
    type: DataTypes.STRING(7), // Formato: "#RRGGBB" (exactamente 7 chars incluyendo #)
    allowNull: false
  }
}, {
  tableName:  'sectores',
  timestamps: false
});

module.exports = Sector;
