const express = require('express');
const router = express.Router();
const { authRequired, requireRole } = require('../middlewares/authMiddleware');
const {
  crearConvocatoria,
  listarConvocatoriasAceleradora,
  actualizarConvocatoria,
  listarConvocatoriasPublicas,
  postularStartup,
  listarPostulacionesStartup,
  listarPostulaciones,
  cambiarEstadoPostulacion
} = require('../controllers/ConvocatoriaController');

// Públicas (startups autenticadas pueden ver convocatorias abiertas)
router.get('/publicas', authRequired, listarConvocatoriasPublicas);

// Aceleradora
router.post('/', authRequired, requireRole(3), crearConvocatoria);
router.get('/mis-convocatorias', authRequired, requireRole(3), listarConvocatoriasAceleradora);
router.put('/:id', authRequired, requireRole(3), actualizarConvocatoria);
router.get('/postulaciones', authRequired, requireRole(3), listarPostulaciones);
router.patch('/postulaciones/:id/estado', authRequired, requireRole(3), cambiarEstadoPostulacion);

// Startup
router.post('/postular', authRequired, requireRole(2), postularStartup);
router.get('/mis-postulaciones', authRequired, requireRole(2), listarPostulacionesStartup);

module.exports = router;
