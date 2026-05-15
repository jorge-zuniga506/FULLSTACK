const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models');

beforeAll(async () => {
    await sequelize.sync({ force: true });
});

afterAll(async () => {
    await sequelize.close();
});

describe('Communication API', () => {
    let createdMensajeId;
    let createdConsultaId;

    it('Debería enviar un mensaje', async () => {
        const res = await request(app)
            .post('/api/communication/mensajes')
            .send({
                emisor_id: 1,
                chat_id: 1,
                contenido: 'Hola mundo'
            });
        
        expect(res.statusCode).toEqual(201);
        expect(res.body.mensaje).toHaveProperty('id');
        createdMensajeId = res.body.mensaje.id;
    });

    it('Debería obtener los mensajes', async () => {
        const res = await request(app).get('/api/communication/mensajes');
        
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('Debería actualizar un mensaje', async () => {
        const res = await request(app)
            .put(`/api/communication/mensajes/${createdMensajeId}`)
            .send({
                emisor_id: 1,
                chat_id: 1,
                contenido: 'Hola mundo editado',
                leido: true
            });
        
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('leido', true);
    });

    it('Debería eliminar un mensaje', async () => {
        const res = await request(app).delete(`/api/communication/mensajes/${createdMensajeId}`);
        expect(res.statusCode).toEqual(200);
    });

    it('Debería guardar una consulta de IA', async () => {
        const res = await request(app)
            .post('/api/communication/consultas-ia')
            .send({
                user_id: 1,
                pregunta_usuario: '¿Qué es una startup?',
                respuesta_ia: 'Una startup es...',
                modelo: 'gpt-4'
            });
        
        expect(res.statusCode).toEqual(201);
        expect(res.body.consultaIA).toHaveProperty('id');
        createdConsultaId = res.body.consultaIA.id;
    });

    it('Debería obtener el historial de consultas de IA', async () => {
        const res = await request(app).get('/api/communication/consultas-ia');
        
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('Debería eliminar una consulta de IA', async () => {
        const res = await request(app).delete(`/api/communication/consultas-ia/${createdConsultaId}`);
        expect(res.statusCode).toEqual(200);
    });
});
