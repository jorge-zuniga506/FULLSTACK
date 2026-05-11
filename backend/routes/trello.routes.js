const express = require('express');
const { getBoards, getCards, createCard } = require('../services/trelloService');
const router = express.Router();

router.get('/boards', async (req, res) => {
  try {
    const boards = await getBoards();
    res.json(boards);
  } catch (error) {
    console.error('Error al obtener tableros Trello:', error.message);
    res.status(500).json({ error: 'Error al obtener tableros de Trello' });
  }
});

router.get('/cards', async (req, res) => {
  const { idList } = req.query;
  if (!idList) {
    return res.status(400).json({ error: 'Debe enviar idList como query param' });
  }

  try {
    const cards = await getCards(idList);
    res.json(cards);
  } catch (error) {
    console.error('Error al obtener tarjetas Trello:', error.message);
    res.status(500).json({ error: 'Error al obtener tarjetas de Trello' });
  }
});

router.post('/cards', async (req, res) => {
  const { name, desc, idList, due } = req.body;

  if (!name || !idList) {
    return res.status(400).json({ error: 'Los campos name e idList son obligatorios' });
  }

  try {
    const card = await createCard({ name, desc, idList, due });
    res.status(201).json(card);
  } catch (error) {
    console.error('Error al crear tarjeta Trello:', error.message);
    res.status(500).json({ error: 'Error al crear tarjeta en Trello' });
  }
});

module.exports = router;
