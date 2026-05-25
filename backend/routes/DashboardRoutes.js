const express = require('express');
const router = express.Router();
const { authRequired, requireRole } = require('../middlewares/authMiddleware');
const {
  getStartupDashboard,
  getAceleradoraDashboard,
  getInversorDashboard,
  getAdminDashboard
} = require('../controllers/DashboardController');

// Rutas protegidas por autenticación y rol específico
router.get('/startup', authRequired, requireRole(2), getStartupDashboard);
router.get('/aceleradora', authRequired, requireRole(3), getAceleradoraDashboard);
router.get('/inversor', authRequired, requireRole(4), getInversorDashboard);
router.get('/admin', authRequired, requireRole(1), getAdminDashboard);

module.exports = router;
