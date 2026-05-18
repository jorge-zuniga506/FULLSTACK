const express = require('express');
const router = express.Router();
const { authRequired } = require('../middlewares/authMiddleware');
const {
  obtenerNotificacionesUsuario,
  contarNoLeidas,
  marcarComoLeida,
  marcarTodasComoLeidas,
  eliminarNotificacion
} = require('../controllers/NotificationController');

// All notification endpoints require authentication
router.use(authRequired);

// Canonical REST routes
router.get("/", obtenerNotificacionesUsuario);
router.put("/:id", marcarComoLeida);
router.delete("/:id", eliminarNotificacion);

// Additional endpoints
router.get("/no-leidas", contarNoLeidas);
router.put("/", marcarTodasComoLeidas);

module.exports = router;
