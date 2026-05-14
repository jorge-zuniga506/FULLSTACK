const express = require('express')
const router = express.Router()
const { crearStartup, ObtenerStartups, editarStartup, eliminarStartup } = require("../controllers/StartupCotroller")

router.post("/crear-startup", crearStartup)
router.get("/obtener-startups", ObtenerStartups)
router.put("/editar-startups/:id_Startup", editarStartup)
router.delete("/eliminar-startup/:id_Startup", eliminarStartup)

module.exports = router
