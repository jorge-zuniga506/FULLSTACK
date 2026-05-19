const { Notificacion } = require('../models');

class NotificationService {
  static async crearNotificacion(data) {
    return await Notificacion.create(data);
  }

  static async obtenerNotificacionesUsuario(user_id) {
    return await Notificacion.findAll({
      where: { user_id },
      order: [['fecha_creacion', 'DESC']]
    });
  }

  static async contarNoLeidas(user_id) {
    const count = await Notificacion.count({
      where: { user_id, leido: false }
    });
    return { no_leidas: count };
  }

  static async marcarComoLeida(id, user_id) {
    const notificacion = await Notificacion.findOne({
      where: { id, user_id }
    });
    if (!notificacion) throw new Error('Notificación no encontrada');
    await notificacion.update({ leido: true });
    return notificacion;
  }

  static async marcarTodasComoLeidas(user_id) {
    await Notificacion.update({ leido: true }, {
      where: { user_id, leido: false }
    });
    return { message: 'Todas las notificaciones marcadas como leídas' };
  }

  static async eliminarNotificacion(id, user_id) {
    const notificacion = await Notificacion.findOne({
      where: { id, user_id }
    });
    if (!notificacion) throw new Error('Notificación no encontrada');
    await notificacion.destroy();
    return true;
  }
}

module.exports = NotificationService;
