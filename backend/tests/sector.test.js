const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models');

beforeAll(async () => {
    await sequelize.sync({ force: true });
});

afterAll(async () => {
    await sequelize.close();
});

describe('Sector API', () => {
    let createdSectorId;

    it('Debería crear un sector', async () => {
        const res = await request(app)
            .post('/api/sectores/crear-sector')
            .send({
                nombre: 'Tecnología',
                color_hex: '#FF5733'
            });
        
        expect(res.statusCode).toEqual(201);
        expect(res.body.sector).toHaveProperty('id');
        createdSectorId = res.body.sector.id;
    });

    it('Debería obtener los sectores', async () => {
        const res = await request(app).get('/api/sectores/obtener-sector');
        
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('Debería actualizar un sector', async () => {
        const res = await request(app)
            .put(`/api/sectores/editar-sector/${createdSectorId}`)
            .send({
                nombre: 'Salud',
                color_hex: '#00FF00'
            });
        
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('nombre', 'Salud');
    });

    it('Debería eliminar un sector', async () => {
        const res = await request(app).delete(`/api/sectores/eliminar-sector/${createdSectorId}`);
        expect(res.statusCode).toEqual(200);
    });
});
