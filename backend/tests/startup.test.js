const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models');

beforeAll(async () => {
    // Sync database
    await sequelize.sync({ force: true });
});

afterAll(async () => {
    await sequelize.close();
});

describe('Startup CRUD API', () => {
    let createdStartupId;

    it('Debería crear una startup exitosamente', async () => {
        const res = await request(app)
            .post('/api/startups/crear-startup')
            .send({
                user_id: 1,
                nombre_comercial: 'TechNova',
                descripcion: 'Una startup de IA',
                fase: 'Idea',
                sector_id: 1
            });
        
        if (res.statusCode !== 201) console.log(res.body);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message', 'Startup creada exitosamente');
        expect(res.body.startup).toHaveProperty('id');
        createdStartupId = res.body.startup.id;
    });

    it('No debería crear startup si fallan las validaciones', async () => {
        const res = await request(app)
            .post('/api/startups/crear-startup')
            .send({
                nombre_comercial: 'TechNova'
                // Faltan campos requeridos
            });
        
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('errors');
    });

    it('Debería obtener startups con paginación', async () => {
        const res = await request(app).get('/api/startups/obtener-startups?page=1&limit=5');
        
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('startups');
        expect(res.body.startups.length).toBeGreaterThan(0);
        expect(res.body).toHaveProperty('totalItems');
    });

    it('Debería editar una startup existente', async () => {
        const res = await request(app)
            .put(`/api/startups/editar-startups/${createdStartupId}`)
            .send({
                user_id: 1,
                nombre_comercial: 'TechNova Updated',
                descripcion: 'Una startup de IA (Actualizada)',
                fase: 'Semilla',
                sector_id: 1
            });
        
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('nombre_comercial', 'TechNova Updated');
    });

    it('Debería eliminar una startup', async () => {
        const res = await request(app).delete(`/api/startups/eliminar-startup/${createdStartupId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Startup eliminada correctamente');
    });
});
