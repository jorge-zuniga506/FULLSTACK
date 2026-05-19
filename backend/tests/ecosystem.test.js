const request = require('supertest');
const app = require('../app');
const { sequelize, Role, User, Sector, Startup, Solicitud, Geolocalizacion, ConexionGrafo, MetricaDashboard } = require('../models');
const bcrypt = require('bcrypt');

let startupRoleId;
let userCounter = 0;
let sectorId;
let authToken = '';

const createStartupUser = async () => {
  userCounter += 1;
  const user = await User.create({
    cedula: `E-${String(userCounter).padStart(3, '0')}`,
    nombre_hacienda: `Ecosystem User ${userCounter}`,
    email: `ecosystem.user.${userCounter}@test.com`,
    password_hash: 'hash',
    role_id: startupRoleId
  });
  return user;
};

const createStartupForMetrics = async () => {
  const user = await createStartupUser();
  const startup = await Startup.create({
    user_id: user.id,
    nombre_comercial: `Eco Startup ${user.id}`,
    descripcion: 'Startup base para metricas',
    fase: 'Idea',
    sector_id: sectorId
  });
  return { user, startup };
};

beforeAll(async () => {
  await sequelize.sync({ force: true });

  // Create admin role FIRST with explicit id=1, then other roles
  await Role.create({ id: 1, nombre: 'admin' });
  const role = await Role.create({ nombre: 'startup' });
  const sector = await Sector.create({ nombre: 'Tecnologia', color_hex: '#00AEEF' });
  startupRoleId = role.id;
  sectorId = sector.id;

  // Create admin user and get auth token
  const password_hash = await bcrypt.hash('securePassword123', 10);
  await User.create({
    cedula: 'ECO-ADMIN',
    nombre_hacienda: 'Ecosystem Admin',
    email: 'eco-admin@test.com',
    password_hash,
    role_id: 1
  });
  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'eco-admin@test.com', password: 'securePassword123' });
  authToken = loginRes.body.token;
});

afterAll(async () => {
  await sequelize.close();
});

