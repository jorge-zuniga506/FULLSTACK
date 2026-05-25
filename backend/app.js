/**
 * app.js — Servidor HTTP principal de la aplicación
 *
 * Responsabilidades:
 * - Cargar variables de entorno (.env)
 * - Crear la instancia de Express y configurar middlewares globales
 * - Registrar todos los routers de la API bajo el prefijo /api/*
 * - Arrancar el servidor HTTP en el puerto configurado
 * - Sincronizar los modelos Sequelize con la BD al arrancar
 * - Insertar roles base (admin, startup, aceleradora, inversor) si no existen
 * - Manejar el error EADDRINUSE si el puerto ya está ocupado
 *
 * El bloque de arranque está condicionado a NODE_ENV !== 'test' para
 * que los tests de Jest puedan importar `app` sin levantar el servidor.
 *
 * Prefijos de rutas registradas:
 *   /api/usuarios      → UserRoutes
 *   /api/auth          → AuthRoutes
 *   /api/aceleradoras  → AceleradoraRoutes
 *   /api/startups      → StartupRoutes
 *   /api/sesiones      → SessionRoutes
 *   /api/sectores      → SectorRoutes
 *   /api/roles         → RoleRoutes
 *   /api/inversores    → InversorRoutes
 *   /api/ecosistemas   → EcosystemRoutes
 *   /api/communication → CommunicationRoutes
 */
require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
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
const ChatbotRoutes = require('./routes/ChatbotRoutes');
const IdentityRoutes = require('./routes/IdentityRoutes');
const DashboardRoutes = require('./routes/DashboardRoutes');

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Estandarización global de respuestas JSON { status, message, data, meta }
const responseFormatter = require('./middlewares/responseFormatter');
app.use(responseFormatter);

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
  app.use(`${prefix}/chatbot`, ChatbotRoutes);
  app.use(`${prefix}/ai`, ChatbotRoutes);
  app.use(`${prefix}/identity`, IdentityRoutes);
  app.use(`${prefix}/dashboard`, DashboardRoutes);
});

app.use(require('./middlewares/errorHandler'));

module.exports = app;
