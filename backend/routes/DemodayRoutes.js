const express = require('express');
const router = express.Router();
const { authRequired, requireRole } = require('../middlewares/authMiddleware');
const {
  listarStartupsGraduadas,
  solicitarReunion,
  listarSolicitudesInversor,
  listarSolicitudesStartup,
  responderSolicitud
} = require('../controllers/DemodayController');

// Inversor
router.get('/startups', authRequired, requireRole(4), listarStartupsGraduadas);
router.post('/solicitar', authRequired, requireRole(4), solicitarReunion);
router.get('/mis-solicitudes', authRequired, requireRole(4), listarSolicitudesInversor);

// Startup
router.get('/solicitudes-recibidas', authRequired, requireRole(2), listarSolicitudesStartup);
router.patch('/solicitudes/:id', authRequired, requireRole(2), responderSolicitud);

module.exports = router;
