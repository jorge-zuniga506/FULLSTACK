const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models');

beforeAll(async () => {
    // Sync database
    await sequelize.sync({ force: true });
    await sequelize.models.Role.bulkCreate([
        { id: 1, nombre: 'admin' },
        { id: 2, nombre: 'startup' },
        { id: 3, nombre: 'aceleradora' },
        { id: 4, nombre: 'inversor' }
    ]);
});

afterAll(async () => {
    await sequelize.close();
});

describe('User CRUD API', () => {
    let createdUserId;

    it('Debería crear un usuario exitosamente', async () => {
        const res = await request(app)
            .post('/api/usuarios/crear-usuario')
            .send({
                cedula: '1234567890',
                nombre_hacienda: 'Hacienda La Esmeralda',
                email: 'test@example.com',
                password_hash: 'securePassword123',
                role_id: 1
            });
        
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message', 'Usuario creado exitosamente');
        expect(res.body.usuario).toHaveProperty('id');
        createdUserId = res.body.usuario.id;
    });

    it('No debería crear usuario con un correo inválido', async () => {
        const res = await request(app)
            .post('/api/usuarios/crear-usuario')
            .send({
                cedula: '0987654321',
                nombre_hacienda: 'Hacienda El Dorado',
                email: 'invalid-email',
                password_hash: 'securePassword123',
                role_id: 1
            });
        
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('errors');
    });

    it('Debería obtener los usuarios', async () => {
        const res = await request(app).get('/api/usuarios/obtener-usuario');
        
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBeGreaterThan(0);
        // Verificar que no se devuelve el password_hash
        expect(res.body[0]).not.toHaveProperty('password_hash');
    });

    it('Debería actualizar un usuario', async () => {
        const res = await request(app)
            .put(`/api/usuarios/editar-usuarios/${createdUserId}`)
            .send({
                cedula: '1234567890',
                nombre_hacienda: 'Hacienda La Esmeralda Editada',
                email: 'test@example.com',
                password_hash: 'securePassword123'
            });
        
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('nombre_hacienda', 'Hacienda La Esmeralda Editada');
    });

    it('Debería rechazar actualización si se intenta cambiar el rol', async () => {
        const res = await request(app)
            .put(`/api/usuarios/editar-usuarios/${createdUserId}`)
            .send({
                cedula: '1234567890',
                nombre_hacienda: 'Hacienda La Esmeralda Editada',
                email: 'test@example.com',
                password_hash: 'securePassword123',
                role_id: 2
            });
        
        // Wait, the PUT method uses the `validarUsuario` middleware which requires role_id
        // and the controller checks if role_id !== undefined and returns 403.
        expect(res.statusCode).toEqual(403);
    });

    it('Debería eliminar un usuario', async () => {
        const res = await request(app).delete(`/api/usuarios/eliminar-usuario/${createdUserId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Usuario eliminado correctamente');
    });
});
