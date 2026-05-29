const express = require('express');
const router = express.Router();
const { getTipoCambio } = require('../controllers/ExchangeRateController');

// Publica: tipo de cambio oficial (CRC/USD y CRC/EUR)
router.get('/tc', getTipoCambio);

module.exports = router;

