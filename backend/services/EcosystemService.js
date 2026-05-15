/**
 * services/EcosystemService.js — Lógica de negocio del ecosistema de relaciones
 *
 * Clase estática con operaciones CRUD para los 4 modelos del ecosistema:
 *   Geolocalizacion, ConexionGrafo, Solicitud, MetricaDashboard
 *
 * Cada subgrupo de métodos sigue el mismo patrón CRUD:
 *   crear[X]        -> crea un registro
 *   obtener[X]s     -> lista todos
 *   obtener[X]PorId -> busca por PK, lanza Error si no existe
 *   editar[X]       -> actualiza el registro
 *   eliminar[X]     -> elimina el registro
 *
 * Métodos especiales de Solicitud:
 *   aprobarSolicitud(id)  -> actualiza estado a 'Aprobada'
 *   rechazarSolicitud(id) -> actualiza estado a 'Rechazada'
 *
 * El patron "obtener por ID + lanzar Error" permite que los controllers
 * conviertan automaticamente ese Error en una respuesta 404.
 */
const { Geolocalizacion, ConexionGrafo, Solicitud, MetricaDashboard } = require('../models');

class EcosystemService {

  // ── GEOLOCALIZACION ────────────────────────────────────────────────────────

  /** Crea un registro de geolocalización para un usuario */
  static async crearGeolocalizacion(data) {
    return await Geolocalizacion.create(data);
  }

  /** Lista todos los registros de geolocalización */
  static async obtenerGeolocalizaciones() {
    return await Geolocalizacion.findAll();
  }

  /**
   * Busca una geolocalización por PK
   * @throws {Error} 'Geolocalizacion no encontrada' → controller la convierte en 404
   */
  static async obtenerGeolocalizacionPorId(id) {
    const geo = await Geolocalizacion.findByPk(id);
    if (!geo) throw new Error('Geolocalizacion no encontrada');
    return geo;
  }

  /** Actualiza latitud, longitud o dirección de un registro */
  static async editarGeolocalizacion(id, data) {
    const geo = await this.obtenerGeolocalizacionPorId(id);
    return await geo.update(data);
  }

  /** Elimina un registro de geolocalización */
  static async eliminarGeolocalizacion(id) {
    const geo = await this.obtenerGeolocalizacionPorId(id);
    await geo.destroy();
    return true;
  }

  // ── CONEXION GRAFO ─────────────────────────────────────────────────────────
  // Representa las aristas del grafo: relaciones entre actores del ecosistema
  // tipo_vinculo: ENUM('Inversion', 'Alianza', 'Mentoria')

  /** Crea una conexión (arista) entre dos actores del ecosistema */
  static async crearConexionGrafo(data) {
    return await ConexionGrafo.create(data);
  }

  /** Lista todas las conexiones del grafo (aristas) */
  static async obtenerConexionesGrafo() {
    return await ConexionGrafo.findAll();
  }

  /**
   * Busca una conexión por PK
   * @throws {Error} 'ConexionGrafo no encontrada'
   */
  static async obtenerConexionGrafoPorId(id) {
    const conexion = await ConexionGrafo.findByPk(id);
    if (!conexion) throw new Error('ConexionGrafo no encontrada');
    return conexion;
  }

  /** Actualiza el tipo de vínculo de una conexión */
  static async editarConexionGrafo(id, data) {
    const conexion = await this.obtenerConexionGrafoPorId(id);
    return await conexion.update(data);
  }

  /** Elimina una arista del grafo */
  static async eliminarConexionGrafo(id) {
    const conexion = await this.obtenerConexionGrafoPorId(id);
    await conexion.destroy();
    return true;
  }

  // ── SOLICITUDES ────────────────────────────────────────────────────────────
  // Solicitudes de incorporación al ecosistema como startup/aceleradora/inversor
  // Estado workflow: Pendiente → Aprobada | Rechazada

  /** Crea una solicitud de incorporación (estado inicial: 'Pendiente') */
  static async crearSolicitud(data) {
    return await Solicitud.create(data);
  }

  /** Lista todas las solicitudes (para el panel de administración) */
  static async obtenerSolicitudes() {
    return await Solicitud.findAll();
  }

  /**
   * Busca una solicitud por PK
   * @throws {Error} 'Solicitud no encontrada'
   */
  static async obtenerSolicitudPorId(id) {
    const solicitud = await Solicitud.findByPk(id);
    if (!solicitud) throw new Error('Solicitud no encontrada');
    return solicitud;
  }

  /** Actualiza cualquier campo de una solicitud (ej: comentarios_admin) */
  static async actualizarSolicitud(id, data) {
    const solicitud = await this.obtenerSolicitudPorId(id);
    return await solicitud.update(data);
  }

  /** Elimina una solicitud */
  static async eliminarSolicitud(id) {
    const solicitud = await this.obtenerSolicitudPorId(id);
    await solicitud.destroy();
    return true;
  }

  /**
   * Acción de administrador: aprueba una solicitud pendiente
   * Cambia estado → 'Aprobada'
   */
  static async aprobarSolicitud(id) {
    const solicitud = await this.obtenerSolicitudPorId(id);
    return await solicitud.update({ estado: 'Aprobada' });
  }

  /**
   * Acción de administrador: rechaza una solicitud pendiente
   * Cambia estado → 'Rechazada'
   */
  static async rechazarSolicitud(id) {
    const solicitud = await this.obtenerSolicitudPorId(id);
    return await solicitud.update({ estado: 'Rechazada' });
  }

  // ── METRICAS DASHBOARD ─────────────────────────────────────────────────────
  // KPIs periódicos de las startups: empleados, valoración, fecha de reporte

  /** Registra una nueva métrica para una startup */
  static async crearMetricaDashboard(data) {
    return await MetricaDashboard.create(data);
  }

  /** Lista todas las métricas (todas las startups, todos los períodos) */
  static async obtenerMetricasDashboards() {
    return await MetricaDashboard.findAll();
  }

  /**
   * Busca una métrica por PK
   * @throws {Error} 'MetricaDashboard no encontrada'
   */
  static async obtenerMetricaDashboardPorId(id) {
    const metrica = await MetricaDashboard.findByPk(id);
    if (!metrica) throw new Error('MetricaDashboard no encontrada');
    return metrica;
  }

  /** Actualiza los valores de una métrica existente */
  static async actualizarMetricaDashboard(id, data) {
    const metrica = await this.obtenerMetricaDashboardPorId(id);
    return await metrica.update(data);
  }

  /** Elimina un registro de métricas */
  static async eliminarMetricaDashboard(id) {
    const metrica = await this.obtenerMetricaDashboardPorId(id);
    await metrica.destroy();
    return true;
  }
}

module.exports = EcosystemService;
