const express = require ("express")
const router = express.Router()
const { crearInversor, ObtenerInversores, editarInversor, eliminarInversor } = require("../controllers/InversorController")
const { validarInversor } = require("../middlewares/validators")
const { authRequired } = require("../middlewares/authMiddleware")

// Public: list inversores
router.get("/", ObtenerInversores)
router.get("/obtener-inversores", ObtenerInversores)

// Protected: write operations require authentication
router.post("/", authRequired, validarInversor, crearInversor)
router.put("/:id", authRequired, validarInversor, editarInversor)
router.delete("/:id", authRequired, eliminarInversor)

// Backward-compatible legacy aliases (protected)
router.post("/crear-inversor", authRequired, validarInversor, crearInversor)
router.put("/editar-inversor/:id_inversor", authRequired, validarInversor, editarInversor)
router.delete("/eliminar-inversor/:id_inversor", authRequired, eliminarInversor)

module.exports = router
