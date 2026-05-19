const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models');
const chatbotService = require('../services/ChatbotService');

// Mockear ChatbotService para evitar llamadas a la API externa de Gemini en los tests
jest.spyOn(chatbotService, 'processMessage').mockImplementation(async (message) => {
  if (message.includes('error')) {
    throw new Error('Simulated service error');
  }
  if (message.includes('startup')) {
    return {
      mensaje: 'Encontré la startup TechNova en fase Idea.',
      data: [{ nombre_comercial: 'TechNova', fase: 'Idea' }]
    };
  }
  return {
    mensaje: 'Hola, señor. Soy JARVIS. ¿En qué le puedo asistir?',
    data: []
  };
});

beforeAll(async () => {
  // Sincronizar base de datos de test
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  // Cerrar conexión
  await sequelize.close();
});

describe('Chatbot API Endpoint (/api/chatbot/ask)', () => {
  it('Debería retornar un error 400 si el mensaje no es provisto', async () => {
    const res = await request(app)
      .post('/api/chatbot/ask')
      .send({});
    
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error', 'El mensaje es requerido.');
  });

  it('Debería responder exitosamente a un mensaje genérico', async () => {
    const res = await request(app)
      .post('/api/chatbot/ask')
      .send({ message: 'Hola' });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('response', 'Hola, señor. Soy JARVIS. ¿En qué le puedo asistir?');
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toEqual([]);
  });

  it('Debería retornar los resultados de base de datos en el campo data', async () => {
    const res = await request(app)
      .post('/api/chatbot/ask')
      .send({ message: 'Háblame de una startup' });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('response', 'Encontré la startup TechNova en fase Idea.');
    expect(res.body.data).toEqual([{ nombre_comercial: 'TechNova', fase: 'Idea' }]);
  });

  it('Debería retornar error 500 si el servicio lanza una excepción', async () => {
    const res = await request(app)
      .post('/api/chatbot/ask')
      .send({ message: 'Provocar un error' });
    
    expect(res.statusCode).toEqual(500);
    expect(res.body).toHaveProperty('error', 'Error interno del servidor al comunicarse con la IA.');
  });
});
