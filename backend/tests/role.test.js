const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models');
const bcrypt = require('bcrypt');

let roleCounter = 0;
let authToken = '';

const createTestRole = async () => {
  roleCounter += 1;
  const res = await request(app)
    .post('/api/roles/crear-rol')
    .set('Authorization', `Bearer ${authToken}`)
    .send({ nombre: `testrole-${roleCounter}-${Date.now()}` });
  return res;
};

beforeAll(async () => {
    await sequelize.sync({ force: true });
    await sequelize.models.Role.create({ id: 1, nombre: 'admin' });

    const password_hash = await bcrypt.hash('securePassword123', 10);
    await sequelize.models.User.create({
        cedula: 'ROLE-ADMIN',
        nombre_hacienda: 'Role Admin',
        email: 'role-admin@test.com',
        password_hash,
        role_id: 1
    });
    const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: 'role-admin@test.com', password: 'securePassword123' });
    authToken = loginRes.body.token;
});

afterAll(async () => {
    await sequelize.close();
});

describe('Role API', () => {
    it('Debería crear un rol', async () => {
        const res = await createTestRole();
        expect(res.statusCode).toEqual(201);
        expect(res.body.role).toHaveProperty('id');
    });

    it('Debería obtener los roles', async () => {
        const res = await request(app)
            .get('/api/roles/obtener-roles')
            .set('Authorization', `Bearer ${authToken}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('Debería actualizar un rol', async () => {
        const createRes = await createTestRole();
        const roleId = createRes.body.role.id;

        const res = await request(app)
            .put(`/api/roles/editar-rol/${roleId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({ nombre: 'manager' });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('nombre', 'manager');
    });

    it('Debería eliminar un rol', async () => {
        const createRes = await createTestRole();
        const roleId = createRes.body.role.id;

        const res = await request(app)
            .delete(`/api/roles/eliminar-rol/${roleId}`)
            .set('Authorization', `Bearer ${authToken}`);
        expect(res.statusCode).toEqual(200);
    });
});
