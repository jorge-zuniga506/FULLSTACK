const express = require('express')
const router = express.Router()
const {
  crearMensaje,
  ObtenerMensajes,
  crearMensajeContactoPublico,
  listarMensajesContactoPublico,
  listarChats,
  crearChat,
  obtenerMensajesPorChat,
  enviarMensajeAlChat,
  editarMensaje,
  eliminarMensaje,
  marcarMensajeComoLeido,
  marcarMensajesChatComoLeidos,
  crearConsultaIA,
  ObtenerConsultasIA,
  editarConsultaIA,
  eliminarConsultaIA
} = require("../controllers/CommunicationController")
const { authRequired, requireRole } = require("../middlewares/authMiddleware")

// Public: contact form submission
router.post('/contacto-publico', crearMensajeContactoPublico)

// Protected: everything else requires auth
// Contact messages list requires admin (role_id = 1)
router.get('/contacto-publico', authRequired, requireRole(1), listarMensajesContactoPublico)

// Chats and messages
router.get("/chats", authRequired, listarChats)
router.post("/chats", authRequired, crearChat)
router.get("/chats/:chat_id/mensajes", authRequired, obtenerMensajesPorChat)
router.post("/chats/:chat_id/mensajes", authRequired, enviarMensajeAlChat)

router.post("/mensajes", authRequired, crearMensaje)
router.get("/mensajes", authRequired, ObtenerMensajes)
router.put("/mensajes/leer-todos", authRequired, marcarMensajesChatComoLeidos)
router.put("/mensajes/:id_mensaje/leer", authRequired, marcarMensajeComoLeido)
router.put("/mensajes/:id_mensaje", authRequired, editarMensaje)
router.delete("/mensajes/:id_mensaje", authRequired, eliminarMensaje)

// AI consultations
router.post("/consultas-ia", authRequired, crearConsultaIA)
router.get("/consultas-ia", authRequired, ObtenerConsultasIA)
router.put("/consultas-ia/:id_consultaIA", authRequired, editarConsultaIA)
router.delete("/consultas-ia/:id_consultaIA", authRequired, eliminarConsultaIA)

module.exports = router
