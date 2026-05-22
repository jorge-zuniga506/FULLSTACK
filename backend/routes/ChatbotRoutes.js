const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/ChatbotController');
// Aquí se podría importar el middleware 'authMiddleware' si queremos que el chat sea solo para usuarios autenticados,
// pero por ahora lo dejaremos público o lo agregaremos después según los requerimientos.


// Endpoint para el chat.
router.get('/skills', chatbotController.listSkills);
router.post('/ask', chatbotController.ask);
router.post('/chat', chatbotController.ask);
router.post('/classify-request', chatbotController.classifyRequest);

module.exports = router;
