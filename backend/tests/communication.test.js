const request = require('supertest');
const app = require('../app');
const { sequelize, Role, User } = require('../models');
const bcrypt = require('bcrypt');

let userCounter = 0;
let authToken = '';

const createCommUser = async () => {
  userCounter += 1;
  const user = await User.create({
    cedula: `COMM-${String(userCounter).padStart(3, '0')}`,
    nombre_hacienda: `Comm Owner ${userCounter}`,
    email: `comm.${userCounter}.${Date.now()}@test.com`,
    password_hash: 'hash123',
    role_id: 1
  });
  return user;
};

const createChat = async (user) => {
  return await request(app)
    .post('/api/communication/chats')
    .set('Authorization', `Bearer ${authToken}`)
    .send();
};

beforeAll(async () => {
    await sequelize.sync({ force: true });
    await Role.create({ id: 1, nombre: 'admin' });

    // Create admin user and get auth token
    const password_hash = await bcrypt.hash('securePassword123', 10);
    await User.create({
        cedula: 'COMM-ADMIN',
        nombre_hacienda: 'Comm Admin',
        email: 'comm-admin@test.com',
        password_hash,
        role_id: 1
    });
    const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: 'comm-admin@test.com', password: 'securePassword123' });
    authToken = loginRes.body.token;
});

afterAll(async () => {
    await sequelize.close();
});

