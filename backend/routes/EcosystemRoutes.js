const express = require ("express")
const router = express.Router()
const {
  crearGeolocalizacion,
  ObtenerGeolocalizaciones,
  editarGeolocalizacion,
  eliminarGeolocalizacion
} = require("../controllers/EcosystemController")

router.post("/crear-ecosystem", crearGeolocalizacion)
router.get("/obtener-ecosystem", ObtenerGeolocalizaciones)
router.put("/editar-ecosytem/:id_geolocalizacion", editarGeolocalizacion)
router.delete("/eliminar-ecosystem/:id_geolocalizacion", eliminarGeolocalizacion)

module.exports = router
