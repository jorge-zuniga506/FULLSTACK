require('dotenv').config();
const express = require('express');
const trelloRoutes = require('./routes/trello.routes');

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
