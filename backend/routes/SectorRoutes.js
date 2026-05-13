const express = require ("express")
const router = express.Router()
const {crearSector,obtenerSector,editarSector,eliminarSector} = require("../controllers/SectorController")

router.post("/crear-sector", crearSector)
router.get("/obtener-sector", obtenerSector)
router.put("/editar-sector", editarSector)
router.delete("/eliminar-sector", eliminarSector)

module.exports = router