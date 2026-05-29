/**
 * ConvocatoriaController.js
 * Gestión del pipeline de convocatorias (Kanban) entre Aceleradoras y Startups.
 */
const { Convocatoria, Postulacion, Aceleradora, Startup, Sector, User } = require('../models');

const ensureAceleradoraProfile = async (userId) => {
  const user = await User.findByPk(userId, { attributes: ['id', 'nombre_hacienda'] });
  if (!user) return null;

  const [aceleradora] = await Aceleradora.findOrCreate({
    where: { user_id: userId },
    defaults: {
      nombre: user.nombre_hacienda || `Aceleradora ${userId}`
    }
  });

  return aceleradora;
};

// ── ACELERADORA: crear una convocatoria ───────────────────────────────────────
const crearConvocatoria = async (req, res) => {
  try {
    const aceleradora = await ensureAceleradoraProfile(req.user.id);
    if (!aceleradora) return res.status(404).json({ message: 'Usuario no encontrado.' });

    const { nombre_batch, descripcion, requisitos, fecha_inicio, fecha_cierre, estado } = req.body;
    if (!nombre_batch) return res.status(400).json({ message: 'El nombre del batch es requerido.' });

    const conv = await Convocatoria.create({
      aceleradora_id: aceleradora.id,
      nombre_batch,
      descripcion,
      requisitos,
      fecha_inicio,
      fecha_cierre,
      estado: estado || 'borrador'
    });

    return res.status(201).json({ message: 'Convocatoria creada exitosamente.', data: conv });
  } catch (error) {
    return res.status(500).json({ message: 'Error al crear convocatoria.', error: error.message });
  }
};

// ── ACELERADORA: listar sus propias convocatorias ─────────────────────────────
const listarConvocatoriasAceleradora = async (req, res) => {
  try {
    const aceleradora = await ensureAceleradoraProfile(req.user.id);
    if (!aceleradora) return res.status(404).json({ message: 'Usuario no encontrado.' });

    const convocatorias = await Convocatoria.findAll({
      where: { aceleradora_id: aceleradora.id },
      order: [['created_at', 'DESC']]
    });

    return res.status(200).json({ data: convocatorias });
  } catch (error) {
    return res.status(500).json({ message: 'Error al listar convocatorias.', error: error.message });
  }
};

// ── ACELERADORA: actualizar convocatoria ──────────────────────────────────────
const actualizarConvocatoria = async (req, res) => {
  try {
    const aceleradora = await ensureAceleradoraProfile(req.user.id);
    if (!aceleradora) return res.status(404).json({ message: 'Usuario no encontrado.' });

    const conv = await Convocatoria.findOne({ where: { id: req.params.id, aceleradora_id: aceleradora.id } });
    if (!conv) return res.status(404).json({ message: 'Convocatoria no encontrada.' });

    await conv.update(req.body);
    return res.status(200).json({ message: 'Convocatoria actualizada.', data: conv });
  } catch (error) {
    return res.status(500).json({ message: 'Error al actualizar convocatoria.', error: error.message });
  }
};

// ── PÚBLICO/STARTUP: ver convocatorias abiertas ───────────────────────────────
const listarConvocatoriasPublicas = async (req, res) => {
  try {
    const convocatorias = await Convocatoria.findAll({
      where: { estado: 'abierta' },
      include: [{ model: Aceleradora, attributes: ['nombre', 'sitio_web'] }],
      order: [['fecha_cierre', 'ASC']]
    });
    return res.status(200).json({ data: convocatorias });
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener convocatorias.', error: error.message });
  }
};

