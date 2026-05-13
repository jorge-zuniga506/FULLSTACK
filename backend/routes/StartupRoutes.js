const express = require('express')
const router = express.Router()
const{crearStartup, obtenerStartup, editarStartup, eliminarStartup} = require("../controllers/StartupController")

router.post("/crear-startup", crearStartup)
router.get("/obtener-startups", obtenerStartup)
router.put("/editar-startups",editarStartup)
router.delete("/eliminar-startup", eliminarStartup)

module.exports = router