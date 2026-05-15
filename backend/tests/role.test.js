const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models');

beforeAll(async () => {
    await sequelize.sync({ force: true });
});

afterAll(async () => {
    await sequelize.close();
});

describe('Role API', () => {
    let createdRoleId;

    it('Debería crear un rol', async () => {
        const res = await request(app)
            .post('/api/roles/crear-rol')
            .send({
                nombre: 'superadmin'
            });
        
        expect(res.statusCode).toEqual(201);
        expect(res.body.role).toHaveProperty('id');
        createdRoleId = res.body.role.id;
    });

    it('Debería obtener los roles', async () => {
        const res = await request(app).get('/api/roles/obtener-roles');
        
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('Debería actualizar un rol', async () => {
        const res = await request(app)
            .put(`/api/roles/editar-rol/${createdRoleId}`)
            .send({
                nombre: 'manager'
            });
        
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('nombre', 'manager');
    });

    it('Debería eliminar un rol', async () => {
        const res = await request(app).delete(`/api/roles/eliminar-rol/${createdRoleId}`);
        expect(res.statusCode).toEqual(200);
    });
});
