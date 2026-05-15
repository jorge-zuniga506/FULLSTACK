const express = require('express')
const router = express.Router()
const { crearStartup, ObtenerStartups, editarStartup, eliminarStartup } = require("../controllers/StartupCotroller")
const { validarStartup } = require("../middlewares/validators")

router.post("/crear-startup", validarStartup, crearStartup)
router.get("/obtener-startups", ObtenerStartups)
router.put("/editar-startups/:id_Startup", validarStartup, editarStartup)
router.delete("/eliminar-startup/:id_Startup", eliminarStartup)

module.exports = router
