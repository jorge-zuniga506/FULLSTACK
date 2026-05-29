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
const { sequelize, Mensaje, ConsultaIA, ContactoPublico } = require('../models');

class CommunicationService {

  // ── CHAT / MENSAJES ─────────────────────────────────────────────────────────

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
   */
  static async obtenerMensajes(query = {}) {
    const { page, limit } = query;
    if (!page && !limit) {
      return await Mensaje.findAll();
    }
    const p = parseInt(page, 10) || 1;
    const l = parseInt(limit, 10) || 10;
    const offset = (p - 1) * l;
    const result = await Mensaje.findAndCountAll({ limit: l, offset });
    return {
      totalItems:  result.count,
      totalPages:  Math.ceil(result.count / l),
      currentPage: p,
      mensajes:    result.rows
    };
  }

  /**
   * Crea un mensaje de contacto público desde el formulario de contacto.
   * @param {object} data - { nombre, email, asunto, mensaje }
   * @returns {ContactoPublico}
   */
  static async crearMensajeContactoPublico(data) {
    return await ContactoPublico.create(data);
  }

  /**
   * Lista todos los mensajes de contacto público recibidos.
   */
  static async obtenerMensajesContactoPublico(query = {}) {
    const { page, limit } = query;
    if (!page && !limit) {
      return await ContactoPublico.findAll({ order: [['fecha_envio', 'DESC']] });
    }
    const p = parseInt(page, 10) || 1;
    const l = parseInt(limit, 10) || 10;
    const offset = (p - 1) * l;
    const result = await ContactoPublico.findAndCountAll({
      limit: l,
      offset,
      order: [['fecha_envio', 'DESC']]
    });
    return {
      totalItems:   result.count,
      totalPages:   Math.ceil(result.count / l),
      currentPage:  p,
      mensajes:     result.rows
    };
  }

  /**
   * Lista chats únicos existentes en base a mensajes enviados
   */
  static async listarChats() {
    const chats = await Mensaje.findAll({
      attributes: [
        'chat_id',
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalMensajes'],
        [sequelize.fn('MAX', sequelize.col('fecha_envio')), 'ultimoEnvio']
      ],
      group: ['chat_id'],
      order: [[sequelize.fn('MAX', sequelize.col('fecha_envio')), 'DESC']]
    });

    return chats.map(chat => ({
      chat_id: chat.chat_id,
      totalMensajes: Number(chat.get('totalMensajes')),
      ultimoEnvio: chat.get('ultimoEnvio')
    }));
  }

  static async crearChat() {
    const result = await Mensaje.findOne({
      attributes: [[sequelize.fn('MAX', sequelize.col('chat_id')), 'maxChatId']]
    });

    const nextChatId = (result.get('maxChatId') || 0) + 1;
    return { chat_id: nextChatId };
  }

  static async obtenerMensajesPorChat(chat_id) {
    return await Mensaje.findAll({
      where: { chat_id },
      order: [['fecha_envio', 'ASC']]
    });
  }

  static async enviarMensajeEnChat(chat_id, data) {
    return await Mensaje.create({ ...data, chat_id });
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
   * Marca un mensaje como leído
   * @param {number} id - ID del mensaje
   * @returns {Mensaje}
   */
  static async marcarMensajeComoLeido(id) {
    const mensaje = await this.obtenerMensajePorId(id);
    return await mensaje.update({ leido: true });
  }

  /**
   * Marca todos los mensajes de un chat como leídos
   * @param {number} chat_id - ID del chat
   * @returns {{ message: string, count: number }}
   */
  static async marcarMensajesChatComoLeidos(chat_id) {
    const [count] = await Mensaje.update({ leido: true }, {
      where: { chat_id, leido: false }
    });
    return { message: `Mensajes del chat ${chat_id} marcados como leídos`, count };
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
  static async obtenerConsultasIA(query = {}) {
    const { page, limit } = query;
    if (!page && !limit) {
      return await ConsultaIA.findAll();
    }
    const p = parseInt(page, 10) || 1;
    const l = parseInt(limit, 10) || 10;
    const offset = (p - 1) * l;
    const result = await ConsultaIA.findAndCountAll({ limit: l, offset });
    return {
      totalItems:   result.count,
      totalPages:   Math.ceil(result.count / l),
      currentPage:  p,
      consultas:    result.rows
    };
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
