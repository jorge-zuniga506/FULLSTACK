const express = require('express');
const router = express.Router();
const { consultarCedula } = require('../controllers/IdentityController');

// Ruta pública para consultar cédula
router.get('/hacienda/:cedula', consultarCedula);

module.exports = router;
