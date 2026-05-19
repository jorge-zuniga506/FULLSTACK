/**
 * controllers/EcosystemController.js — Controlador del ecosistema de relaciones
 *
 * Capa HTTP para los 4 grupos de recursos del ecosistema:
 *   Geolocalizacion, ConexionGrafo, Solicitud, MetricaDashboard
 *
 * Patrón general de cada función:
 *   1. Llama al método correspondiente de EcosystemService
 *   2. Retorna 200/201 con los datos si todo sale bien
 *   3. Si el service lanza Error "X no encontrada" → 404
 *   4. Cualquier otro error → 500
 *
 * Rutas (montadas en /api/ecosistemas — ver EcosystemRoutes.js):
 *
 * GEOLOCALIZACION:
 *   POST   /crear-ecosystem                  → crearGeolocalizacion
 *   GET    /obtener-ecosystem                → ObtenerGeolocalizaciones
 *   PUT    /editar-ecosytem/:id_geolocalizacion → editarGeolocalizacion
 *   DELETE /eliminar-ecosystem/:id_geolocalizacion → eliminarGeolocalizacion
 *
 * CONEXION GRAFO:
 *   POST   /conexiones                       → crearConexionGrafo
 *   GET    /conexiones                       → ObtenerConexionesGrafo
 *   PUT    /conexiones/:id_conexionGrafo     → editarConexionGrafo
 *   DELETE /conexiones/:id_conexionGrafo     → eliminarConexionGrafo
 *
 * SOLICITUDES:
 *   POST   /solicitudes                      → CrearSolicitud
 *   GET    /solicitudes                      → ObtenerSolicitudes
 *   PUT    /solicitudes/:id_solicitud        → actualizarSolicitud
 *   DELETE /solicitudes/:id_solicitud        → eliminarSolicitud
 *   PATCH  /solicitudes/:id_solicitud/aprobar  → aprobarSolicitud
 *   PATCH  /solicitudes/:id_solicitud/rechazar → rechazarSolicitud
 *
 * METRICAS DASHBOARD:
 *   POST   /metricas                         → crearMetricaDashboard
 *   GET    /metricas                         → ObtenerMetricasDashboards
 *   PUT    /metricas/:id_metricaDashboard    → actualizarMetricaDashboard
 *   DELETE /metricas/:id_metricaDashboard    → eliminarMetricaDashboard
 */
const EcosystemService = require('../services/EcosystemService');

// ── GEOLOCALIZACION ───────────────────────────────────────────────────────────

/** Crea una nueva entrada de geolocalización para un usuario */
const crearGeolocalizacion = async (req, res) => {
  try {
    const geo = await EcosystemService.crearGeolocalizacion(req.body);
    res.status(201).json({ message: 'Geolocalizacion creada exitosamente', geolocalizacion: geo });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la geolocalizacion', error: error.message });
  }
};

