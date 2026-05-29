/**
 * PerksController.js
 * Gestión de Perks, Mentores y Reservas de Mentoría.
 */
const { Perk, Mentor, ReservaMentoria, ReclamacionPerk, Aceleradora, Startup, Postulacion, Convocatoria, User } = require('../models');
const { Op } = require('sequelize');

// ── Helpers ───────────────────────────────────────────────────────────────────
const getAceleradoraOrFail = async (userId, res) => {
  const user = await User.findByPk(userId, { attributes: ['id', 'nombre_hacienda'] });
  if (!user) { res.status(404).json({ message: 'Usuario no encontrado.' }); return null; }

  const [a] = await Aceleradora.findOrCreate({
    where: { user_id: userId },
    defaults: {
      nombre: user.nombre_hacienda || `Aceleradora ${userId}`
    }
  });

  return a;
};

const getStartupOrFail = async (userId, res) => {
  const s = await Startup.findOne({ where: { user_id: userId } });
  if (!s) { res.status(404).json({ message: 'Startup no encontrada.' }); return null; }
  return s;
};

// ─────────────── PERKS ───────────────────────────────────────────────────────

// ACELERADORA: crear perk
const crearPerk = async (req, res) => {
  try {
    const acel = await getAceleradoraOrFail(req.user.id, res);
    if (!acel) return;
    const { titulo, descripcion, tipo, valor } = req.body;
    if (!titulo) return res.status(400).json({ message: 'titulo es requerido.' });
    const perk = await Perk.create({ aceleradora_id: acel.id, titulo, descripcion, tipo, valor });
    return res.status(201).json({ message: 'Perk creado.', data: perk });
  } catch (error) {
    return res.status(500).json({ message: 'Error al crear perk.', error: error.message });
  }
};

// ACELERADORA: listar sus perks
const listarPerksAceleradora = async (req, res) => {
  try {
    const acel = await getAceleradoraOrFail(req.user.id, res);
    if (!acel) return;
    const perks = await Perk.findAll({ where: { aceleradora_id: acel.id }, order: [['id', 'DESC']] });
    return res.status(200).json({ data: perks });
  } catch (error) {
    return res.status(500).json({ message: 'Error al listar perks.', error: error.message });
  }
};

// STARTUP: ver perks disponibles (de aceleradoras en las que está aceptada)
const listarPerksDisponiblesStartup = async (req, res) => {
  try {
    const startup = await getStartupOrFail(req.user.id, res);
    if (!startup) return;

    const postulaciones = await Postulacion.findAll({
      where: { startup_id: startup.id, estado: 'Aceptada' },
      include: [{ model: Convocatoria, attributes: ['aceleradora_id'] }]
    });

    const aceleradoraIds = [...new Set(postulaciones.map(p => p.Convocatoria?.aceleradora_id).filter(Boolean))];

    const perks = await Perk.findAll({
      where: { aceleradora_id: { [Op.in]: aceleradoraIds }, activo: true },
      include: [{ model: Aceleradora, attributes: ['nombre'] }]
    });

    // Marcar cuáles ya reclamó
    const reclamaciones = await ReclamacionPerk.findAll({ where: { startup_id: startup.id }, attributes: ['perk_id', 'estado'] });
    const reclamadasMap = {};
    reclamaciones.forEach(r => { reclamadasMap[r.perk_id] = r.estado; });

    const resultado = perks.map(p => ({ ...p.toJSON(), reclamacion_estado: reclamadasMap[p.id] || null }));
    return res.status(200).json({ data: resultado });
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener perks.', error: error.message });
  }
};

// STARTUP: reclamar perk
const reclamarPerk = async (req, res) => {
  try {
    const startup = await getStartupOrFail(req.user.id, res);
    if (!startup) return;

    const { perk_id } = req.body;
    if (!perk_id) return res.status(400).json({ message: 'perk_id es requerido.' });

    const yaReclamo = await ReclamacionPerk.findOne({ where: { perk_id, startup_id: startup.id } });
    if (yaReclamo) return res.status(409).json({ message: 'Ya reclamaste este beneficio.', data: yaReclamo });

    const reclamacion = await ReclamacionPerk.create({ perk_id, startup_id: startup.id });
    return res.status(201).json({ message: 'Beneficio reclamado exitosamente.', data: reclamacion });
  } catch (error) {
    return res.status(500).json({ message: 'Error al reclamar perk.', error: error.message });
  }
};

// ACELERADORA: ver reclamaciones de sus perks
const listarReclamacionesPerk = async (req, res) => {
  try {
    const acel = await getAceleradoraOrFail(req.user.id, res);
    if (!acel) return;
    const perks = await Perk.findAll({ where: { aceleradora_id: acel.id }, attributes: ['id'] });
    const perkIds = perks.map(p => p.id);
    const recs = await ReclamacionPerk.findAll({
      where: { perk_id: { [Op.in]: perkIds } },
      include: [{ model: Perk, attributes: ['titulo'] }, { model: Startup, attributes: ['nombre_comercial'] }]
    });
    return res.status(200).json({ data: recs });
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener reclamaciones.', error: error.message });
  }
};

// ACELERADORA: aprobar/rechazar reclamación
const gestionarReclamacion = async (req, res) => {
  try {
    const acel = await getAceleradoraOrFail(req.user.id, res);
    if (!acel) return;
    const rec = await ReclamacionPerk.findByPk(req.params.id, { include: [{ model: Perk }] });
    if (!rec || rec.Perk.aceleradora_id !== acel.id) {
      return res.status(404).json({ message: 'Reclamación no encontrada.' });
    }
    const { estado } = req.body;
    if (!['aprobada', 'rechazada'].includes(estado)) return res.status(400).json({ message: 'Estado inválido.' });
    await rec.update({ estado });
    return res.status(200).json({ message: 'Reclamación actualizada.', data: rec });
  } catch (error) {
    return res.status(500).json({ message: 'Error.', error: error.message });
  }
};

