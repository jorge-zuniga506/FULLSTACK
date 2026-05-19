const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models');

beforeAll(async () => {
    await sequelize.sync({ force: true });
    
    // Create Role and User for Session testing
    await sequelize.models.Role.create({ id: 1, nombre: 'admin' });
    await sequelize.models.User.create({
        id: 1,
        cedula: 'sess123456',
        nombre_hacienda: 'Hacienda Sess',
        email: 'sess@example.com',
        password_hash: 'hash',
        role_id: 1
    });
});

afterAll(async () => {
    await sequelize.close();
});

describe('Session API', () => {
    let createdSessionId;

    it('Debería crear una sesión', async () => {
        const res = await request(app)
            .post('/api/sesiones/crear-session')
            .send({
                user_id: 1,
                token_jwt: 'mock_token',
                expiracion: new Date(Date.now() + 10000).toISOString(),
                es_valido: true
            });
        
        expect(res.statusCode).toEqual(201);
        expect(res.body.session).toHaveProperty('id');
        createdSessionId = res.body.session.id;
    });

    it('Debería obtener las sesiones', async () => {
        const res = await request(app).get('/api/sesiones/obtener-session');
        
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('Debería actualizar una sesión', async () => {
        const res = await request(app)
            .put(`/api/sesiones/editar-session/${createdSessionId}`)
            .send({
                user_id: 1,
                token_jwt: 'mock_token',
                expiracion: new Date(Date.now() + 10000).toISOString(),
                es_valido: false
            });
        
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('es_valido', false);
    });

    it('Debería eliminar una sesión', async () => {
        const res = await request(app).delete(`/api/sesiones/eliminar-session/${createdSessionId}`);
        expect(res.statusCode).toEqual(200);
    });
});
