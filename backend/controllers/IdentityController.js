const HaciendaService = require('../services/HaciendaService');

const consultarCedula = async (req, res) => {
  try {
    const { cedula } = req.params;
    if (!cedula) {
      return res.status(400).json({ message: 'La cédula es requerida.' });
    }
    const result = await HaciendaService.consultarCedula(cedula);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(404).json({
      message: 'No se pudo validar la cédula con el Ministerio de Hacienda.',
      error: error.message
    });
  }
};

module.exports = { consultarCedula };
