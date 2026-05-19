const chatbotService = require('../services/ChatbotService');

class ChatbotController {
  async ask(req, res) {
    try {
      const { message } = req.body;

      if (!message) {
        return res.status(400).json({ error: 'El mensaje es requerido.' });
      }

      const result = await chatbotService.processMessage(message);

      return res.status(200).json({
        response: result.mensaje,
        data: result.data
      });
    } catch (error) {
      console.error('Error en ChatbotController:', error);
      return res.status(500).json({
        error: 'Error interno del servidor al comunicarse con la IA.'
      });
    }
  }
}

module.exports = new ChatbotController();
