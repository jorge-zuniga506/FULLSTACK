/**
 * routes/EcosystemRoutes.js — Rutas del ecosistema de relaciones
 *
 * Prefijo: /api/ecosistemas (montado en app.js)
 *
 * GEOLOCALIZACION — posiciones geográficas de actores:
 *   POST   /crear-ecosystem                        → crearGeolocalizacion
 *   GET    /obtener-ecosystem                      → ObtenerGeolocalizaciones
 *   PUT    /editar-ecosystem/:id_geolocalizacion    → editarGeolocalizacion
 *   DELETE /eliminar-ecosystem/:id_geolocalizacion → eliminarGeolocalizacion
 *
 * CONEXION GRAFO — aristas del grafo del ecosistema:
 *   POST   /conexiones                    → crearConexionGrafo
 *   GET    /conexiones                    → ObtenerConexionesGrafo
 *   PUT    /conexiones/:id_conexionGrafo  → editarConexionGrafo
 *   DELETE /conexiones/:id_conexionGrafo  → eliminarConexionGrafo
 *
 * METRICAS — KPIs periódicos de startups:
 *   POST   /metricas                        → crearMetricaDashboard
 *   GET    /metricas                        → ObtenerMetricasDashboards
 *   PUT    /metricas/:id_metricaDashboard   → actualizarMetricaDashboard
 *   DELETE /metricas/:id_metricaDashboard   → eliminarMetricaDashboard
 *
 * SOLICITUDES — workflow de aprobación de nuevos actores:
 *   POST   /solicitudes                          → CrearSolicitud
 *   GET    /solicitudes                          → ObtenerSolicitudes
 *   PUT    /solicitudes/:id_solicitud            → actualizarSolicitud
 *   DELETE /solicitudes/:id_solicitud            → eliminarSolicitud
 *   PATCH  /solicitudes/:id_solicitud/aprobar    → aprobarSolicitud (estado → Aprobada)
 *   PATCH  /solicitudes/:id_solicitud/rechazar   → rechazarSolicitud (estado → Rechazada)
 */
const express = require('express');
const router  = express.Router();
const {
  crearGeolocalizacion, ObtenerGeolocalizaciones, editarGeolocalizacion, eliminarGeolocalizacion,
  CrearSolicitud, ObtenerSolicitudes, actualizarSolicitud, eliminarSolicitud,
  aprobarSolicitud, rechazarSolicitud,
  crearConexionGrafo, ObtenerConexionesGrafo, editarConexionGrafo, eliminarConexionGrafo,
  crearMetricaDashboard, ObtenerMetricasDashboards, actualizarMetricaDashboard, eliminarMetricaDashboard
} = require('../controllers/EcosystemController');

// ── Geolocalización ────────────────────────────────────────────────────────────
router.post  ('/crear-ecosystem',                        crearGeolocalizacion);
router.get   ('/obtener-ecosystem',                      ObtenerGeolocalizaciones);
router.put   ('/editar-ecosystem/:id_geolocalizacion',    editarGeolocalizacion);
router.delete('/eliminar-ecosystem/:id_geolocalizacion', eliminarGeolocalizacion);

// ── Conexiones del grafo ──────────────────────────────────────────────────────
router.post  ('/conexiones',                 crearConexionGrafo);
router.get   ('/conexiones',                 ObtenerConexionesGrafo);
router.put   ('/conexiones/:id_conexionGrafo', editarConexionGrafo);
router.delete('/conexiones/:id_conexionGrafo', eliminarConexionGrafo);

// ── Métricas del dashboard ────────────────────────────────────────────────────
router.post  ('/metricas',                       crearMetricaDashboard);
router.get   ('/metricas',                       ObtenerMetricasDashboards);
router.put   ('/metricas/:id_metricaDashboard',  actualizarMetricaDashboard);
router.delete('/metricas/:id_metricaDashboard',  eliminarMetricaDashboard);

// ── Solicitudes de incorporación ──────────────────────────────────────────────
router.post  ('/solicitudes',                       CrearSolicitud);
router.get   ('/solicitudes',                       ObtenerSolicitudes);
router.put   ('/solicitudes/:id_solicitud',         actualizarSolicitud);
router.delete('/solicitudes/:id_solicitud',         eliminarSolicitud);
// Acciones especiales (PATCH para cambios parciales de estado)
router.patch ('/solicitudes/:id_solicitud/aprobar', aprobarSolicitud);
router.patch ('/solicitudes/:id_solicitud/rechazar', rechazarSolicitud);

module.exports = router;
