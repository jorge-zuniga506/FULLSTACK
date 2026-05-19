/**
 * models/Ecosystem.js — Modelos del ecosistema de relaciones entre entidades
 *
 * Agrupa 4 modelos relacionados con la infraestructura del grafo del ecosistema:
 *
 * ── Geolocalizacion ─────────────────────────────────────────────────────────
 * Tabla: `geolocalizacion`
 * Almacena la posición geográfica de los usuarios/entidades.
 * Se usa para mostrar marcadores en el mapa del ecosistema.
 * Campos: user_id, latitud (10,8), longitud (11,8), direccion
 *
 * ── ConexionGrafo ────────────────────────────────────────────────────────────
 * Tabla: `conexiones_grafo`
 * Representa las aristas (relaciones) del grafo del ecosistema.
 * Cada conexión tiene:
 *   actor_origen_id  → nodo de origen (FK a users)
 *   actor_destino_id → nodo de destino (FK a users)
 *   tipo_vinculo     → tipo de relación: ENUM('Inversion', 'Alianza', 'Mentoria')
 * Se usa en el Explorer del frontend para dibujar las aristas del grafo SVG.
 *
 * ── Solicitud ────────────────────────────────────────────────────────────────
 * Tabla: `solicitudes`
 * Gestiona las solicitudes de incorporación al ecosistema.
 * Un usuario puede solicitar unirse como 'startup', 'aceleradora' o 'inversor'.
 * Estado ENUM('Pendiente', 'Aprobada', 'Rechazada') — default: 'Pendiente'
 * Los administradores pueden aprobar/rechazar via EcosystemRoutes.
 *
 * ── MetricaDashboard ─────────────────────────────────────────────────────────
 * Tabla: `metricas_dashboard`
 * KPIs periódicos de una startup: empleados, valoración, fecha de reporte.
 * Permite tener un historial de métricas por startup (hasMany desde Startup).
 *
 * Asociaciones (definidas en models/index.js raíz):
 *   User   hasMany Geolocalizacion  (CASCADE)
 *   User   hasMany ConexionGrafo    (como origen: 'ConexionesSalientes')
 *   User   hasMany ConexionGrafo    (como destino: 'ConexionesEntrantes')
 *   User   hasMany Solicitud        (CASCADE)
 *   Startup hasMany MetricaDashboard (CASCADE)
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// ─── Geolocalizacion ──────────────────────────────────────────────────────────
const Geolocalizacion = sequelize.define('Geolocalizacion', {
  id:        { type: DataTypes.INTEGER,        primaryKey: true, autoIncrement: true },
  user_id:   { type: DataTypes.INTEGER,        allowNull: false },
  latitud:   { type: DataTypes.DECIMAL(10, 8), allowNull: false }, // 8 decimales: ~1mm de precisión
  longitud:  { type: DataTypes.DECIMAL(11, 8), allowNull: false },
  direccion: { type: DataTypes.TEXT }                              // Dirección textual opcional
}, { tableName: 'geolocalizacion', timestamps: false });

// ─── ConexionGrafo ────────────────────────────────────────────────────────────
const ConexionGrafo = sequelize.define('ConexionGrafo', {
  id:               { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  actor_origen_id:  { type: DataTypes.INTEGER, allowNull: false }, // Nodo de origen de la arista
  actor_destino_id: { type: DataTypes.INTEGER, allowNull: false }, // Nodo de destino de la arista
  tipo_vinculo:     {
    type: DataTypes.ENUM('Inversion', 'Alianza', 'Mentoria'),
    allowNull: false
    // Inversion: inversor → startup
    // Alianza:   startup  ↔ startup / aceleradora
    // Mentoria:  mentor   → startup
  }
}, { tableName: 'conexiones_grafo', timestamps: false });

// ─── Solicitud ────────────────────────────────────────────────────────────────
const Solicitud = sequelize.define('Solicitud', {
  id:                  { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id:             { type: DataTypes.INTEGER, allowNull: false },
  tipo:                { type: DataTypes.ENUM('startup', 'aceleradora', 'inversor'), allowNull: false },
  estado:              {
    type: DataTypes.ENUM('Pendiente', 'Aprobada', 'Rechazada'),
    defaultValue: 'Pendiente' // Toda solicitud empieza como Pendiente
  },
  comentarios_admin:   { type: DataTypes.TEXT } // Nota del admin al aprobar/rechazar
}, { tableName: 'solicitudes', timestamps: false });

// ─── MetricaDashboard ─────────────────────────────────────────────────────────
const MetricaDashboard = sequelize.define('MetricaDashboard', {
  id:                   { type: DataTypes.INTEGER,        primaryKey: true, autoIncrement: true },
  startup_id:           { type: DataTypes.INTEGER,        allowNull: false }, // FK a startups
  num_empleados:        { type: DataTypes.INTEGER        },                   // Headcount en la fecha
  valoracion_estimada:  { type: DataTypes.DECIMAL(15, 2) },                   // En USD, 2 decimales
  fecha_reporte:        { type: DataTypes.DATEONLY       }                    // Solo fecha (sin hora)
}, { tableName: 'metricas_dashboard', timestamps: false });

module.exports = { Geolocalizacion, ConexionGrafo, Solicitud, MetricaDashboard };
