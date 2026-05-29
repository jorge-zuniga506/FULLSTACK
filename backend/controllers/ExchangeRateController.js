const ExchangeRateService = require('../services/ExchangeRateService');

const getTipoCambio = async (_req, res) => {
  try {
    const rates = await ExchangeRateService.getCurrentRates();
    return res.status(200).json({
      message: 'Tipo de cambio obtenido exitosamente.',
      ...rates
    });
  } catch (error) {
    return res.status(502).json({
      message: 'No se pudo consultar el tipo de cambio de Hacienda.',
      error: error.message
    });
  }
};

module.exports = {
  getTipoCambio
};

