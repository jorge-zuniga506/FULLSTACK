const NotificationService = require('../services/NotificationService');

const obtenerNotificacionesUsuario = async (req, res) => {
  try {
    const userId = req.user.id;
    const notificaciones = await NotificationService.obtenerNotificacionesUsuario(userId);
    res.status(200).json(notificaciones);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las notificaciones del usuario', error: error.message });
  }
};

const contarNoLeidas = async (req, res) => {
  try {
    const userId = req.user.id;
    const resultado = await NotificationService.contarNoLeidas(userId);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ message: 'Error al contar notificaciones no leídas', error: error.message });
  }
};

const marcarComoLeida = async (req, res) => {
  try {
    const userId = req.user.id;
    const notificacion = await NotificationService.marcarComoLeida(req.params.id, userId);
    res.status(200).json(notificacion);
  } catch (error) {
    if (error.message === 'Notificación no encontrada') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error al marcar la notificación como leída', error: error.message });
  }
};

const marcarTodasComoLeidas = async (req, res) => {
  try {
    const userId = req.user.id;
    const resultado = await NotificationService.marcarTodasComoLeidas(userId);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ message: 'Error al marcar todas como leídas', error: error.message });
  }
};

const eliminarNotificacion = async (req, res) => {
  try {
    const userId = req.user.id;
    await NotificationService.eliminarNotificacion(req.params.id, userId);
    res.status(200).json({ message: 'Notificación eliminada correctamente' });
  } catch (error) {
    if (error.message === 'Notificación no encontrada') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error al eliminar la notificación', error: error.message });
  }
};

module.exports = {
  obtenerNotificacionesUsuario,
  contarNoLeidas,
  marcarComoLeida,
  marcarTodasComoLeidas,
  eliminarNotificacion
};
