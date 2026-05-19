const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models');

beforeAll(async () => {
    await sequelize.sync({ force: true });
    await sequelize.models.Role.create({ id: 3, nombre: 'aceleradora' });
    await sequelize.models.User.create({
        id: 1,
        cedula: 'acel1234',
        nombre_hacienda: 'Aceleradora User',
        email: 'acel@example.com',
        password_hash: 'secure123',
        role_id: 3
    });
});

afterAll(async () => {
    await sequelize.close();
});

describe('Aceleradora CRUD API', () => {
    let createdAceleradoraId;

    it('Debería crear una aceleradora exitosamente', async () => {
        const res = await request(app)
            .post('/api/aceleradoras/crear-aceleradora')
            .send({
                user_id: 1,
                nombre: 'Aceleradora Test',
                programas_activos: 'Programa Semilla',
                sitio_web: 'http://aceleradoratest.com'
            });
        
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message', 'Aceleradora creada exitosamente');
        expect(res.body.aceleradora).toHaveProperty('id');
        createdAceleradoraId = res.body.aceleradora.id;
    });

    it('Debería obtener las aceleradoras', async () => {
        const res = await request(app).get('/api/aceleradoras/obtener-aceleradora');
        
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('Debería actualizar una aceleradora', async () => {
        const res = await request(app)
            .put(`/api/aceleradoras/editar-aceleradora/${createdAceleradoraId}`)
            .send({
                user_id: 1,
                nombre: 'Aceleradora Test Editada',
                programas_activos: 'Programa Serie A',
                sitio_web: 'http://aceleradoratesteditada.com'
            });
        
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('nombre', 'Aceleradora Test Editada');
    });

    it('Debería eliminar una aceleradora', async () => {
        const res = await request(app).delete(`/api/aceleradoras/eliminar-aceleradora/${createdAceleradoraId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Aceleradora eliminada correctamente');
    });
});
