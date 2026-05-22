const express = require ("express")
const router = express.Router()
const { crearSector, ObtenerSectores, editarSector, eliminarSector } = require("../controllers/SectorController")
const { authRequired, requireRole } = require("../middlewares/authMiddleware")

// Public: list sectors
router.get("/", ObtenerSectores)
router.get("/obtener-sector", ObtenerSectores)

// Protected: write operations require admin (role_id = 1)
router.post("/", authRequired, requireRole(1), crearSector)
router.put("/:id", authRequired, requireRole(1), editarSector)
router.delete("/:id", authRequired, requireRole(1), eliminarSector)

// Backward-compatible legacy aliases (protected)
router.post("/crear-sector", authRequired, requireRole(1), crearSector)
router.put("/editar-sector/:id_sector", authRequired, requireRole(1), editarSector)
router.delete("/eliminar-sector/:id_sector", authRequired, requireRole(1), eliminarSector)

module.exports = router
