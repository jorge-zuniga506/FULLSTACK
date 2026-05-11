require('dotenv').config();
const express = require('express');
const trelloRoutes = require('./routes/trello.routes');
const { sequelize } = require('./models');

// Sincronizar Base de Datos
sequelize.sync({ force: false }) // force: false no borra datos existentes, solo crea lo que falta
  .then(() => console.log('Tablas sincronizadas correctamente en MySQL.'))
  .catch(err => console.error('Error al sincronizar tablas:', err));



const app = express();
app.use(express.json());
app.use('/api/trello', trelloRoutes);

app.get('/', (req, res) => {
  res.send('Backend de Trello listo. Usa /api/trello/boards o /api/trello/cards.');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});