// ── STARTUP: postular a una convocatoria ─────────────────────────────────────
const postularStartup = async (req, res) => {
  try {
    const startup = await Startup.findOne({ where: { user_id: req.user.id } });
    if (!startup) return res.status(404).json({ message: 'Perfil de startup no encontrado.' });

    const { convocatoria_id, pitch_deck_url, mensaje } = req.body;
    if (!convocatoria_id) return res.status(400).json({ message: 'convocatoria_id es requerido.' });

    const conv = await Convocatoria.findByPk(convocatoria_id);
    if (!conv || conv.estado !== 'abierta') {
      return res.status(400).json({ message: 'La convocatoria no está disponible para postulaciones.' });
    }

    // Verificar que no haya aplicado antes
    const yaPostulo = await Postulacion.findOne({ where: { convocatoria_id, startup_id: startup.id } });
    if (yaPostulo) return res.status(409).json({ message: 'Ya postulaste a esta convocatoria.' });

    const post = await Postulacion.create({
      convocatoria_id,
      startup_id: startup.id,
      pitch_deck_url,
      mensaje,
      estado: 'Recibida'
    });

    return res.status(201).json({ message: 'Postulación enviada exitosamente.', data: post });
  } catch (error) {
    return res.status(500).json({ message: 'Error al postular.', error: error.message });
  }
};

// ── STARTUP: ver sus propias postulaciones ────────────────────────────────────
const listarPostulacionesStartup = async (req, res) => {
  try {
    const startup = await Startup.findOne({ where: { user_id: req.user.id } });
    if (!startup) return res.status(404).json({ message: 'Startup no encontrada.' });

    const postulaciones = await Postulacion.findAll({
      where: { startup_id: startup.id },
      include: [{ model: Convocatoria, include: [{ model: Aceleradora, attributes: ['nombre'] }] }],
      order: [['created_at', 'DESC']]
    });

    return res.status(200).json({ data: postulaciones });
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener postulaciones.', error: error.message });
  }
};

// ── ACELERADORA: ver todas las postulaciones de sus convocatorias ─────────────
const listarPostulaciones = async (req, res) => {
  try {
    const aceleradora = await ensureAceleradoraProfile(req.user.id);
    if (!aceleradora) return res.status(404).json({ message: 'Usuario no encontrado.' });

    const { convocatoria_id } = req.query;
    const whereConv = { aceleradora_id: aceleradora.id };
    if (convocatoria_id) whereConv.id = convocatoria_id;

    const convs = await Convocatoria.findAll({ where: whereConv, attributes: ['id'] });
    const convIds = convs.map(c => c.id);

    const { Op } = require('sequelize');
    const postulaciones = await Postulacion.findAll({
      where: { convocatoria_id: { [Op.in]: convIds } },
      include: [
        { model: Startup, include: [{ model: User, attributes: ['nombre', 'email'] }, { model: Sector, attributes: ['nombre'] }] },
        { model: Convocatoria, attributes: ['nombre_batch', 'estado'] }
      ],
      order: [['created_at', 'DESC']]
    });

    return res.status(200).json({ data: postulaciones });
  } catch (error) {
    return res.status(500).json({ message: 'Error al listar postulaciones.', error: error.message });
  }
};

// ── ACELERADORA: cambiar estado de una postulación (Kanban) ──────────────────
const cambiarEstadoPostulacion = async (req, res) => {
  try {
    const aceleradora = await ensureAceleradoraProfile(req.user.id);
    if (!aceleradora) return res.status(404).json({ message: 'Usuario no encontrado.' });

    const { estado } = req.body;
    const estadosValidos = ['Recibida', 'Entrevistada', 'Aceptada', 'Rechazada'];
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ message: `Estado inválido. Use: ${estadosValidos.join(', ')}` });
    }

    const post = await Postulacion.findByPk(req.params.id, {
      include: [{ model: Convocatoria, where: { aceleradora_id: aceleradora.id } }]
    });

    if (!post) return res.status(404).json({ message: 'Postulación no encontrada o no te pertenece.' });

    await post.update({ estado, updated_at: new Date() });
    return res.status(200).json({ message: 'Estado actualizado.', data: post });
  } catch (error) {
    return res.status(500).json({ message: 'Error al cambiar estado.', error: error.message });
  }
};

module.exports = {
  crearConvocatoria,
  listarConvocatoriasAceleradora,
  actualizarConvocatoria,
  listarConvocatoriasPublicas,
  postularStartup,
  listarPostulacionesStartup,
  listarPostulaciones,
  cambiarEstadoPostulacion
};

