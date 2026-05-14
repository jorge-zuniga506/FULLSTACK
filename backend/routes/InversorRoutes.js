const express = require ("express")
const router = express.Router()
const { crearInversor, ObtenerInversores, editarInversor, eliminarInversor } = require("../controllers/InversorController")

router.post("/crear-inversor", crearInversor)
router.get("/obtener-inversores", ObtenerInversores)
router.put("/editar-inversor/:id_inversor", editarInversor)
router.delete("/eliminar-inversor/:id_inversor", eliminarInversor)

module.exports = router
