const { Op } = require('sequelize');
const { SupportReport, User } = require('../models');
const { notificarReporteSoporteRecibido } = require('./EmailService');

const CATEGORIAS_VALIDAS = ['bug', 'queja', 'sugerencia', 'incidente', 'otro'];
const PRIORIDADES_VALIDAS = ['baja', 'media', 'alta', 'critica'];
const ESTADOS_VALIDOS = ['nuevo', 'en_proceso', 'resuelto', 'cerrado'];

class SupportService {
  static normalizarCategoria(rawCategoria = '') {
    const value = String(rawCategoria || '').trim().toLowerCase();
    return CATEGORIAS_VALIDAS.includes(value) ? value : 'otro';
  }

  static normalizarPrioridad(rawPrioridad = '') {
    const value = String(rawPrioridad || '').trim().toLowerCase();
    return PRIORIDADES_VALIDAS.includes(value) ? value : 'media';
  }

  static async crearReporte({ actor, data }) {
    if (!actor || !actor.id || !actor.role_id) {
      throw new Error('Actor invalido para crear reporte.');
    }

    const asunto = String(data?.asunto || '').trim();
    const descripcion = String(data?.descripcion || '').trim();

    if (!asunto || asunto.length < 4) {
      throw new Error('El asunto es requerido (minimo 4 caracteres).');
    }

    if (!descripcion || descripcion.length < 10) {
      throw new Error('La descripcion es requerida (minimo 10 caracteres).');
    }

    const categoria = this.normalizarCategoria(data?.categoria);
    const prioridad = this.normalizarPrioridad(data?.prioridad);
    const pagina_url = String(data?.pagina_url || '').trim() || null;
    const contexto_tecnico = String(data?.contexto_tecnico || '').trim() || null;

    const reporte = await SupportReport.create({
      reporter_user_id: actor.id,
      reporter_role_id: actor.role_id,
      categoria,
      prioridad,
      asunto,
      descripcion,
      pagina_url,
      contexto_tecnico,
      estado: 'nuevo'
    });

    if (Number(actor.role_id) !== 1) {
      const user = await User.findByPk(actor.id);
      if (user?.email) {
        await notificarReporteSoporteRecibido({
          to: user.email,
          userName: user.nombre_hacienda || user.email,
          asunto,
          categoria,
          prioridad
        });
      }
    }

    return reporte;
  }

  static async listarReportesAdmin(query = {}) {
    const page = Math.max(parseInt(query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(query.limit, 10) || 20, 1), 100);
    const offset = (page - 1) * limit;

    const where = {};
    const estado = String(query.estado || '').trim().toLowerCase();
    const search = String(query.search || '').trim();

    if (estado && ESTADOS_VALIDOS.includes(estado)) {
      where.estado = estado;
    }

    if (search) {
      where[Op.or] = [
        { asunto: { [Op.like]: `%${search}%` } },
        { descripcion: { [Op.like]: `%${search}%` } },
        { categoria: { [Op.like]: `%${search}%` } }
      ];
    }

    const result = await SupportReport.findAndCountAll({
      where,
      include: [{
        model: User,
        as: 'Reporter',
        attributes: ['id', 'nombre_hacienda', 'email', 'role_id']
      }],
      order: [['created_at', 'DESC']],
      limit,
      offset
    });

    return {
      totalItems: result.count,
      totalPages: Math.ceil(result.count / limit),
      currentPage: page,
      reportes: result.rows
    };
  }

  static async listarReportesPropios(userId, query = {}) {
    const page = Math.max(parseInt(query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(query.limit, 10) || 20, 1), 100);
    const offset = (page - 1) * limit;

    const result = await SupportReport.findAndCountAll({
      where: { reporter_user_id: userId },
      order: [['created_at', 'DESC']],
      limit,
      offset
    });

    return {
      totalItems: result.count,
      totalPages: Math.ceil(result.count / limit),
      currentPage: page,
      reportes: result.rows
    };
  }

  static async actualizarEstado({ id, estado, adminNote }) {
    const reporte = await SupportReport.findByPk(id);
    if (!reporte) {
      throw new Error('Reporte no encontrado.');
    }

    const normalizedEstado = String(estado || '').trim().toLowerCase();
    if (!ESTADOS_VALIDOS.includes(normalizedEstado)) {
      throw new Error('Estado de soporte invalido.');
    }

    const payload = { estado: normalizedEstado };
    if (adminNote !== undefined) {
      payload.admin_note = String(adminNote || '').trim() || null;
    }

    await reporte.update(payload);
    return reporte;
  }
}

module.exports = SupportService;
