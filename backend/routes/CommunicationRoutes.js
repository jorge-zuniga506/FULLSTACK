const express = require('express')
const router = express.Router()
const { crearMensaje, ObtenerMensajes, editarMensaje, eliminarMensaje } = require("../controllers/CommunicationCotroller")

router.post("/crear-communication", crearMensaje)
router.get("/obtener-communication", ObtenerMensajes)
router.put("/editar-communication/:id_mensaje", editarMensaje)
router.delete("/eliminar-communication/:id_mensaje", eliminarMensaje)

module.exports = router
