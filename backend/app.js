require('dotenv').config();
const express = require('express');
const { sequelize, Role } = require('./models');

const app = express();
app.use(express.json());

// Aquí puedes agregar tus rutas personalizadas
// app.use('/api/users', userRoutes);
// app.use('/api/startups', startupRoutes);

app.get('/', (req, res) => {
  res.send('Backend del Ecosistema de Startups listo.');
});

// Middleware global de manejo de errores
app.use(require('./middlewares/errorHandler'));

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, async () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);

  // Sincronizar Base de Datos después de que el servidor esté corriendo
  try {
    await sequelize.sync({ force: false }); // force: false no borra datos existentes, solo crea lo que falta
    await Role.bulkCreate(
      [{ nombre: 'admin' }, { nombre: 'startup' }, { nombre: 'aceleradora' }, { nombre: 'inversor' }],
      { ignoreDuplicates: true }
    );
    console.log('Tablas sincronizadas correctamente en MySQL.');
  } catch (err) {
    console.error('Error al sincronizar tablas:', err);
  }
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`El puerto ${PORT} ya está en uso. Cierra el otro proceso o cambia PORT en tu .env.`);
    process.exit(1);
  }

  console.error('Error del servidor:', err);
  process.exit(1);
});
