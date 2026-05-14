const express = require ("express")
const router = express.Router()
const { crearRole, ObtenerRoles, editarRole, eliminarRole } = require("../controllers/RoleController")

router.post("/crear-rol", crearRole)
router.get("/obtener-roles", ObtenerRoles)
router.put("/editar-rol/:id_role", editarRole)
router.delete("/eliminar-rol/:id_role", eliminarRole)

module.exports = router
