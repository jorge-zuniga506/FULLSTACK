/**
 * services/CommunicationService.js — Lógica de negocio de mensajería y consultas IA
 *
 * Clase estática con operaciones CRUD para:
 *   Mensaje   → mensajes del sistema de chat entre usuarios
 *   ConsultaIA → historial de preguntas y respuestas del asistente IA
 *
 * Patrón de error: los métodos *PorId lanzan Error si no encuentran el registro.
 * El controller captura esos errores y los convierte en respuestas 404/500.
 *
 * ── Mensajes ─────────────────────────────────────────────────────────────────
 * crearMensaje(data)          → crea un mensaje en un chat
 * obtenerMensajes()           → lista todos los mensajes (sin filtro de chat_id)
 * obtenerMensajePorId(id)     → busca un mensaje por PK
 * editarMensaje(id, data)     → actualiza contenido o estado 'leido'
 * eliminarMensaje(id)         → elimina el mensaje
 *
 * ── Consultas IA ─────────────────────────────────────────────────────────────
 * crearConsultaIA(data)       → registra una nueva consulta al asistente IA
 * obtenerConsultasIA()        → lista todo el historial de consultas IA
 * obtenerConsultaIAPorId(id)  → busca una consulta por PK
 * editarConsultaIA(id, data)  → actualiza la respuesta o el modelo usado
 * eliminarConsultaIA(id)      → elimina una consulta del historial
 */
const { Mensaje, ConsultaIA } = require('../models');

class CommunicationService {

  // ── MENSAJES ───────────────────────────────────────────────────────────────

  /**
   * Crea un nuevo mensaje en un chat
   * @param {object} data - { emisor_id, chat_id, contenido, [leido] }
   * @returns {Mensaje}
   */
  static async crearMensaje(data) {
    return await Mensaje.create(data);
  }

  /**
   * Lista todos los mensajes del sistema
   * TODO: agregar filtro por chat_id para obtener mensajes de una conversación específica
   */
  static async obtenerMensajes() {
    return await Mensaje.findAll();
  }

  /**
   * Busca un mensaje por PK
   * @throws {Error} 'Mensaje no encontrado'
   */
  static async obtenerMensajePorId(id) {
    const mensaje = await Mensaje.findByPk(id);
    if (!mensaje) throw new Error('Mensaje no encontrado');
    return mensaje;
  }

  /**
   * Actualiza un mensaje (ej: marcar como leído: { leido: true })
   * @param {number} id   - ID del mensaje
   * @param {object} data - Campos a actualizar
   * @returns {Mensaje} Mensaje actualizado
   */
  static async editarMensaje(id, data) {
    const mensaje = await this.obtenerMensajePorId(id);
    return await mensaje.update(data);
  }

  /**
   * Elimina un mensaje del historial
   * @param {number} id
   * @returns {true}
   */
  static async eliminarMensaje(id) {
    const mensaje = await this.obtenerMensajePorId(id);
    await mensaje.destroy();
    return true;
  }

  // ── CONSULTAS IA ───────────────────────────────────────────────────────────

  /**
   * Registra una nueva consulta al asistente IA
   * @param {object} data - { user_id, pregunta_usuario, respuesta_ia, [modelo] }
   * @returns {ConsultaIA}
   */
  static async crearConsultaIA(data) {
    return await ConsultaIA.create(data);
  }

  /** Lista todo el historial de consultas IA */
  static async obtenerConsultasIA() {
    return await ConsultaIA.findAll();
  }

  /**
   * Busca una consulta IA por PK
   * @throws {Error} 'Consulta IA no encontrada'
   */
  static async obtenerConsultaIAPorId(id) {
    const consulta = await ConsultaIA.findByPk(id);
    if (!consulta) throw new Error('Consulta IA no encontrada');
    return consulta;
  }

  /**
   * Actualiza los campos de una consulta IA
   * @param {number} id   - ID de la consulta
   * @param {object} data - Campos a actualizar (ej: corregir respuesta_ia)
   * @returns {ConsultaIA}
   */
  static async editarConsultaIA(id, data) {
    const consulta = await this.obtenerConsultaIAPorId(id);
    return await consulta.update(data);
  }

  /**
   * Elimina una consulta del historial IA
   * @param {number} id
   * @returns {true}
   */
  static async eliminarConsultaIA(id) {
    const consulta = await this.obtenerConsultaIAPorId(id);
    await consulta.destroy();
    return true;
  }
}

module.exports = CommunicationService;
