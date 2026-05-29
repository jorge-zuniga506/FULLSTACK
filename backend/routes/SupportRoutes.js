const express = require('express');
const router = express.Router();
const { authRequired, requireRole } = require('../middlewares/authMiddleware');
const {
  crearReporteSoporte,
  listarReportesAdmin,
  listarMisReportes,
  actualizarEstadoReporte
} = require('../controllers/SupportController');

router.post('/reportes', authRequired, crearReporteSoporte);
router.get('/mis-reportes', authRequired, listarMisReportes);
router.get('/reportes', authRequired, requireRole(1), listarReportesAdmin);
router.patch('/reportes/:id/estado', authRequired, requireRole(1), actualizarEstadoReporte);

module.exports = router;
