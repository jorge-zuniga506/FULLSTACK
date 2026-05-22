const request = require('supertest');
const app = require('../app');
const { sequelize, Role, User, Sector, Startup } = require('../models');
const bcrypt = require('bcrypt');

let startupRoleId;
let sectorId;
let userCounter = 0;
let authToken = '';

const createStartupUser = async () => {
  userCounter += 1;
  const user = await User.create({
    cedula: `S-${String(userCounter).padStart(3, '0')}`,
    nombre_hacienda: `Startup Owner ${userCounter}`,
    email: `startup.owner.${userCounter}@test.com`,
    password_hash: 'hash',
    role_id: startupRoleId
  });
  return user;
};

const createStartupEntity = async () => {
  const user = await createStartupUser();
  const startup = await Startup.create({
    user_id: user.id,
    nombre_comercial: `TechNova ${user.id}`,
    descripcion: 'Una startup de IA',
    fase: 'Idea',
    sector_id: sectorId
  });
  return { user, startup };
};

beforeAll(async () => {
  await sequelize.sync({ force: true });

  // Create admin role FIRST with explicit id=1, then other roles
  await Role.create({ id: 1, nombre: 'admin' });
  const startupRole = await Role.create({ nombre: 'startup' });
  const sector = await Sector.create({ nombre: 'Tecnologia', color_hex: '#00AEEF' });
  startupRoleId = startupRole.id;
  sectorId = sector.id;

  // Create admin user and get auth token
  const password_hash = await bcrypt.hash('securePassword123', 10);
  await User.create({
    cedula: 'ADMIN001',
    nombre_hacienda: 'Admin',
    email: 'admin@test.com',
    password_hash,
    role_id: 1
  });
  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@test.com', password: 'securePassword123' });
  authToken = loginRes.body.token;
});

afterAll(async () => {
  await sequelize.close();
});

describe('Startup CRUD API', () => {
  it('Deberia crear una startup exitosamente', async () => {
    const user = await createStartupUser();

    const res = await request(app)
      .post('/api/startups/crear-startup')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        user_id: user.id,
        nombre_comercial: 'TechNova',
        descripcion: 'Una startup de IA',
        fase: 'Idea',
        sector_id: sectorId
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'Startup creada exitosamente');
    expect(res.body.startup).toHaveProperty('id');
  });

  it('No deberia crear startup si fallan las validaciones', async () => {
    const res = await request(app)
      .post('/api/startups/crear-startup')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ nombre_comercial: 'TechNova' });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('errors');
  });

  it('Deberia obtener startups con paginacion', async () => {
    await createStartupEntity();

    const res = await request(app).get('/api/startups/obtener-startups?page=1&limit=5');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('startups');
    expect(res.body.startups.length).toBeGreaterThan(0);
    expect(res.body).toHaveProperty('totalItems');
  });

  it('Deberia buscar startups por texto', async () => {
    const { startup } = await createStartupEntity();

    const res = await request(app)
      .get('/api/startups/obtener-startups')
      .query({ search: startup.nombre_comercial.slice(0, 5) });
    expect(res.statusCode).toEqual(200);
    expect(res.body.totalItems).toBeGreaterThan(0);
  });

  it('Deberia editar una startup existente', async () => {
    const { user, startup } = await createStartupEntity();

    const res = await request(app)
      .put(`/api/startups/editar-startups/${startup.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        user_id: user.id,
        nombre_comercial: 'TechNova Updated',
        descripcion: 'Una startup de IA (Actualizada)',
        fase: 'Semilla',
        sector_id: sectorId
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('nombre_comercial', 'TechNova Updated');
  });

  it('Deberia eliminar una startup', async () => {
    const { startup } = await createStartupEntity();

    const res = await request(app).delete(`/api/startups/eliminar-startup/${startup.id}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Startup eliminada correctamente');
  });
});
