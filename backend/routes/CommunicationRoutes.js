const express = require('express')
const router = express.Router()
const { crearCommunication, obtenerCommunication, editarCommunication, eliminarCommunication} = require("../controllers/CommunicationController")

router.post("/crear-communication", crearCommunication)
router.get("/obtener-communication", obtenerCommunication)
router.put("/editar-communication", editarCommunication)
router.delete("/eliminar-communication", eliminarCommunication)

module.exports = router