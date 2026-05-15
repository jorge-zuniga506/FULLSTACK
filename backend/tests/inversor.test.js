const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models');

beforeAll(async () => {
    await sequelize.sync({ force: true });
});

afterAll(async () => {
    await sequelize.close();
});

describe('Inversor CRUD API', () => {
    let createdInversorId;

    it('Debería crear un inversor exitosamente', async () => {
        const res = await request(app)
            .post('/api/inversores/crear-inversor')
            .send({
                user_id: 1,
                nombre: 'Fondo Inversión X',
                presupuesto_min: 10000,
                presupuesto_max: 50000,
                sectores_interes: ["Tecnología", "Salud"]
            });
        
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message', 'Inversor creado exitosamente');
        expect(res.body.inversor).toHaveProperty('id');
        createdInversorId = res.body.inversor.id;
    });

    it('Debería obtener los inversores', async () => {
        const res = await request(app).get('/api/inversores/obtener-inversores');
        
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('Debería actualizar un inversor', async () => {
        const res = await request(app)
            .put(`/api/inversores/editar-inversor/${createdInversorId}`)
            .send({
                user_id: 1,
                nombre: 'Fondo Inversión Y',
                presupuesto_min: 20000,
                presupuesto_max: 60000,
                sectores_interes: ["Agro"]
            });
        
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('nombre', 'Fondo Inversión Y');
    });

    it('Debería eliminar un inversor', async () => {
        const res = await request(app).delete(`/api/inversores/eliminar-inversor/${createdInversorId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Inversor eliminado correctamente');
    });
});
