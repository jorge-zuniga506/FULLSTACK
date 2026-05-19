require('dotenv').config();
const app = require('./app');
const { sequelize, Role } = require('./models');

const PORT = process.env.PORT || 3007;

const seedBaseRoles = async () => {
  await Role.bulkCreate(
    [
      { nombre: 'admin' },
      { nombre: 'startup' },
      { nombre: 'aceleradora' },
      { nombre: 'inversor' }
    ],
    { ignoreDuplicates: true }
  );
};

const startServer = async () => {
  try {
    await sequelize.sync({ force: false });
    await seedBaseRoles();

    const server = app.listen(PORT, () => {
      console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`El puerto ${PORT} ya esta en uso. Cierra el otro proceso o cambia PORT en tu .env.`);
        process.exit(1);
      }
      console.error('Error del servidor:', err);
      process.exit(1);
    });
  } catch (err) {
    console.error('Error al iniciar backend:', err);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

module.exports = { startServer };
