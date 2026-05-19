const express = require('express');
const router = express.Router();
const { crearUsuario, obtenerUsuarios, actualizarUsuario, eliminarUsuario } = require('../controllers/UserController');
const { validarUsuario, validarActualizacionUsuario } = require('../middlewares/validators');

// Endpoints
router.post("/crear-usuario", validarUsuario, crearUsuario);
router.get("/obtener-usuario", obtenerUsuarios);
router.put("/editar-usuarios/:id_Usuario", validarActualizacionUsuario, actualizarUsuario);
router.delete("/eliminar-usuario/:id_Usuario", eliminarUsuario);

module.exports = router;