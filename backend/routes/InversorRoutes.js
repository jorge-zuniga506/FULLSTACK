const express = require ("express")
const router = express.Router()
const {crearInversor, obtenerInversores, editarInversor, eliminarInversor} = require("../controllers/InversorController")

router.post("/crear-inversor", crearInversor)
router.get("/obtener-inversores", obtenerInversores)
router.put("/editar-inversor", editarInversor)
router.delete("/eliminar-inversor", eliminarInversor)

module.exports = router
