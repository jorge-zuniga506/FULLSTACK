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
const { sequelize, Role } = require('./models');

// ─── Importación de routers ────────────────────────────────────────────────────
const UserRoutes          = require('./routes/UserRoutes');
const AuthRoutes          = require('./routes/AuthRoutes');
const AceleradoraRoutes   = require('./routes/AceleradoraRoutes');
const StartupRoutes       = require('./routes/StartupRoutes');
const SessionRoutes       = require('./routes/SessionRoutes');
const SectorRoutes        = require('./routes/SectorRoutes');
const RoleRoutes          = require('./routes/RoleRoutes');
const InversorRoutes      = require('./routes/InversorRoutes');
const EcosystemRoutes     = require('./routes/EcosystemRoutes');
const CommunicationRoutes = require('./routes/CommunicationRoutes');

// ─── Instancia de Express ──────────────────────────────────────────────────────
const app = express();

// Parsea el body de las peticiones como JSON
app.use(express.json());

// ─── Ruta raíz (health check) ──────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.send('Backend del Ecosistema de Startups listo.');
});

// ─── Registro de routers ───────────────────────────────────────────────────────
app.use('/api/usuarios',      UserRoutes);
app.use('/api/auth',          AuthRoutes);
app.use('/api/aceleradoras',  AceleradoraRoutes);
app.use('/api/startups',      StartupRoutes);
app.use('/api/sesiones',      SessionRoutes);
app.use('/api/sectores',      SectorRoutes);
app.use('/api/roles',         RoleRoutes);
app.use('/api/inversores',    InversorRoutes);
app.use('/api/ecosistemas',   EcosystemRoutes);
app.use('/api/communication', CommunicationRoutes);

// ─── Middleware global de manejo de errores ────────────────────────────────────
// Debe registrarse AL FINAL de las rutas para capturar errores propagados con next(err)
app.use(require('./middlewares/errorHandler'));

// ─── Puerto de escucha ────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3007;

// Solo arranca el servidor real cuando NO estamos en modo test
// Esto permite que Jest importe `app` sin colisiones de puertos
if (process.env.NODE_ENV !== 'test') {
  const server = app.listen(PORT, async () => {
    console.log(`Servidor backend escuchando en http://localhost:${PORT}`);

    // Sincronizar modelos Sequelize con la BD
    // force: false → solo crea tablas faltantes, NO borra datos existentes
    try {
      await sequelize.sync({ force: false });

      // Insertar roles predefinidos si no existen (ignoreDuplicates evita errores)
      await Role.bulkCreate(
        [
          { nombre: 'admin'       },
          { nombre: 'startup'     },
          { nombre: 'aceleradora' },
          { nombre: 'inversor'    },
        ],
        { ignoreDuplicates: true }
      );
      console.log('Tablas sincronizadas correctamente en MySQL.');
    } catch (err) {
      console.error('Error al sincronizar tablas:', err);
    }
  });

  // Manejo de errores del servidor HTTP
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      // El puerto ya está ocupado por otro proceso
      console.error(`El puerto ${PORT} ya está en uso. Cierra el otro proceso o cambia PORT en tu .env.`);
      process.exit(1);
    }
    console.error('Error del servidor:', err);
    process.exit(1);
  });
}

// Exporta `app` para que los tests de Jest puedan importarla
module.exports = app;
