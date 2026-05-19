const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models');
const bcrypt = require('bcrypt');

let authToken = '';

const createNotificationForUser = async (userId, overrides = {}) => {
  return await sequelize.models.Notificacion.create({
    user_id: userId,
    titulo: overrides.titulo || 'Notificación de prueba',
    mensaje: overrides.mensaje || 'Mensaje de prueba.',
    tipo: overrides.tipo || 'info',
    leido: overrides.leido || false
  });
};

beforeAll(async () => {
  await sequelize.sync({ force: true });

  await sequelize.models.Role.create({ id: 1, nombre: 'admin' });

  const password_hash = await bcrypt.hash('securePassword123', 10);
  await sequelize.models.User.create({
    cedula: 'notif123456',
    nombre_hacienda: 'Hacienda Notif',
    email: 'notif@example.com',
    password_hash,
    role_id: 1
  });

  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'notif@example.com', password: 'securePassword123' });

  authToken = loginRes.body.token;
});

afterAll(async () => {
  await sequelize.close();
});

describe('Notification API', () => {
  it('Debería obtener notificaciones del usuario autenticado', async () => {
    await createNotificationForUser(1, { titulo: 'Bienvenida' });

    const res = await request(app)
      .get('/api/notifications')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('titulo', 'Bienvenida');
  });

  it('No debería permitir acceder sin token', async () => {
    const res = await request(app).get('/api/notifications');
    expect(res.statusCode).toEqual(401);
  });

  it('Debería contar notificaciones no leídas', async () => {
    await createNotificationForUser(1, { titulo: 'No leída 1', leido: false });
    await createNotificationForUser(1, { titulo: 'No leída 2', leido: false });
    await createNotificationForUser(1, { titulo: 'Leída', leido: true });

    const res = await request(app)
      .get('/api/notifications/no-leidas')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('no_leidas');
    expect(res.body.no_leidas).toBeGreaterThanOrEqual(2);
  });

  it('Debería marcar una notificación como leída', async () => {
    const notif = await createNotificationForUser(1, { titulo: 'A marcar', leido: false });

    const res = await request(app)
      .put(`/api/notifications/${notif.id}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('leido', true);
  });

  it('Debería devolver 404 al marcar una notificación inexistente', async () => {
    const res = await request(app)
      .put('/api/notifications/99999')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.statusCode).toEqual(404);
  });

  it('Debería marcar todas las notificaciones como leídas', async () => {
    await createNotificationForUser(1, { titulo: 'Batch 1', leido: false });
    await createNotificationForUser(1, { titulo: 'Batch 2', leido: false });

    const res = await request(app)
      .put('/api/notifications')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.statusCode).toEqual(200);

    const checkRes = await request(app)
      .get('/api/notifications/no-leidas')
      .set('Authorization', `Bearer ${authToken}`);
    expect(checkRes.body.no_leidas).toEqual(0);
  });

  it('Debería eliminar una notificación', async () => {
    const notif = await createNotificationForUser(1, { titulo: 'A eliminar' });

    const res = await request(app)
      .delete(`/api/notifications/${notif.id}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Notificación eliminada correctamente');
  });

  it('Debería devolver 404 al eliminar una notificación inexistente', async () => {
    const res = await request(app)
      .delete('/api/notifications/99999')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.statusCode).toEqual(404);
  });

  it('No debería permitir operaciones PUT sin token', async () => {
    const res = await request(app).put('/api/notifications/1');
    expect(res.statusCode).toEqual(401);
  });

  it('No debería permitir operaciones DELETE sin token', async () => {
    const res = await request(app).delete('/api/notifications/1');
    expect(res.statusCode).toEqual(401);
  });
});