describe('Communication API', () => {
    it('Debería crear un chat', async () => {
        const res = await createChat();

        expect(res.statusCode).toEqual(201);
        expect(res.body.chat).toHaveProperty('chat_id');
    });

    it('Debería enviar un mensaje en el chat creado', async () => {
        const user = await createCommUser();
        const chatRes = await createChat();
        const chatId = chatRes.body.chat.chat_id;

        const res = await request(app)
            .post(`/api/communication/chats/${chatId}/mensajes`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                emisor_id: user.id,
                contenido: 'Hola chat'
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body.mensaje).toHaveProperty('id');
    });

    it('Debería listar los chats', async () => {
        const user = await createCommUser();
        const chatRes = await createChat();
        const chatId = chatRes.body.chat.chat_id;
        await request(app)
            .post(`/api/communication/chats/${chatId}/mensajes`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({ emisor_id: user.id, contenido: 'Mensaje para listar chat' });

        const res = await request(app)
            .get('/api/communication/chats')
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(expect.arrayContaining([
            expect.objectContaining({ chat_id: chatId })
        ]));
    });

    it('Debería obtener los mensajes del chat', async () => {
        const user = await createCommUser();
        const chatRes = await createChat();
        const chatId = chatRes.body.chat.chat_id;
        await request(app)
            .post(`/api/communication/chats/${chatId}/mensajes`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({ emisor_id: user.id, contenido: 'Test mensaje' });

        const res = await request(app)
            .get(`/api/communication/chats/${chatId}/mensajes`)
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('Debería obtener los mensajes', async () => {
        const user = await createCommUser();
        const chatRes = await createChat();
        const chatId = chatRes.body.chat.chat_id;
        await request(app)
            .post(`/api/communication/chats/${chatId}/mensajes`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({ emisor_id: user.id, contenido: 'Test mensaje' });

        const res = await request(app)
            .get('/api/communication/mensajes')
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('Debería crear un mensaje de contacto público', async () => {
        const res = await request(app)
            .post('/api/communication/contacto-publico')
            .send({
                nombre: 'María Pérez',
                email: 'maria@ejemplo.com',
                asunto: 'Consulta general',
                mensaje: 'Hola, quisiera recibir más información.'
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body.mensaje).toHaveProperty('id');
        expect(res.body.mensaje).toHaveProperty('nombre', 'María Pérez');
    });

    it('Debería listar los mensajes de contacto público (admin)', async () => {
        await request(app)
            .post('/api/communication/contacto-publico')
            .send({
                nombre: 'Juan López',
                email: 'juan@ejemplo.com',
                asunto: 'Otra consulta',
                mensaje: 'Quisiera más info.'
            });

        const res = await request(app)
            .get('/api/communication/contacto-publico')
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('Debería actualizar un mensaje', async () => {
        const user = await createCommUser();
        const chatRes = await createChat();
        const chatId = chatRes.body.chat.chat_id;
        const msgRes = await request(app)
            .post(`/api/communication/chats/${chatId}/mensajes`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({ emisor_id: user.id, contenido: 'Hola mundo' });
        const mensajeId = msgRes.body.mensaje.id;

        const res = await request(app)
            .put(`/api/communication/mensajes/${mensajeId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                emisor_id: user.id,
                chat_id: chatId,
                contenido: 'Hola mundo editado',
                leido: true
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('leido', true);
    });

    it('Debería eliminar un mensaje', async () => {
        const user = await createCommUser();
        const chatRes = await createChat();
        const chatId = chatRes.body.chat.chat_id;
        const msgRes = await request(app)
            .post(`/api/communication/chats/${chatId}/mensajes`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({ emisor_id: user.id, contenido: 'Mensaje a eliminar' });
        const mensajeId = msgRes.body.mensaje.id;

        const res = await request(app)
            .delete(`/api/communication/mensajes/${mensajeId}`)
            .set('Authorization', `Bearer ${authToken}`);
        expect(res.statusCode).toEqual(200);
    });

    it('Debería guardar una consulta de IA', async () => {
        const user = await createCommUser();
        const res = await request(app)
            .post('/api/communication/consultas-ia')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                user_id: user.id,
                pregunta_usuario: '¿Qué es una startup?',
                respuesta_ia: 'Una startup es...',
                modelo: 'gpt-4'
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body.consultaIA).toHaveProperty('id');
    });

    it('Debería obtener el historial de consultas de IA', async () => {
        const user = await createCommUser();
        await request(app)
            .post('/api/communication/consultas-ia')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                user_id: user.id,
                pregunta_usuario: '¿Cómo funciona?',
                respuesta_ia: 'Funciona así...',
                modelo: 'gpt-4'
            });

        const res = await request(app)
            .get('/api/communication/consultas-ia')
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('Debería eliminar una consulta de IA', async () => {
        const user = await createCommUser();
        const createRes = await request(app)
            .post('/api/communication/consultas-ia')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                user_id: user.id,
                pregunta_usuario: 'Consulta a eliminar',
                respuesta_ia: 'Respuesta',
                modelo: 'gpt-4'
            });
        const consultaId = createRes.body.consultaIA.id;

        const res = await request(app)
            .delete(`/api/communication/consultas-ia/${consultaId}`)
            .set('Authorization', `Bearer ${authToken}`);
        expect(res.statusCode).toEqual(200);
    });

    it('Debería marcar un mensaje como leído', async () => {
        const user = await createCommUser();
        const chatRes = await createChat();
        const chatId = chatRes.body.chat.chat_id;
        const msgRes = await request(app)
            .post(`/api/communication/chats/${chatId}/mensajes`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({ emisor_id: user.id, contenido: 'Mensaje a marcar como leído' });
        const mensajeId = msgRes.body.mensaje.id;

        const res = await request(app)
            .put(`/api/communication/mensajes/${mensajeId}/leer`)
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.mensaje).toHaveProperty('leido', true);
    });

    it('Debería devolver 404 al marcar un mensaje inexistente como leído', async () => {
        const res = await request(app)
            .put('/api/communication/mensajes/99999/leer')
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.statusCode).toEqual(404);
    });

    it('Debería marcar todos los mensajes de un chat como leídos', async () => {
        const user = await createCommUser();
        const chatRes = await createChat();
        const chatId = chatRes.body.chat.chat_id;
        await request(app)
            .post(`/api/communication/chats/${chatId}/mensajes`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({ emisor_id: user.id, contenido: 'Mensaje 1' });
        await request(app)
            .post(`/api/communication/chats/${chatId}/mensajes`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({ emisor_id: user.id, contenido: 'Mensaje 2' });

        const res = await request(app)
            .put('/api/communication/mensajes/leer-todos')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ chat_id: chatId });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('count');
        expect(res.body.count).toBeGreaterThanOrEqual(1);
    });

    it('Debería devolver 400 si falta chat_id en leer-todos', async () => {
        const res = await request(app)
            .put('/api/communication/mensajes/leer-todos')
            .set('Authorization', `Bearer ${authToken}`)
            .send({});

        expect(res.statusCode).toEqual(400);
    });
});
