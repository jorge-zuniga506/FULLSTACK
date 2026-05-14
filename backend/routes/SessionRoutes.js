const express = require("express")
const router = express.Router()
const { crearSession, ObtenerSessions, editarSession, eliminarSession } = require("../controllers/SessionController")

router.post("/crear-session", crearSession)
router.get("/obtener-session", ObtenerSessions)
router.put("/editar-session/:id_session", editarSession)
router.delete("/eliminar-session/:id_session", eliminarSession)

module.exports = router
