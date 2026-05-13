const express = require('express');
const router = express.Router();
const { crearUsuario, obtenerUsuarios, actualizarUsuario, eliminarUsuario } = require('../controllers/UserController');

// Endpoints
router.post("/crear-usuario", crearUsuario);
router.get("/obtener-usuario", obtenerUsuarios);
router.put("/editar-usuarios/:id_Usuario", actualizarUsuario);
router.delete("/eliminar-usuario/:id_Usuario", eliminarUsuario);

module.exports = router;