const express = require('express')
const router = express.Router()
const { crearUsuario } = require('../controllers/UserController')

router.post("/crear-usuario", crearUsuario)
router.get("/obtener-usuario", obtenerUsuario)
router.put("/editar-usuarios", actualizarUsuario)
router.delete("/eliminar-usuario", eliminarUsuario)


module.exports = router