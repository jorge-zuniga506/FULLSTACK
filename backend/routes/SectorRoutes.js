const express = require ("express")
const router = express.Router()
const { crearSector, ObtenerSectores, editarSector, eliminarSector } = require("../controllers/SectorCotroller")

router.post("/crear-sector", crearSector)
router.get("/obtener-sector", ObtenerSectores)
router.put("/editar-sector/:id_sector", editarSector)
router.delete("/eliminar-sector/:id_sector", eliminarSector)

module.exports = router
