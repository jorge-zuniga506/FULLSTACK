const express = require("express")
const router = express.Router()
const { crearSession, obtenerSession, editarSession, eliminarSession} = require("../controllers/SessionController")

router.post("/crear-session", crearSession)
router.get("/obtener-session", obtenerSession)
router.put("/editar-session", editarSessionrSession)
router.delete("/eliminar-session", eliminarSession)

module.exports = router
