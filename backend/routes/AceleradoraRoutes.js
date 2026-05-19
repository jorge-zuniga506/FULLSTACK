const express = require('express')
const router = express.Router()
const { crearAceleradora, ObtenerAceleradoras, editarAceleradora, eliminarAceleradora } = require("../controllers/AceleradoraController")
const { validarAceleradora } = require("../middlewares/validators")

router.post("/crear-aceleradora", validarAceleradora, crearAceleradora)
router.get("/obtener-aceleradora", ObtenerAceleradoras)
router.put("/editar-aceleradora/:id_aceleradora", validarAceleradora, editarAceleradora)
router.delete("/eliminar-aceleradora/:id_aceleradora", eliminarAceleradora)

module.exports = router