/** Lista todas las geolocalizaciones */
const ObtenerGeolocalizaciones = async (req, res) => {
  try {
    const geos = await EcosystemService.obtenerGeolocalizaciones();
    res.status(200).json(geos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las geolocalizaciones', error: error.message });
  }
};

/** Elimina una geolocalización por :id_geolocalizacion → 404 si no existe */
const eliminarGeolocalizacion = async (req, res) => {
  try {
    await EcosystemService.eliminarGeolocalizacion(req.params.id_geolocalizacion);
    res.status(200).json({ message: 'Geolocalizacion eliminada correctamente' });
  } catch (error) {
    if (error.message === 'Geolocalizacion no encontrada') return res.status(404).json({ message: error.message });
    res.status(500).json({ message: 'Error al eliminar la geolocalizacion', error: error.message });
  }
};

/** Edita latitud, longitud o dirección de una geolocalización */
const editarGeolocalizacion = async (req, res) => {
  try {
    const editada = await EcosystemService.editarGeolocalizacion(req.params.id_geolocalizacion, req.body);
    res.status(200).json(editada);
  } catch (error) {
    if (error.message === 'Geolocalizacion no encontrada') return res.status(404).json({ message: error.message });
    res.status(500).json({ message: 'Error al editar la geolocalizacion', error: error.message });
  }
};

// ── CONEXION GRAFO ────────────────────────────────────────────────────────────

/** Crea una arista (relación) entre dos actores del ecosistema */
const crearConexionGrafo = async (req, res) => {
  try {
    const conexion = await EcosystemService.crearConexionGrafo(req.body);
    res.status(201).json({ message: 'ConexionGrafo creada exitosamente', conexionGrafo: conexion });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la conexionGrafo', error: error.message });
  }
};

/** Lista todas las conexiones del grafo del ecosistema */
const ObtenerConexionesGrafo = async (req, res) => {
  try {
    const conexiones = await EcosystemService.obtenerConexionesGrafo();
    res.status(200).json(conexiones);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las conexionesGrafo', error: error.message });
  }
};

/** Elimina una arista por :id_conexionGrafo → 404 si no existe */
const eliminarConexionGrafo = async (req, res) => {
  try {
    await EcosystemService.eliminarConexionGrafo(req.params.id_conexionGrafo);
    res.status(200).json({ message: 'ConexionGrafo eliminada correctamente' });
  } catch (error) {
    if (error.message === 'ConexionGrafo no encontrada') return res.status(404).json({ message: error.message });
    res.status(500).json({ message: 'Error al eliminar la conexionGrafo', error: error.message });
  }
};

/** Actualiza el tipo de vínculo de una conexión */
const editarConexionGrafo = async (req, res) => {
  try {
    const editada = await EcosystemService.editarConexionGrafo(req.params.id_conexionGrafo, req.body);
    res.status(200).json(editada);
  } catch (error) {
    if (error.message === 'ConexionGrafo no encontrada') return res.status(404).json({ message: error.message });
    res.status(500).json({ message: 'Error al editar la conexionGrafo', error: error.message });
  }
};

// ── SOLICITUDES ────────────────────────────────────────────────────────────────

/** Crea una solicitud de incorporación al ecosistema (estado inicial: 'Pendiente') */
const CrearSolicitud = async (req, res) => {
  try {
    const solicitud = await EcosystemService.crearSolicitud(req.body);
    res.status(201).json({ message: 'Solicitud creada exitosamente', solicitud });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la solicitud', error: error.message });
  }
};

/** Lista todas las solicitudes (panel de administración) */
const ObtenerSolicitudes = async (req, res) => {
  try {
    const solicitudes = await EcosystemService.obtenerSolicitudes();
    res.status(200).json(solicitudes);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las solicitudes', error: error.message });
  }
};

/** Actualiza campos de una solicitud (ej: agregar comentarios_admin) */
const actualizarSolicitud = async (req, res) => {
  try {
    const editada = await EcosystemService.actualizarSolicitud(req.params.id_solicitud, req.body);
    res.status(200).json(editada);
  } catch (error) {
    if (error.message === 'Solicitud no encontrada') return res.status(404).json({ message: error.message });
    res.status(500).json({ message: 'Error al editar la solicitud', error: error.message });
  }
};

/** Elimina una solicitud permanentemente */
const eliminarSolicitud = async (req, res) => {
  try {
    await EcosystemService.eliminarSolicitud(req.params.id_solicitud);
    res.status(200).json({ message: 'Solicitud eliminada correctamente' });
  } catch (error) {
    if (error.message === 'Solicitud no encontrada') return res.status(404).json({ message: error.message });
    res.status(500).json({ message: 'Error al eliminar la solicitud', error: error.message });
  }
};

/** Acción de admin: aprueba la solicitud (estado → 'Aprobada') */
const aprobarSolicitud = async (req, res) => {
  try {
    const aprobada = await EcosystemService.aprobarSolicitud(req.params.id_solicitud);
    res.status(200).json({ message: 'Solicitud aprobada', solicitud: aprobada });
  } catch (error) {
    if (error.message === 'Solicitud no encontrada') return res.status(404).json({ message: error.message });
    res.status(500).json({ message: 'Error al aprobar la solicitud', error: error.message });
  }
};

/** Acción de admin: rechaza la solicitud (estado → 'Rechazada') */
const rechazarSolicitud = async (req, res) => {
  try {
    const rechazada = await EcosystemService.rechazarSolicitud(req.params.id_solicitud);
    res.status(200).json({ message: 'Solicitud rechazada', solicitud: rechazada });
  } catch (error) {
    if (error.message === 'Solicitud no encontrada') return res.status(404).json({ message: error.message });
    res.status(500).json({ message: 'Error al rechazar la solicitud', error: error.message });
  }
};

// ── METRICAS DASHBOARD ─────────────────────────────────────────────────────────

/** Registra un nuevo snapshot de métricas para una startup */
const crearMetricaDashboard = async (req, res) => {
  try {
    const metrica = await EcosystemService.crearMetricaDashboard(req.body);
    res.status(201).json({ message: 'MetricaDashboard creada exitosamente', metricaDashboard: metrica });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la metricaDashboard', error: error.message });
  }
};

/** Lista todas las métricas de todas las startups */
const ObtenerMetricasDashboards = async (req, res) => {
  try {
    const metricas = await EcosystemService.obtenerMetricasDashboards();
    res.status(200).json(metricas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las metricasDashboards', error: error.message });
  }
};

/** Actualiza una métrica existente (ej: corrección de datos) */
const actualizarMetricaDashboard = async (req, res) => {
  try {
    const editada = await EcosystemService.actualizarMetricaDashboard(req.params.id_metricaDashboard, req.body);
    res.status(200).json(editada);
  } catch (error) {
    if (error.message === 'MetricaDashboard no encontrada') return res.status(404).json({ message: error.message });
    res.status(500).json({ message: 'Error al editar la metricaDashboard', error: error.message });
  }
};

/** Elimina un registro de métricas */
const eliminarMetricaDashboard = async (req, res) => {
  try {
    await EcosystemService.eliminarMetricaDashboard(req.params.id_metricaDashboard);
    res.status(200).json({ message: 'MetricaDashboard eliminada correctamente' });
  } catch (error) {
    if (error.message === 'MetricaDashboard no encontrada') return res.status(404).json({ message: error.message });
    res.status(500).json({ message: 'Error al eliminar la metricaDashboard', error: error.message });
  }
};

module.exports = {
  crearGeolocalizacion,
  ObtenerGeolocalizaciones,
  eliminarGeolocalizacion,
  editarGeolocalizacion,
  crearConexionGrafo,
  ObtenerConexionesGrafo,
  eliminarConexionGrafo,
  editarConexionGrafo,
  CrearSolicitud,
  ObtenerSolicitudes,
  actualizarSolicitud,
  eliminarSolicitud,
  aprobarSolicitud,
  rechazarSolicitud,
  crearMetricaDashboard,
  ObtenerMetricasDashboards,
  actualizarMetricaDashboard,
  eliminarMetricaDashboard
};
