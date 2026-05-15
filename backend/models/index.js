/**
 * models/index.js — Barril de modelos: punto de entrada único para toda la BD
 *
 * Importa y re-exporta todos los modelos Sequelize en un solo objeto.
 * Las asociaciones entre modelos están definidas en models/Profiles.js
 * (mediante el patrón attachRoleValidation) y en el archivo raíz index.js
 * del backend (con los hasMany/belongsTo).
 *
 * Uso en controllers y services:
 *   const { User, Startup, Role } = require('../models');
 *
 * Modelos disponibles:
 *   sequelize      → instancia de Sequelize (para transacciones, sync, etc.)
 *   User           → tabla `users`
 *   Role           → tabla `roles`
 *   Sector         → tabla `sectores`
 *   Startup        → tabla `startups`
 *   Session        → tabla `sessions`
 *   Aceleradora    → tabla `aceleradoras`
 *   Inversor       → tabla `inversores`
 *   Geolocalizacion  → tabla `geolocalizacion`
 *   ConexionGrafo    → tabla `conexiones_grafo`
 *   Solicitud        → tabla `solicitudes`
 *   MetricaDashboard → tabla `metricas_dashboard`
 *   Mensaje          → tabla `mensajes`
 *   ConsultaIA       → tabla `consultas_ia`
 */
const sequelize = require('../config/db');

// ─── Modelos base ──────────────────────────────────────────────────────────────
const User        = require('./User');
const Role        = require('./Role');
const Sector      = require('./Sector');
const Startup     = require('./Startup');
const Session     = require('./Session');
const Aceleradora = require('./Aceleradora');
const Inversor    = require('./Inversor');

// ─── Modelos del ecosistema (agrupados en archivos multi-modelo) ───────────────
const { Geolocalizacion, ConexionGrafo, Solicitud, MetricaDashboard } = require('./Ecosystem');

// ─── Modelos de comunicación ───────────────────────────────────────────────────
const { Mensaje, ConsultaIA } = require('./Communication');

module.exports = {
  sequelize,
  User,
  Role,
  Sector,
  Startup,
  Session,
  Aceleradora,
  Inversor,
  Geolocalizacion,
  ConexionGrafo,
  Solicitud,
  MetricaDashboard,
  Mensaje,
  ConsultaIA
};
