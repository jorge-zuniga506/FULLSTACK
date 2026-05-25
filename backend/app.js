require('dotenv').config();
const express = require('express');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const cors = require('cors');
const UserRoutes = require('./routes/UserRoutes');
const AuthRoutes = require('./routes/AuthRoutes');
const AceleradoraRoutes = require('./routes/AceleradoraRoutes');
const StartupRoutes = require('./routes/StartupRoutes');
const SessionRoutes = require('./routes/SessionRoutes');
const SectorRoutes = require('./routes/SectorRoutes');
const RoleRoutes = require('./routes/RoleRoutes');
const InversorRoutes = require('./routes/InversorRoutes');
const EcosystemRoutes = require('./routes/EcosystemRoutes');
const CommunicationRoutes = require('./routes/CommunicationRoutes');
const NotificationRoutes = require('./routes/NotificationRoutes');

const app = express();

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // Cambia esto al dominio de tu frontend en producción
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
// Sirve archivos estáticos subidos localmente (cuando no se usa Cloudinary)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
app.get('/', (req, res) => {
  res.send('Backend del Ecosistema de Startups listo.');
});

// ── Swagger / OpenAPI Docs ────────────────────────────────────────────────────
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));
app.get('/api/docs.json', (req, res) => res.json(swaggerSpec));

// ── API Versioning ────────────────────────────────────────────────────────────
// Canonical:  /api/v1/<recurso>
// Legacy:     /api/<recurso>        (backward compatibility)

const API_V1 = '/api/v1';
const API_LEGACY = '/api';

[API_V1, API_LEGACY].forEach(prefix => {
  app.use(`${prefix}/usuarios`, UserRoutes);
  app.use(`${prefix}/auth`, AuthRoutes);
  app.use(`${prefix}/aceleradoras`, AceleradoraRoutes);
  app.use(`${prefix}/startups`, StartupRoutes);
  app.use(`${prefix}/sesiones`, SessionRoutes);
  app.use(`${prefix}/sectores`, SectorRoutes);
  app.use(`${prefix}/roles`, RoleRoutes);
  app.use(`${prefix}/inversores`, InversorRoutes);
  app.use(`${prefix}/ecosistemas`, EcosystemRoutes);
  app.use(`${prefix}/communication`, CommunicationRoutes);
  app.use(`${prefix}/notifications`, NotificationRoutes);
});

app.use(require('./middlewares/errorHandler'));

module.exports = app;
