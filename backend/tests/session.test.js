const request = require('supertest');
const app = require('../app');
const { sequelize, Role, User } = require('../models');
const bcrypt = require('bcrypt');

let userCounter = 0;
let authToken = '';

const createSessionUser = async () => {
  userCounter += 1;
  const user = await User.create({
    cedula: `SESS-${String(userCounter).padStart(3, '0')}`,
    nombre_hacienda: `Session Owner ${userCounter}`,
    email: `session.${userCounter}@test.com`,
    password_hash: 'hash',
    role_id: 1
  });
  return user;
};

beforeAll(async () => {
    await sequelize.sync({ force: true });
    await Role.create({ id: 1, nombre: 'admin' });

    const password_hash = await bcrypt.hash('securePassword123', 10);
    await User.create({
        cedula: 'SESS-ADMIN',
        nombre_hacienda: 'Session Admin',
        email: 'session-admin@test.com',
        password_hash,
        role_id: 1
    });
    const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: 'session-admin@test.com', password: 'securePassword123' });
    authToken = loginRes.body.token;
});

afterAll(async () => {
    await sequelize.close();
});

describe('Session API', () => {
    it('Debería crear una sesión', async () => {
        const user = await createSessionUser();

        const res = await request(app)
            .post('/api/sesiones/crear-session')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                user_id: user.id,
                token_jwt: 'mock_token',
                expiracion: new Date(Date.now() + 10000).toISOString(),
                es_valido: true
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body.session).toHaveProperty('id');
    });

    it('Debería obtener las sesiones', async () => {
        const res = await request(app)
            .get('/api/sesiones/obtener-session')
            .set('Authorization', `Bearer ${authToken}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('Debería actualizar una sesión', async () => {
        const user = await createSessionUser();
        const createRes = await request(app)
            .post('/api/sesiones/crear-session')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                user_id: user.id,
                token_jwt: 'mock_token',
                expiracion: new Date(Date.now() + 10000).toISOString(),
                es_valido: true
            });
        const sessionId = createRes.body.session.id;

        const res = await request(app)
            .put(`/api/sesiones/editar-session/${sessionId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                user_id: user.id,
                token_jwt: 'mock_token',
                expiracion: new Date(Date.now() + 10000).toISOString(),
                es_valido: false
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('es_valido', false);
    });

    it('Debería eliminar una sesión', async () => {
        const user = await createSessionUser();
        const createRes = await request(app)
            .post('/api/sesiones/crear-session')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                user_id: user.id,
                token_jwt: 'mock_token',
                expiracion: new Date(Date.now() + 10000).toISOString(),
                es_valido: true
            });
        const sessionId = createRes.body.session.id;

        const res = await request(app)
            .delete(`/api/sesiones/eliminar-session/${sessionId}`)
            .set('Authorization', `Bearer ${authToken}`);
        expect(res.statusCode).toEqual(200);
    });
});
