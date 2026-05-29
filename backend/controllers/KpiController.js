/**
 * KpiController.js
 * Registro y visualización de KPIs de startups durante el programa.
 */
const { KpiStartup, Startup, Postulacion, Convocatoria, Aceleradora, User } = require('../models');

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

// ── STARTUP: registrar KPI ────────────────────────────────────────────────────
const registrarKpi = async (req, res) => {
  try {
    const startup = await Startup.findOne({ where: { user_id: req.user.id } });
    if (!startup) return res.status(404).json({ message: 'Startup no encontrada.' });

    const { periodo, nuevos_usuarios, ventas_mensuales, costo_adquisicion, notas, convocatoria_id } = req.body;
    if (!periodo) return res.status(400).json({ message: 'El periodo es requerido (ej: 2026-01).' });

    const kpi = await KpiStartup.create({
      startup_id: startup.id,
      convocatoria_id: convocatoria_id || null,
      periodo,
      nuevos_usuarios: nuevos_usuarios || 0,
      ventas_mensuales: ventas_mensuales || 0,
      costo_adquisicion: costo_adquisicion || 0,
      notas
    });

    return res.status(201).json({ message: 'KPI registrado exitosamente.', data: kpi });
  } catch (error) {
    return res.status(500).json({ message: 'Error al registrar KPI.', error: error.message });
  }
};

// ── STARTUP: listar sus propios KPIs ─────────────────────────────────────────
const listarKpisStartup = async (req, res) => {
  try {
    const startup = await Startup.findOne({ where: { user_id: req.user.id } });
    if (!startup) return res.status(404).json({ message: 'Startup no encontrada.' });

    const kpis = await KpiStartup.findAll({
      where: { startup_id: startup.id },
      order: [['periodo', 'DESC']]
    });

    return res.status(200).json({ data: kpis });
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener KPIs.', error: error.message });
  }
};

// ── ACELERADORA: ver KPIs de todas las startups de sus convocatorias ──────────
const listarKpisCohorte = async (req, res) => {
  try {
    const aceleradora = await ensureAceleradoraProfile(req.user.id);
    if (!aceleradora) return res.status(404).json({ message: 'Usuario no encontrado.' });

    // Obtener IDs de startups aceptadas en sus convocatorias
    const { Op } = require('sequelize');
    const convs = await Convocatoria.findAll({ where: { aceleradora_id: aceleradora.id }, attributes: ['id'] });
    const convIds = convs.map(c => c.id);

    const postulacionesAceptadas = await Postulacion.findAll({
      where: { convocatoria_id: { [Op.in]: convIds }, estado: 'Aceptada' },
      attributes: ['startup_id']
    });
    const startupIds = [...new Set(postulacionesAceptadas.map(p => p.startup_id))];

    if (startupIds.length === 0) {
      return res.status(200).json({ data: [] });
    }

    const kpis = await KpiStartup.findAll({
      where: { startup_id: { [Op.in]: startupIds } },
      include: [{ model: Startup, attributes: ['nombre_comercial'], include: [{ model: User, attributes: ['nombre'] }] }],
      order: [['periodo', 'DESC']]
    });

    return res.status(200).json({ data: kpis });
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener KPIs de cohorte.', error: error.message });
  }
};

module.exports = { registrarKpi, listarKpisStartup, listarKpisCohorte };