describe('Solicitudes CRUD API', () => {
  it('Deberia crear una solicitud exitosamente', async () => {
    const user = await createStartupUser();

    const res = await request(app)
      .post('/api/ecosistemas/solicitudes')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ user_id: user.id, tipo: 'startup', estado: 'Pendiente', comentarios_admin: 'Esperando revision' });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'Solicitud creada exitosamente');
    expect(res.body.solicitud).toHaveProperty('id');
  });

  it('Deberia obtener las solicitudes', async () => {
    const user = await createStartupUser();
    await Solicitud.create({ user_id: user.id, tipo: 'startup', estado: 'Pendiente', comentarios_admin: 'Test' });

    const res = await request(app).get('/api/ecosistemas/solicitudes');
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('Deberia actualizar una solicitud', async () => {
    const user = await createStartupUser();
    const solicitud = await Solicitud.create({ user_id: user.id, tipo: 'startup', estado: 'Pendiente', comentarios_admin: 'Inicial' });

    const res = await request(app)
      .put(`/api/ecosistemas/solicitudes/${solicitud.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ user_id: user.id, tipo: 'startup', estado: 'Pendiente', comentarios_admin: 'Revision en proceso' });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('comentarios_admin', 'Revision en proceso');
  });

  it('Deberia aprobar una solicitud (admin)', async () => {
    const user = await createStartupUser();
    const solicitud = await Solicitud.create({ user_id: user.id, tipo: 'startup', estado: 'Pendiente', comentarios_admin: 'Inicial' });

    const res = await request(app)
      .patch(`/api/ecosistemas/solicitudes/${solicitud.id}/aprobar`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.solicitud).toHaveProperty('estado', 'Aprobada');
  });

  it('Deberia rechazar una solicitud (admin)', async () => {
    const user = await createStartupUser();
    const solicitud = await Solicitud.create({ user_id: user.id, tipo: 'startup', estado: 'Pendiente', comentarios_admin: 'Inicial' });

    const res = await request(app)
      .patch(`/api/ecosistemas/solicitudes/${solicitud.id}/rechazar`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.solicitud).toHaveProperty('estado', 'Rechazada');
  });

  it('Deberia eliminar una solicitud', async () => {
    const user = await createStartupUser();
    const solicitud = await Solicitud.create({ user_id: user.id, tipo: 'startup', estado: 'Pendiente', comentarios_admin: 'Inicial' });

    const res = await request(app)
      .delete(`/api/ecosistemas/solicitudes/${solicitud.id}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toEqual(200);
  });

  it('Deberia crear geolocalizacion', async () => {
    const user = await createStartupUser();

    const res = await request(app)
      .post('/api/ecosistemas/crear-ecosystem')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ user_id: user.id, latitud: 10.0, longitud: -10.0, direccion: 'Test' });

    expect(res.statusCode).toEqual(201);
    expect(res.body.geolocalizacion).toHaveProperty('id');
  });

  it('Deberia obtener geolocalizaciones', async () => {
    const user = await createStartupUser();
    await Geolocalizacion.create({ user_id: user.id, latitud: 10.0, longitud: -10.0, direccion: 'Test' });

    const res = await request(app).get('/api/ecosistemas/obtener-ecosystem');
    expect(res.statusCode).toEqual(200);
  });

  it('Deberia actualizar geolocalizacion', async () => {
    const user = await createStartupUser();
    const geo = await Geolocalizacion.create({ user_id: user.id, latitud: 10.0, longitud: -10.0, direccion: 'Test' });

    const res = await request(app)
      .put(`/api/ecosistemas/editar-ecosystem/${geo.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ user_id: user.id, latitud: 20.0, longitud: -20.0, direccion: 'Test Edit' });

    expect(res.statusCode).toEqual(200);
  });

  it('Deberia eliminar geolocalizacion', async () => {
    const user = await createStartupUser();
    const geo = await Geolocalizacion.create({ user_id: user.id, latitud: 10.0, longitud: -10.0, direccion: 'Test' });

    const res = await request(app)
      .delete(`/api/ecosistemas/eliminar-ecosystem/${geo.id}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toEqual(200);
  });

  it('Deberia crear conexion grafo', async () => {
    const userA = await createStartupUser();
    const userB = await createStartupUser();

    const res = await request(app)
      .post('/api/ecosistemas/conexiones')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ actor_origen_id: userA.id, actor_destino_id: userB.id, tipo_vinculo: 'Inversion' });

    expect(res.statusCode).toEqual(201);
    expect(res.body.conexionGrafo).toHaveProperty('id');
  });

  it('Deberia obtener conexiones', async () => {
    const userA = await createStartupUser();
    const userB = await createStartupUser();
    await ConexionGrafo.create({ actor_origen_id: userA.id, actor_destino_id: userB.id, tipo_vinculo: 'Inversion' });

    const res = await request(app).get('/api/ecosistemas/conexiones');
    expect(res.statusCode).toEqual(200);
  });

  it('Deberia eliminar conexion', async () => {
    const userA = await createStartupUser();
    const userB = await createStartupUser();
    const conexion = await ConexionGrafo.create({ actor_origen_id: userA.id, actor_destino_id: userB.id, tipo_vinculo: 'Inversion' });

    const res = await request(app)
      .delete(`/api/ecosistemas/conexiones/${conexion.id}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toEqual(200);
  });

  it('Deberia crear metrica', async () => {
    const { startup } = await createStartupForMetrics();

    const res = await request(app)
      .post('/api/ecosistemas/metricas')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ startup_id: startup.id, num_empleados: 10, valoracion_estimada: 1000000.0, fecha_reporte: '2023-01-01' });

    expect(res.statusCode).toEqual(201);
    expect(res.body.metricaDashboard).toHaveProperty('id');
  });

  it('Deberia obtener metricas', async () => {
    const { startup } = await createStartupForMetrics();
    await MetricaDashboard.create({ startup_id: startup.id, num_empleados: 10, valoracion_estimada: 1000000.0, fecha_reporte: '2023-01-01' });

    const res = await request(app).get('/api/ecosistemas/metricas');
    expect(res.statusCode).toEqual(200);
  });

  it('Deberia eliminar metrica', async () => {
    const { startup } = await createStartupForMetrics();
    const metrica = await MetricaDashboard.create({ startup_id: startup.id, num_empleados: 10, valoracion_estimada: 1000000.0, fecha_reporte: '2023-01-01' });

    const res = await request(app)
      .delete(`/api/ecosistemas/metricas/${metrica.id}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toEqual(200);
  });
});
