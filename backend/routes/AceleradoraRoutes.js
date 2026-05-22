const express = require('express')
const router = express.Router()
const { crearAceleradora, ObtenerAceleradoras, editarAceleradora, eliminarAceleradora } = require("../controllers/AceleradoraController")
const { validarAceleradora } = require("../middlewares/validators")
const { authRequired } = require("../middlewares/authMiddleware")

// Public: list aceleradoras
router.get("/", ObtenerAceleradoras)
router.get("/obtener-aceleradora", ObtenerAceleradoras)

// Protected: write operations require authentication
router.post("/", authRequired, validarAceleradora, crearAceleradora)
router.put("/:id", authRequired, validarAceleradora, editarAceleradora)
router.delete("/:id", authRequired, eliminarAceleradora)

// Backward-compatible legacy aliases (protected)
router.post("/crear-aceleradora", authRequired, validarAceleradora, crearAceleradora)
router.put("/editar-aceleradora/:id_aceleradora", authRequired, validarAceleradora, editarAceleradora)
router.delete("/eliminar-aceleradora/:id_aceleradora", authRequired, eliminarAceleradora)

module.exports = router
