const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/ChatbotController');
// Aquí se podría importar el middleware 'authMiddleware' si queremos que el chat sea solo para usuarios autenticados,
// pero por ahora lo dejaremos público o lo agregaremos después según los requerimientos.


// Endpoint para el chat.
router.post('/ask', chatbotController.ask);

module.exports = router;