// ─────────────── MENTORES ─────────────────────────────────────────────────────

// ACELERADORA: crear mentor
const crearMentor = async (req, res) => {
  try {
    const acel = await getAceleradoraOrFail(req.user.id, res);
    if (!acel) return;
    const { nombre, especialidad, linkedin_url, foto_url } = req.body;
    if (!nombre) return res.status(400).json({ message: 'nombre es requerido.' });
    const mentor = await Mentor.create({ aceleradora_id: acel.id, nombre, especialidad, linkedin_url, foto_url });
    return res.status(201).json({ message: 'Mentor creado.', data: mentor });
  } catch (error) {
    return res.status(500).json({ message: 'Error al crear mentor.', error: error.message });
  }
};

// ACELERADORA: listar sus mentores
const listarMentoresAceleradora = async (req, res) => {
  try {
    const acel = await getAceleradoraOrFail(req.user.id, res);
    if (!acel) return;
    const mentores = await Mentor.findAll({ where: { aceleradora_id: acel.id, activo: true } });
    return res.status(200).json({ data: mentores });
  } catch (error) {
    return res.status(500).json({ message: 'Error.', error: error.message });
  }
};

// STARTUP: ver mentores disponibles (de sus aceleradoras)
const listarMentoresDisponibles = async (req, res) => {
  try {
    const startup = await getStartupOrFail(req.user.id, res);
    if (!startup) return;

    const postulaciones = await Postulacion.findAll({
      where: { startup_id: startup.id, estado: 'Aceptada' },
      include: [{ model: Convocatoria, attributes: ['aceleradora_id'] }]
    });
    const aceleradoraIds = [...new Set(postulaciones.map(p => p.Convocatoria?.aceleradora_id).filter(Boolean))];

    const mentores = await Mentor.findAll({
      where: { aceleradora_id: { [Op.in]: aceleradoraIds }, activo: true },
      include: [{ model: Aceleradora, attributes: ['nombre'] }]
    });
    return res.status(200).json({ data: mentores });
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener mentores.', error: error.message });
  }
};

// STARTUP: reservar mentoría
const reservarMentoria = async (req, res) => {
  try {
    const startup = await getStartupOrFail(req.user.id, res);
    if (!startup) return;

    const { mentor_id, fecha_hora, notas } = req.body;
    if (!mentor_id || !fecha_hora) return res.status(400).json({ message: 'mentor_id y fecha_hora son requeridos.' });

    const reserva = await ReservaMentoria.create({ mentor_id, startup_id: startup.id, fecha_hora, notas });
    return res.status(201).json({ message: 'Mentoría agendada exitosamente.', data: reserva });
  } catch (error) {
    return res.status(500).json({ message: 'Error al reservar mentoría.', error: error.message });
  }
};

// STARTUP: ver sus reservas de mentoría
const listarReservasStartup = async (req, res) => {
  try {
    const startup = await getStartupOrFail(req.user.id, res);
    if (!startup) return;
    const reservas = await ReservaMentoria.findAll({
      where: { startup_id: startup.id },
      include: [{ model: Mentor, attributes: ['nombre', 'especialidad', 'foto_url'] }],
      order: [['fecha_hora', 'ASC']]
    });
    return res.status(200).json({ data: reservas });
  } catch (error) {
    return res.status(500).json({ message: 'Error.', error: error.message });
  }
};

// ACELERADORA: ver reservas de sus mentores
const listarReservasAceleradora = async (req, res) => {
  try {
    const acel = await getAceleradoraOrFail(req.user.id, res);
    if (!acel) return;
    const mentores = await Mentor.findAll({ where: { aceleradora_id: acel.id }, attributes: ['id'] });
    const mentorIds = mentores.map(m => m.id);
    const reservas = await ReservaMentoria.findAll({
      where: { mentor_id: { [Op.in]: mentorIds } },
      include: [
        { model: Mentor, attributes: ['nombre', 'especialidad'] },
        { model: Startup, attributes: ['nombre_comercial'] }
      ],
      order: [['fecha_hora', 'ASC']]
    });
    return res.status(200).json({ data: reservas });
  } catch (error) {
    return res.status(500).json({ message: 'Error.', error: error.message });
  }
};

// ACELERADORA: confirmar/cancelar reserva
const gestionarReserva = async (req, res) => {
  try {
    const acel = await getAceleradoraOrFail(req.user.id, res);
    if (!acel) return;
    const reserva = await ReservaMentoria.findByPk(req.params.id, { include: [{ model: Mentor }] });
    if (!reserva || reserva.Mentor.aceleradora_id !== acel.id) {
      return res.status(404).json({ message: 'Reserva no encontrada.' });
    }
    const { estado } = req.body;
    if (!['confirmada', 'cancelada'].includes(estado)) return res.status(400).json({ message: 'Estado inválido.' });
    await reserva.update({ estado });
    return res.status(200).json({ message: 'Reserva actualizada.', data: reserva });
  } catch (error) {
    return res.status(500).json({ message: 'Error.', error: error.message });
  }
};

module.exports = {
  crearPerk, listarPerksAceleradora, listarPerksDisponiblesStartup, reclamarPerk,
  listarReclamacionesPerk, gestionarReclamacion,
  crearMentor, listarMentoresAceleradora, listarMentoresDisponibles,
  reservarMentoria, listarReservasStartup, listarReservasAceleradora, gestionarReserva
};

