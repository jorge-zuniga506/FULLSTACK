const express = require('express')
const router = express.Router()
const { crearMensaje, ObtenerMensajes, editarMensaje, eliminarMensaje, crearConsultaIA, ObtenerConsultasIA, editarConsultaIA, eliminarConsultaIA } = require("../controllers/CommunicationController")

router.post("/mensajes", crearMensaje)
router.get("/mensajes", ObtenerMensajes)
router.put("/mensajes/:id_mensaje", editarMensaje)
router.delete("/mensajes/:id_mensaje", eliminarMensaje)

router.post("/consultas-ia", crearConsultaIA)
router.get("/consultas-ia", ObtenerConsultasIA)
router.put("/consultas-ia/:id_consultaIA", editarConsultaIA)
router.delete("/consultas-ia/:id_consultaIA", eliminarConsultaIA)

module.exports = router
