const express = require('express');
const router = express.Router();
const { authRequired, requireRole } = require('../middlewares/authMiddleware');
const { registrarKpi, listarKpisStartup, listarKpisCohorte } = require('../controllers/KpiController');

router.post('/', authRequired, requireRole(2), registrarKpi);
router.get('/mis-kpis', authRequired, requireRole(2), listarKpisStartup);
router.get('/cohorte', authRequired, requireRole(3), listarKpisCohorte);

module.exports = router;
