const express = require("express")
const router = express.Router()
const { crearSession, ObtenerSessions, editarSession, eliminarSession } = require("../controllers/SessionController")
const { authRequired, requireRole } = require("../middlewares/authMiddleware")

// Session management requires admin (role_id = 1)
router.use(authRequired, requireRole(1))

// Canonical REST routes
router.post("/", crearSession)
router.get("/", ObtenerSessions)
router.put("/:id", editarSession)
router.delete("/:id", eliminarSession)

// Backward-compatible legacy aliases
router.post("/crear-session", crearSession)
router.get("/obtener-session", ObtenerSessions)
router.put("/editar-session/:id_session", editarSession)
router.delete("/eliminar-session/:id_session", eliminarSession)

module.exports = router
