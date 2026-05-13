const express = require('express')
const router = express.Router()
const { crearAceleradora, obtenerAceleradora, editarAceleradora, eliminarAceleradora} = require("../controllers/AceleradoraController")

router.post("/crear-aceleradora", crearAceleradora)
router.get("/obtener-aceleradora", obtenerAceleradora)
router.put("/editar-aceleradora", editarAceleradora)
router.delete("/eliminar-aceleradora", eliminarAceleradora)

module.exports = router