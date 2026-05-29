const SupportService = require('../services/SupportService');

const crearReporteSoporte = async (req, res) => {
  try {
    const reporte = await SupportService.crearReporte({
      actor: req.user,
      data: req.body
    });

    return res.status(201).json({
      message: 'Reporte de soporte enviado correctamente.',
      reporte
    });
  } catch (error) {
    const normalizedMessage = String(error.message || '').toLowerCase();
    const isValidationError = normalizedMessage.includes('requerid')
      || normalizedMessage.includes('minimo')
      || normalizedMessage.includes('invalido');
    const statusCode = isValidationError ? 400 : 500;
    return res.status(statusCode).json({
      message: 'No se pudo enviar el reporte de soporte.',
      error: error.message
    });
  }
};

const listarReportesAdmin = async (req, res) => {
  try {
    const resultado = await SupportService.listarReportesAdmin(req.query);
    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({
      message: 'No se pudieron listar los reportes de soporte.',
      error: error.message
    });
  }
};

const listarMisReportes = async (req, res) => {
  try {
    const resultado = await SupportService.listarReportesPropios(req.user.id, req.query);
    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({
      message: 'No se pudieron listar tus reportes de soporte.',
      error: error.message
    });
  }
};

const actualizarEstadoReporte = async (req, res) => {
  try {
    const reporte = await SupportService.actualizarEstado({
      id: req.params.id,
      estado: req.body?.estado,
      adminNote: req.body?.admin_note
    });

    return res.status(200).json({
      message: 'Estado de soporte actualizado.',
      reporte
    });
  } catch (error) {
    if (error.message === 'Reporte no encontrado.') {
      return res.status(404).json({ message: error.message });
    }

    if (error.message === 'Estado de soporte invalido.') {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({
      message: 'No se pudo actualizar el reporte.',
      error: error.message
    });
  }
};

module.exports = {
  crearReporteSoporte,
  listarReportesAdmin,
  listarMisReportes,
  actualizarEstadoReporte
};
