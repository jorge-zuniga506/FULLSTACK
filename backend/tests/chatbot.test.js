const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models');
const chatbotService = require('../services/ChatbotService');

jest.spyOn(chatbotService, 'processMessage').mockImplementation(async (message) => {
  if (message.includes('error')) {
    throw new Error('Simulated service error');
  }
  if (message.includes('startup')) {
    return {
      mensaje: 'Encontre la startup TechNova en fase Idea.',
      data: [{ nombre_comercial: 'TechNova', fase: 'Idea' }]
    };
  }
  return {
    mensaje: 'Hola, senor. Soy JARVIS. En que le puedo asistir?',
    data: []
  };
});

jest.spyOn(chatbotService, 'classifyRequest').mockImplementation(async (text) => {
  if (text.includes('error')) {
    throw new Error('Simulated classification error');
  }
  if (text.includes('capital')) {
    return {
      tipo: 'inversor',
      confianza: 0.86,
      razon: 'La solicitud menciona capital de inversion.',
      requiere_revision: false,
      proveedor: 'local-rules'
    };
  }
  return {
    tipo: 'startup',
    confianza: 0.72,
    razon: 'La solicitud describe un emprendimiento.',
    requiere_revision: false,
    proveedor: 'local-rules'
  };
});

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Chatbot API Endpoint (/api/chatbot/ask)', () => {
  it('deberia retornar error 400 si el mensaje no es provisto', async () => {
    const res = await request(app)
      .post('/api/chatbot/ask')
      .send({});

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error', 'El mensaje es requerido.');
  });

  it('deberia responder exitosamente a un mensaje generico', async () => {
    const res = await request(app)
      .post('/api/chatbot/ask')
      .send({ message: 'Hola' });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('response', 'Hola, senor. Soy JARVIS. En que le puedo asistir?');
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toEqual([]);
  });

  it('deberia responder desde el alias de IA /api/ai/chat', async () => {
    const res = await request(app)
      .post('/api/ai/chat')
      .send({ message: 'Hola' });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('response', 'Hola, senor. Soy JARVIS. En que le puedo asistir?');
    expect(res.body).toHaveProperty('data');
  });

  it('deberia listar las skills disponibles de JARVIS', async () => {
    const res = await request(app)
      .get('/api/ai/skills');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('assistant', 'J.A.R.V.I.S.');
    expect(res.body.skills).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'buscar_startups' }),
        expect.objectContaining({ id: 'buscar_aceleradoras' }),
        expect.objectContaining({ id: 'buscar_inversores' }),
        expect.objectContaining({ id: 'buscar_solicitudes' }),
        expect.objectContaining({ id: 'crear_solicitud' })
      ])
    );
  });

  it('deberia retornar los resultados de base de datos en el campo data', async () => {
    const res = await request(app)
      .post('/api/chatbot/ask')
      .send({ message: 'Hablame de una startup' });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('response', 'Encontre la startup TechNova en fase Idea.');
    expect(res.body.data).toEqual([{ nombre_comercial: 'TechNova', fase: 'Idea' }]);
  });

  it('deberia retornar error 500 si el servicio lanza una excepcion', async () => {
    const res = await request(app)
      .post('/api/chatbot/ask')
      .send({ message: 'Provocar un error' });

    expect(res.statusCode).toEqual(500);
    expect(res.body).toHaveProperty('error', 'Error interno del servidor al comunicarse con la IA.');
  });

  it('deberia clasificar automaticamente una solicitud de incorporacion', async () => {
    const res = await request(app)
      .post('/api/ai/classify-request')
      .send({ text: 'Busco registrar un fondo con capital para invertir en startups.' });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toMatchObject({
      tipo: 'inversor',
      confianza: 0.86,
      requiere_revision: false,
      proveedor: 'local-rules'
    });
  });

  it('deberia retornar 400 si la clasificacion no recibe texto', async () => {
    const res = await request(app)
      .post('/api/ai/classify-request')
      .send({});

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error', 'El texto de la solicitud es requerido.');
  });

  it('deberia retornar error 500 si falla la clasificacion', async () => {
    const res = await request(app)
      .post('/api/ai/classify-request')
      .send({ text: 'Provocar error' });

    expect(res.statusCode).toEqual(500);
    expect(res.body).toHaveProperty('error', 'Error interno del servidor al clasificar la solicitud con IA.');
  });
});
