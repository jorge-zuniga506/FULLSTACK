const request = require('supertest');
const app = require('../app');
const { sequelize, Role, User, Aceleradora } = require('../models');
const bcrypt = require('bcrypt');

let roleId;
let userCounter = 0;
let authToken = '';

const createAceleradoraUser = async () => {
  userCounter += 1;
  const user = await User.create({
    cedula: `A-${String(userCounter).padStart(3, '0')}`,
    nombre_hacienda: `Aceleradora Owner ${userCounter}`,
    email: `aceleradora.owner.${userCounter}@test.com`,
    password_hash: 'hash',
    role_id: roleId
  });
  return user;
};

const createAceleradoraEntity = async () => {
  const user = await createAceleradoraUser();
  const aceleradora = await Aceleradora.create({
    user_id: user.id,
    nombre: `Aceleradora ${user.id}`,
    programas_activos: 'Programa Semilla',
    sitio_web: `http://aceleradora${user.id}.com`
  });
  return { user, aceleradora };
};

beforeAll(async () => {
  await sequelize.sync({ force: true });

  // Create admin role FIRST with explicit id=1, then other roles
  await Role.create({ id: 1, nombre: 'admin' });
  const role = await Role.create({ nombre: 'aceleradora' });
  roleId = role.id;

  // Create admin user and get auth token
  const password_hash = await bcrypt.hash('securePassword123', 10);
  await User.create({
    cedula: 'ADMIN001',
    nombre_hacienda: 'Admin',
    email: 'admin-acel@test.com',
    password_hash,
    role_id: 1
  });
  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin-acel@test.com', password: 'securePassword123' });
  authToken = loginRes.body.token;
});

afterAll(async () => {
  await sequelize.close();
});

describe('Aceleradora CRUD API', () => {
  it('Deberia crear una aceleradora exitosamente', async () => {
    const user = await createAceleradoraUser();

    const res = await request(app)
      .post('/api/aceleradoras/crear-aceleradora')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        user_id: user.id,
        nombre: 'Aceleradora Test',
        programas_activos: 'Programa Semilla',
        sitio_web: 'http://aceleradoratest.com'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'Aceleradora creada exitosamente');
    expect(res.body.aceleradora).toHaveProperty('id');
  });

  it('Deberia obtener las aceleradoras', async () => {
    await createAceleradoraEntity();

    const res = await request(app).get('/api/aceleradoras/obtener-aceleradora');
    expect(res.statusCode).toEqual(200);
    expect(res.body.totalItems).toBeGreaterThan(0);
    expect(res.body.aceleradoras.length).toBeGreaterThan(0);
    expect(res.body).toHaveProperty('totalPages');
    expect(res.body).toHaveProperty('currentPage');
  });

  it('Deberia buscar aceleradoras por texto', async () => {
    const { aceleradora } = await createAceleradoraEntity();

    const res = await request(app)
      .get('/api/aceleradoras/obtener-aceleradora')
      .query({ search: aceleradora.nombre.slice(0, 5) });
    expect(res.statusCode).toEqual(200);
    expect(res.body.totalItems).toBeGreaterThan(0);
  });

  it('Deberia actualizar una aceleradora', async () => {
    const { user, aceleradora } = await createAceleradoraEntity();

    const res = await request(app)
      .put(`/api/aceleradoras/editar-aceleradora/${aceleradora.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        user_id: user.id,
        nombre: 'Aceleradora Test Editada',
        programas_activos: 'Programa Serie A',
        sitio_web: 'http://aceleradoratesteditada.com'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('nombre', 'Aceleradora Test Editada');
  });

  it('Deberia eliminar una aceleradora', async () => {
    const { aceleradora } = await createAceleradoraEntity();

    const res = await request(app).delete(`/api/aceleradoras/eliminar-aceleradora/${aceleradora.id}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Aceleradora eliminada correctamente');
  });
});
