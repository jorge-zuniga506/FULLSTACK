const HaciendaService = require('../services/HaciendaService');

const consultarCedula = async (req, res) => {
  try {
    const { cedula } = req.params;

    if (!cedula) {
      return res.status(400).json({ message: 'La cédula es requerida.' });
    }

    const result = await HaciendaService.consultarCedula(cedula);
    const fallbackLocal = result?.source === 'local';

    return res.status(200).json({
      message: fallbackLocal
        ? 'Cédula validada usando datos locales por indisponibilidad temporal de Hacienda.'
        : 'Cédula validada correctamente en Hacienda.',
      nombreCompleto: result?.nombreCompleto || null,
      source: result?.source || 'hacienda'
    });
  } catch (error) {
    const statusCode = Number(error?.statusCode) || 500;

    return res.status(statusCode).json({
      message: error?.message || 'No se pudo validar la cédula con el Ministerio de Hacienda.'
    });
  }
};

module.exports = { consultarCedula };
