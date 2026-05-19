const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models');
const bcrypt = require('bcrypt');

let sectorCounter = 0;
let authToken = '';

const createTestSector = async () => {
  sectorCounter += 1;
  const res = await request(app)
    .post('/api/sectores/crear-sector')
    .set('Authorization', `Bearer ${authToken}`)
    .send({
      nombre: `Sector-${sectorCounter}-${Date.now()}`,
      color_hex: '#FF5733'
    });
  return res;
};

beforeAll(async () => {
    await sequelize.sync({ force: true });
    await sequelize.models.Role.create({ id: 1, nombre: 'admin' });

    const password_hash = await bcrypt.hash('securePassword123', 10);
    await sequelize.models.User.create({
        cedula: 'SECT-ADMIN',
        nombre_hacienda: 'Sector Admin',
        email: 'sector-admin@test.com',
        password_hash,
        role_id: 1
    });
    const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: 'sector-admin@test.com', password: 'securePassword123' });
    authToken = loginRes.body.token;
});

afterAll(async () => {
    await sequelize.close();
});

describe('Sector API', () => {
    it('Debería crear un sector', async () => {
        const res = await createTestSector();
        expect(res.statusCode).toEqual(201);
        expect(res.body.sector).toHaveProperty('id');
    });

    it('Debería obtener los sectores (público)', async () => {
        const res = await request(app).get('/api/sectores/obtener-sector');
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('Debería actualizar un sector', async () => {
        const createRes = await createTestSector();
        const sectorId = createRes.body.sector.id;

        const res = await request(app)
            .put(`/api/sectores/editar-sector/${sectorId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({ nombre: 'Salud', color_hex: '#00FF00' });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('nombre', 'Salud');
    });

    it('Debería eliminar un sector', async () => {
        const createRes = await createTestSector();
        const sectorId = createRes.body.sector.id;

        const res = await request(app)
            .delete(`/api/sectores/eliminar-sector/${sectorId}`)
            .set('Authorization', `Bearer ${authToken}`);
        expect(res.statusCode).toEqual(200);
    });
});
