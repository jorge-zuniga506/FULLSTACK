const request = require('supertest');
const app = require('../app');
const { sequelize, Role, User, Inversor } = require('../models');
const bcrypt = require('bcrypt');

let roleId;
let userCounter = 0;
let authToken = '';

const createInversorUser = async () => {
  userCounter += 1;
  const user = await User.create({
    cedula: `I-${String(userCounter).padStart(3, '0')}`,
    nombre_hacienda: `Inversor Owner ${userCounter}`,
    email: `inversor.owner.${userCounter}@test.com`,
    password_hash: 'hash',
    role_id: roleId
  });
  return user;
};

const createInversorEntity = async () => {
  const user = await createInversorUser();
  const inversor = await Inversor.create({
    user_id: user.id,
    nombre: `Fondo ${user.id}`,
    presupuesto_min: 10000,
    presupuesto_max: 50000,
    sectores_interes: ['Tecnologia', 'Salud']
  });
  return { user, inversor };
};

beforeAll(async () => {
  await sequelize.sync({ force: true });

  // Create admin role FIRST with explicit id=1, then other roles
  await Role.create({ id: 1, nombre: 'admin' });
  const role = await Role.create({ nombre: 'inversor' });
  roleId = role.id;

  // Create admin user and get auth token
  const password_hash = await bcrypt.hash('securePassword123', 10);
  await User.create({
    cedula: 'ADMIN001',
    nombre_hacienda: 'Admin',
    email: 'admin-inv@test.com',
    password_hash,
    role_id: 1
  });
  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin-inv@test.com', password: 'securePassword123' });
  authToken = loginRes.body.token;
});

afterAll(async () => {
  await sequelize.close();
});

describe('Inversor CRUD API', () => {
  it('Deberia crear un inversor exitosamente', async () => {
    const user = await createInversorUser();

    const res = await request(app)
      .post('/api/inversores/crear-inversor')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        user_id: user.id,
        nombre: 'Fondo Inversion X',
        presupuesto_min: 10000,
        presupuesto_max: 50000,
        sectores_interes: ['Tecnologia', 'Salud']
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'Inversor creado exitosamente');
    expect(res.body.inversor).toHaveProperty('id');
  });

  it('Deberia obtener los inversores', async () => {
    await createInversorEntity();

    const res = await request(app).get('/api/inversores/obtener-inversores');
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('Deberia actualizar un inversor', async () => {
    const { user, inversor } = await createInversorEntity();

    const res = await request(app)
      .put(`/api/inversores/editar-inversor/${inversor.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        user_id: user.id,
        nombre: 'Fondo Inversion Y',
        presupuesto_min: 20000,
        presupuesto_max: 60000,
        sectores_interes: ['Agro']
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('nombre', 'Fondo Inversion Y');
  });

  it('Deberia eliminar un inversor', async () => {
    const { inversor } = await createInversorEntity();

    const res = await request(app).delete(`/api/inversores/eliminar-inversor/${inversor.id}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Inversor eliminado correctamente');
  });
});
