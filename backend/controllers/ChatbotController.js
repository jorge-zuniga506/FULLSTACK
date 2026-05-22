const chatbotService = require('../services/ChatbotService');

class ChatbotController {
  async listSkills(req, res) {
    try {
      return res.status(200).json({
        assistant: 'J.A.R.V.I.S.',
        skills: chatbotService.getSkillDefinitions()
      });
    } catch (error) {
      console.error('Error en ChatbotController.listSkills:', error);
      return res.status(500).json({
        error: 'Error interno del servidor al listar las skills de JARVIS.'
      });
    }
  }

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

  async classifyRequest(req, res) {
    try {
      const { text, message, description } = req.body;
      const input = text || message || description;

      if (!input) {
        return res.status(400).json({ error: 'El texto de la solicitud es requerido.' });
      }

      const result = await chatbotService.classifyRequest(input);

      return res.status(200).json(result);
    } catch (error) {
      console.error('Error en ChatbotController.classifyRequest:', error);
      return res.status(500).json({
        error: 'Error interno del servidor al clasificar la solicitud con IA.'
      });
    }
  }
}

module.exports = new ChatbotController();
