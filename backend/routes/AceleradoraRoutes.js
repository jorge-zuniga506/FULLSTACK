const express = require('express')
const router = express.Router()
const { crearAceleradora, ObtenerAceleradoras, editarAceleradora, eliminarAceleradora } = require("../controllers/AceleradoraController")

router.post("/crear-aceleradora", crearAceleradora)
router.get("/obtener-aceleradora", ObtenerAceleradoras)
router.put("/editar-aceleradora/:id_aceleradora", editarAceleradora)
router.delete("/eliminar-aceleradora/:id_aceleradora", eliminarAceleradora)

module.exports = router
