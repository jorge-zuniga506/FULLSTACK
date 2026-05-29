const { Startup, Aceleradora, Inversor, User, Sector, Session } = require('../models');

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

const getStartupDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    // Obtener la Startup asociada al usuario
    const startup = await Startup.findOne({
      where: { user_id: userId },
      include: [{ model: Sector }]
    });

    // Responder con estadísticas de Startup premium
    return res.status(200).json({
      role: 'startup',
      title: 'Panel de Control de Startup',
      subtitle: startup ? `Gestionando: ${startup.nombre_empresa}` : 'No tienes una startup registrada aún.',
      startupInfo: startup || null,
      stats: [
        { label: 'Valoración Estimada', value: startup && startup.valoracion ? `$${Number(startup.valoracion).toLocaleString()}` : '$150,000', change: '+12.5%', icon: '🚀' },
        { label: 'Empleados Activos', value: '8', change: '+2', icon: '👥' },
        { label: 'Mensajes Recibidos', value: '24', change: '+5 nuevos', icon: '💬' },
        { label: 'Inversionistas Interesados', value: '4', change: '+1 esta semana', icon: '💰' }
      ],
      metricsList: [
        { label: 'Crecimiento Trimestral', value: 34, color: '#34d399' },
        { label: 'Adquisición de Clientes', value: 72, color: '#8b00dd' },
        { label: 'Retención de Producto', value: 88, color: '#60a5fa' }
      ]
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener dashboard de startup', error: error.message });
  }
};

const getAceleradoraDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const aceleradora = await ensureAceleradoraProfile(userId);

    return res.status(200).json({
      role: 'aceleradora',
      title: 'Panel de Control de Aceleradora',
      subtitle: aceleradora ? `Entidad: ${aceleradora.nombre}` : 'No tienes aceleradora registrada aun.',
      aceleradoraInfo: aceleradora || null,
      stats: [
        { label: 'Startups Aceleradas', value: '18', change: '+3 activas', icon: '⚡' },
        { label: 'Mentores Activos', value: '42', change: '+6', icon: '👩‍🏫' },
        { label: 'Capital Total Movilizado', value: '$2.4M', change: '+15.2%', icon: '📈' },
        { label: 'Cohorte Actual', value: 'Batch 2026-A', change: '80% progreso', icon: '🗓️' }
      ],
      metricsList: [
        { label: 'Tasa de Éxito de Cohorte', value: 85, color: '#34d399' },
        { label: 'Satisfacción de Startups', value: 94, color: '#8b00dd' },
        { label: 'Mentorías Completadas', value: 68, color: '#60a5fa' }
      ]
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener dashboard de aceleradora', error: error.message });
  }
};

const getInversorDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const inversor = await ensureInversorProfile(userId);

    return res.status(200).json({
      role: 'inversor',
      title: 'Panel de Inversionista',
      subtitle: inversor ? `Portafolio de: ${inversor.nombre || 'Inversionista Independiente'}` : 'Perfil de inversionista no configurado.',
      inversorInfo: inversor || null,
      stats: [
        { label: 'Inversion en Portafolio', value: inversor && inversor.presupuesto_max ? `$${Number(inversor.presupuesto_max).toLocaleString()}` : '$750,000', change: 'Disponible', icon: '💼' },
        { label: 'Startups Financiadas', value: '6', change: '+1 este mes', icon: '🤝' },
        { label: 'ROI Promedio', value: '24.8%', change: '+3.2%', icon: '📊' },
        { label: 'Decks Revisados', value: '112', change: '+14 hoy', icon: '📂' }
      ],
      metricsList: [
        { label: 'Diversificación en Sectores', value: 60, color: '#34d399' },
        { label: 'Rendimiento de Portafolio', value: 78, color: '#8b00dd' },
        { label: 'Liquidez Disponible', value: 90, color: '#60a5fa' }
      ]
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener dashboard de inversor', error: error.message });
  }
};

const getAdminDashboard = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalSessions = await Session.count({ where: { es_valido: true } });
    const totalStartups = await Startup.count();

    return res.status(200).json({
      role: 'admin',
      title: 'Consola de Administración Central',
      subtitle: 'Visión general de la infraestructura y métricas globales.',
      stats: [
        { label: 'Usuarios Registrados', value: totalUsers.toString(), change: '+18% mensual', icon: '👥' },
        { label: 'Sesiones Activas', value: totalSessions.toString(), change: 'En tiempo real', icon: '🔑' },
        { label: 'Startups en Plataforma', value: totalStartups.toString(), change: '+4 esta semana', icon: '🚀' },
        { label: 'Estado del Sistema', value: '99.9%', change: 'Óptimo', icon: '🛡️' }
      ],
      metricsList: [
        { label: 'Uso de CPU Servidor', value: 24, color: '#34d399' },
        { label: 'Capacidad de BD Utilizada', value: 12, color: '#8b00dd' },
        { label: 'Eficiencia de Respuestas API', value: 98, color: '#60a5fa' }
      ]
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener dashboard de administrador', error: error.message });
  }
};

module.exports = {
  getStartupDashboard,
  getAceleradoraDashboard,
  getInversorDashboard,
  getAdminDashboard
};

