const express = require ("express")
const router = express.Router()
const { crearSector, obtenerSector, editarSector, eliminarSector} = require("../controllers/RoleController")

router.post("/crear-rol", crearRole)
router.get("/obtener-roles", obtenerRole)
router.put("editar-rol", editarRole)
router.delete("/eliminar-rol", eliminarRole)

module.exports = router