const express = require ("express")
const router = express.Router()
const { crearRole, ObtenerRoles, editarRole, eliminarRole } = require("../controllers/RoleController")
const { authRequired, requireRole } = require("../middlewares/authMiddleware")

// All role management requires admin (role_id = 1)
router.use(authRequired, requireRole(1))

// Canonical REST routes
router.post("/", crearRole)
router.get("/", ObtenerRoles)
router.put("/:id", editarRole)
router.delete("/:id", eliminarRole)

// Backward-compatible legacy aliases
router.post("/crear-rol", crearRole)
router.get("/obtener-roles", ObtenerRoles)
router.put("/editar-rol/:id_role", editarRole)
router.delete("/eliminar-rol/:id_role", eliminarRole)

module.exports = router
