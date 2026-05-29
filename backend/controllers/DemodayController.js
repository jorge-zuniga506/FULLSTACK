/**
 * DemodayController.js
 * Sala Virtual Demo Day: conexión entre Startups graduadas e Inversores.
 */
const { DemodaySolicitud, Startup, Inversor, Postulacion, Convocatoria, Sector, User } = require('../models');
const { Op } = require('sequelize');

const ensureInversorProfile = async (userId) => {
  const user = await User.findByPk(userId, { attributes: ['id', 'nombre_hacienda'] });
  if (!user) return null;

  const [inversor] = await Inversor.findOrCreate({
    where: { user_id: userId },
    defaults: {
      nombre: user.nombre_hacienda || `Inversor ${userId}`
    }
  });

  return inversor;
};

// ── INVERSOR: listar startups graduadas (Aceptadas) ───────────────────────────
const listarStartupsGraduadas = async (req, res) => {
  try {
    const { sector_id } = req.query;

    // Startups que tengan al menos una postulación Aceptada
    const postulacionesAceptadas = await Postulacion.findAll({
      where: { estado: 'Aceptada' },
      attributes: ['startup_id'],
      include: [{
        model: Convocatoria,
        attributes: ['nombre_batch'],
        include: [{ model: require('../models/Aceleradora'), attributes: ['nombre'] }]
      }]
    });

    const startupIds = [...new Set(postulacionesAceptadas.map(p => p.startup_id))];

    const whereStartup = { id: { [Op.in]: startupIds } };
    if (sector_id) whereStartup.sector_id = sector_id;

    const startups = await Startup.findAll({
      where: whereStartup,
      include: [
        { model: User, attributes: ['nombre', 'email', 'foto_perfil'] },
        { model: Sector, attributes: ['nombre'] }
      ],
      order: [['nombre_comercial', 'ASC']]
    });

    // Enriquecer con info de aceleradora que las respaldó
    const resultado = await Promise.all(startups.map(async (s) => {
      const postAceptada = postulacionesAceptadas.find(p => p.startup_id === s.id);
      return {
        ...s.toJSON(),
        respaldadaPor: postAceptada?.Convocatoria?.Aceleradora?.nombre || 'Aceleradora Registrada',
        batch: postAceptada?.Convocatoria?.nombre_batch || 'Generación en curso'
      };
    }));

    return res.status(200).json({ data: resultado });
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener startups graduadas.', error: error.message });
  }
};

// ── INVERSOR: solicitar reunión con startup ───────────────────────────────────
const solicitarReunion = async (req, res) => {
  try {
    const inversor = await ensureInversorProfile(req.user.id);
    if (!inversor) return res.status(404).json({ message: 'Usuario no encontrado.' });

    const { startup_id, mensaje } = req.body;
    if (!startup_id) return res.status(400).json({ message: 'startup_id es requerido.' });

    // Verificar que la startup está graduada
    const postAceptada = await Postulacion.findOne({ where: { startup_id, estado: 'Aceptada' } });
    if (!postAceptada) return res.status(400).json({ message: 'Esta startup no está disponible en el Demo Day.' });

    // Verificar que no haya ya una solicitud pendiente
    const yaExiste = await DemodaySolicitud.findOne({
      where: { inversor_id: inversor.id, startup_id, estado: 'pendiente' }
    });
    if (yaExiste) return res.status(409).json({ message: 'Ya tienes una solicitud pendiente con esta startup.' });

    const solicitud = await DemodaySolicitud.create({
      inversor_id: inversor.id,
      startup_id,
      mensaje,
      estado: 'pendiente'
    });

    return res.status(201).json({ message: 'Solicitud de reunión enviada.', data: solicitud });
  } catch (error) {
    return res.status(500).json({ message: 'Error al enviar solicitud.', error: error.message });
  }
};

// ── INVERSOR: ver mis solicitudes enviadas ────────────────────────────────────
const listarSolicitudesInversor = async (req, res) => {
  try {
    const inversor = await ensureInversorProfile(req.user.id);
    if (!inversor) return res.status(404).json({ message: 'Usuario no encontrado.' });

    const solicitudes = await DemodaySolicitud.findAll({
      where: { inversor_id: inversor.id },
      include: [{ model: Startup, attributes: ['nombre_comercial', 'logo_url'], include: [{ model: User, attributes: ['email'] }] }],
      order: [['created_at', 'DESC']]
    });

    return res.status(200).json({ data: solicitudes });
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener solicitudes.', error: error.message });
  }
};

// ── STARTUP: ver solicitudes de reunión recibidas ─────────────────────────────
const listarSolicitudesStartup = async (req, res) => {
  try {
    const startup = await Startup.findOne({ where: { user_id: req.user.id } });
    if (!startup) return res.status(404).json({ message: 'Startup no encontrada.' });

    const solicitudes = await DemodaySolicitud.findAll({
      where: { startup_id: startup.id },
      include: [{ model: Inversor, include: [{ model: User, attributes: ['nombre', 'email', 'foto_perfil'] }] }],
      order: [['created_at', 'DESC']]
    });

    return res.status(200).json({ data: solicitudes });
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener solicitudes.', error: error.message });
  }
};

// ── STARTUP: responder a una solicitud ───────────────────────────────────────
const responderSolicitud = async (req, res) => {
  try {
    const startup = await Startup.findOne({ where: { user_id: req.user.id } });
    if (!startup) return res.status(404).json({ message: 'Startup no encontrada.' });

    const { estado } = req.body;
    if (!['aceptada', 'rechazada'].includes(estado)) {
      return res.status(400).json({ message: "Estado inválido. Use 'aceptada' o 'rechazada'." });
    }

    const solicitud = await DemodaySolicitud.findOne({ where: { id: req.params.id, startup_id: startup.id } });
    if (!solicitud) return res.status(404).json({ message: 'Solicitud no encontrada.' });

    await solicitud.update({ estado });
    return res.status(200).json({ message: 'Solicitud actualizada.', data: solicitud });
  } catch (error) {
    return res.status(500).json({ message: 'Error al responder solicitud.', error: error.message });
  }
};

module.exports = {
  listarStartupsGraduadas,
  solicitarReunion,
  listarSolicitudesInversor,
  listarSolicitudesStartup,
  responderSolicitud
};

