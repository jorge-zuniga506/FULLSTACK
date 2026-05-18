const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models');
const bcrypt = require('bcrypt');

beforeAll(async () => {
    await sequelize.sync({ force: true });

    // Create Role
    await sequelize.models.Role.create({ id: 1, nombre: 'admin' });
});

afterAll(async () => {
    await sequelize.close();
});

describe('Auth API', () => {
    let authToken = '';

    it('Debería loguear un usuario correctamente', async () => {
        const password_hash = await bcrypt.hash('securePassword123', 10);
        await sequelize.models.User.create({
            cedula: 'auth123456',
            nombre_hacienda: 'Hacienda Auth',
            email: 'auth-login@example.com',
            password_hash: password_hash,
            role_id: 1
        });

        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'auth-login@example.com',
                password: 'securePassword123'
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body.usuario).toHaveProperty('email', 'auth-login@example.com');

        authToken = res.body.token;
    });

    it('No debería loguear con credenciales inválidas', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'noexisto@example.com',
                password: 'wrongpassword'
            });

        expect(res.statusCode).toEqual(401);
    });

    it('Debería obtener los datos del usuario logueado', async () => {
        const res = await request(app)
            .get('/api/auth/me')
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.user).toHaveProperty('email', 'auth-login@example.com');
    });

    it('No debería obtener datos si el token es inválido', async () => {
        const res = await request(app)
            .get('/api/auth/me')
            .set('Authorization', `Bearer token_invalido`);

        expect(res.statusCode).toEqual(401);
    });

    it('Debería cerrar sesión correctamente', async () => {
        const res = await request(app)
            .post('/api/auth/logout')
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Logout exitoso. Token invalidado.');
    });

    it('No debería poder usar el token después de cerrar sesión', async () => {
        const res = await request(app)
            .get('/api/auth/me')
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.statusCode).toEqual(401);
    });
});
