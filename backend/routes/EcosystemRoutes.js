const express = require ("express")
const router = express.Router()
const { crearEcosystem, obtnerEcosystem, editarEcosystem, eliminarEcosystem} = require("../controllers/EcosystemController")

router.post("/crear-ecosystem", crearEcosystem)
router.get("/obtener-ecosystem",obtnerEcosystem)
router.put("/editar-ecosytem",editarEcosystem)
router.delete("eliminar-ecosystem", eliminarEcosystem)

module.exports = router