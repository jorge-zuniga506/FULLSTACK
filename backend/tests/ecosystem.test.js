const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models');

beforeAll(async () => {
    await sequelize.sync({ force: true });
});

afterAll(async () => {
    await sequelize.close();
});

describe('Solicitudes CRUD API', () => {
    let createdSolicitudId;

    it('Debería crear una solicitud exitosamente', async () => {
        const res = await request(app)
            .post('/api/ecosistemas/solicitudes')
            .send({
                user_id: 1,
                tipo: 'startup',
                estado: 'Pendiente',
                comentarios_admin: 'Esperando revision'
            });
        
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message', 'Solicitud creada exitosamente');
        expect(res.body.solicitud).toHaveProperty('id');
        createdSolicitudId = res.body.solicitud.id;
    });

    it('Debería obtener las solicitudes', async () => {
        const res = await request(app).get('/api/ecosistemas/solicitudes');
        
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('Debería actualizar una solicitud', async () => {
        const res = await request(app)
            .put(`/api/ecosistemas/solicitudes/${createdSolicitudId}`)
            .send({
                user_id: 1,
                tipo: 'startup',
                estado: 'Pendiente',
                comentarios_admin: 'Revisión en proceso'
            });
        
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('comentarios_admin', 'Revisión en proceso');
    });

    it('Debería aprobar una solicitud', async () => {
        const res = await request(app).patch(`/api/ecosistemas/solicitudes/${createdSolicitudId}/aprobar`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.solicitud).toHaveProperty('estado', 'Aprobada');
    });

    it('Debería rechazar una solicitud', async () => {
        const res = await request(app).patch(`/api/ecosistemas/solicitudes/${createdSolicitudId}/rechazar`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.solicitud).toHaveProperty('estado', 'Rechazada');
    });

    it('Debería eliminar una solicitud', async () => {
        const res = await request(app).delete(`/api/ecosistemas/solicitudes/${createdSolicitudId}`);
        expect(res.statusCode).toEqual(200);
    });

    let createdGeoId;
    it('Debería crear geolocalizacion', async () => {
        const res = await request(app).post('/api/ecosistemas/crear-ecosystem').send({
            user_id: 1, latitud: 10.0, longitud: -10.0, direccion: 'Test'
        });
        expect(res.statusCode).toEqual(201);
        createdGeoId = res.body.geolocalizacion.id;
    });

    it('Debería obtener geolocalizaciones', async () => {
        const res = await request(app).get('/api/ecosistemas/obtener-ecosystem');
        expect(res.statusCode).toEqual(200);
    });

    it('Debería actualizar geolocalizacion', async () => {
        const res = await request(app).put(`/api/ecosistemas/editar-ecosytem/${createdGeoId}`).send({
            user_id: 1, latitud: 20.0, longitud: -20.0, direccion: 'Test Edit'
        });
        expect(res.statusCode).toEqual(200);
    });

    it('Debería eliminar geolocalizacion', async () => {
        const res = await request(app).delete(`/api/ecosistemas/eliminar-ecosystem/${createdGeoId}`);
        expect(res.statusCode).toEqual(200);
    });

    let createdGrafoId;
    it('Debería crear conexion grafo', async () => {
        const res = await request(app).post('/api/ecosistemas/conexiones').send({
            actor_origen_id: 1, actor_destino_id: 2, tipo_vinculo: 'Inversion'
        });
        expect(res.statusCode).toEqual(201);
        createdGrafoId = res.body.conexionGrafo.id;
    });

    it('Debería obtener conexiones', async () => {
        const res = await request(app).get('/api/ecosistemas/conexiones');
        expect(res.statusCode).toEqual(200);
    });

    it('Debería eliminar conexion', async () => {
        const res = await request(app).delete(`/api/ecosistemas/conexiones/${createdGrafoId}`);
        expect(res.statusCode).toEqual(200);
    });

    let createdMetricaId;
    it('Debería crear metrica', async () => {
        const res = await request(app).post('/api/ecosistemas/metricas').send({
            startup_id: 1, num_empleados: 10, valoracion_estimada: 1000000.0, fecha_reporte: '2023-01-01'
        });
        expect(res.statusCode).toEqual(201);
        createdMetricaId = res.body.metricaDashboard.id;
    });

    it('Debería obtener metricas', async () => {
        const res = await request(app).get('/api/ecosistemas/metricas');
        expect(res.statusCode).toEqual(200);
    });

    it('Debería eliminar metrica', async () => {
        const res = await request(app).delete(`/api/ecosistemas/metricas/${createdMetricaId}`);
        expect(res.statusCode).toEqual(200);
    });
});
