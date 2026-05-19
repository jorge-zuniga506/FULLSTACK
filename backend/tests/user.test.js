const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models');
const bcrypt = require('bcrypt');

let userCounter = 0;
let authToken = '';

const createTestUser = async () => {
  userCounter += 1;
  const res = await request(app)
    .post('/api/usuarios/crear-usuario')
    .send({
      cedula: `USR-${String(userCounter).padStart(4, '0')}`,
      nombre_hacienda: `Hacienda Test ${userCounter}`,
      email: `test.${userCounter}.${Date.now()}@example.com`,
      password_hash: 'securePassword123',
      role_id: 2
    });
  return res;
};

beforeAll(async () => {
    await sequelize.sync({ force: true });
    await sequelize.models.Role.bulkCreate([
        { id: 1, nombre: 'admin' },
        { id: 2, nombre: 'startup' },
        { id: 3, nombre: 'aceleradora' },
        { id: 4, nombre: 'inversor' }
    ]);

    // Create admin user and get auth token
    const password_hash = await bcrypt.hash('securePassword123', 10);
    await sequelize.models.User.create({
        cedula: 'ADMIN-USR',
        nombre_hacienda: 'Admin User',
        email: 'admin-user@test.com',
        password_hash,
        role_id: 1
    });
    const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: 'admin-user@test.com', password: 'securePassword123' });
    authToken = loginRes.body.token;
});

afterAll(async () => {
    await sequelize.close();
});

describe('User CRUD API', () => {
    it('Debería crear un usuario exitosamente (público)', async () => {
        const res = await createTestUser();

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message', 'Usuario creado exitosamente');
        expect(res.body.usuario).toHaveProperty('id');
    });

    it('No debería crear usuario con un correo inválido', async () => {
        const res = await request(app)
            .post('/api/usuarios/crear-usuario')
            .send({
                cedula: '0987654321',
                nombre_hacienda: 'Hacienda El Dorado',
                email: 'invalid-email',
                password_hash: 'securePassword123',
                role_id: 1
            });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('errors');
    });

    it('Debería obtener los usuarios (admin)', async () => {
        await createTestUser();

        const res = await request(app)
            .get('/api/usuarios/obtener-usuario')
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).not.toHaveProperty('password_hash');
    });

    it('Debería actualizar un usuario', async () => {
        const createRes = await createTestUser();
        const userId = createRes.body.usuario.id;

        const res = await request(app)
            .put(`/api/usuarios/editar-usuarios/${userId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                cedula: '1234567890',
                nombre_hacienda: 'Hacienda La Esmeralda Editada',
                email: 'test@example.com',
                password_hash: 'securePassword123'
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('nombre_hacienda', 'Hacienda La Esmeralda Editada');
    });

    it('Debería rechazar actualización si se intenta cambiar el rol', async () => {
        const createRes = await createTestUser();
        const userId = createRes.body.usuario.id;

        const res = await request(app)
            .put(`/api/usuarios/editar-usuarios/${userId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                cedula: '1234567890',
                nombre_hacienda: 'Hacienda La Esmeralda Editada',
                email: 'test@example.com',
                password_hash: 'securePassword123',
                role_id: 2
            });

        expect(res.statusCode).toEqual(403);
    });

    it('Debería eliminar un usuario (admin)', async () => {
        const createRes = await createTestUser();
        const userId = createRes.body.usuario.id;

        const res = await request(app)
            .delete(`/api/usuarios/eliminar-usuario/${userId}`)
            .set('Authorization', `Bearer ${authToken}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Usuario eliminado correctamente');
    });
});
