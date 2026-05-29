const express = require('express');
const router = express.Router();
const { authRequired, requireRole } = require('../middlewares/authMiddleware');
const {
  crearPerk, listarPerksAceleradora, listarPerksDisponiblesStartup, reclamarPerk,
  listarReclamacionesPerk, gestionarReclamacion,
  crearMentor, listarMentoresAceleradora, listarMentoresDisponibles,
  reservarMentoria, listarReservasStartup, listarReservasAceleradora, gestionarReserva
} = require('../controllers/PerksController');

// ── Perks ─────────────────────────────────────────────────────────────────────
router.post('/perks', authRequired, requireRole(3), crearPerk);
router.get('/perks/mis-perks', authRequired, requireRole(3), listarPerksAceleradora);
router.get('/perks/reclamaciones', authRequired, requireRole(3), listarReclamacionesPerk);
router.patch('/perks/reclamaciones/:id', authRequired, requireRole(3), gestionarReclamacion);

router.get('/perks/disponibles', authRequired, requireRole(2), listarPerksDisponiblesStartup);
router.post('/perks/reclamar', authRequired, requireRole(2), reclamarPerk);

// ── Mentores ──────────────────────────────────────────────────────────────────
router.post('/mentores', authRequired, requireRole(3), crearMentor);
router.get('/mentores/mis-mentores', authRequired, requireRole(3), listarMentoresAceleradora);
router.get('/mentores/reservas', authRequired, requireRole(3), listarReservasAceleradora);
router.patch('/mentores/reservas/:id', authRequired, requireRole(3), gestionarReserva);

router.get('/mentores/disponibles', authRequired, requireRole(2), listarMentoresDisponibles);
router.post('/mentores/reservar', authRequired, requireRole(2), reservarMentoria);
router.get('/mentores/mis-reservas', authRequired, requireRole(2), listarReservasStartup);

module.exports = router;
