const express = require('express');
const router = express.Router();
const {
  crearUsuario,
  obtenerUsuarios,
  actualizarUsuario,
  eliminarUsuario,
  obtenerAdminAuditLogs
} = require('../controllers/UserController');
const { validarUsuario, validarActualizacionUsuario } = require('../middlewares/validators');
const { authRequired, requireRole } = require('../middlewares/authMiddleware');

// Public: user registration
router.post("/", validarUsuario, crearUsuario);
router.post("/register", validarUsuario, crearUsuario);
router.post("/crear-usuario", validarUsuario, crearUsuario);

// Protected: list, update, delete require auth
// List all users and delete any user require admin (role_id = 1)
router.get("/", authRequired, requireRole(1), obtenerUsuarios);
router.get("/obtener-usuario", authRequired, requireRole(1), obtenerUsuarios);
router.get("/admin-audit", authRequired, requireRole(1), obtenerAdminAuditLogs);

router.put("/:id", authRequired, validarActualizacionUsuario, actualizarUsuario);
router.put("/editar-usuarios/:id_Usuario", authRequired, validarActualizacionUsuario, actualizarUsuario);

router.delete("/:id", authRequired, requireRole(1), eliminarUsuario);
router.delete("/eliminar-usuario/:id_Usuario", authRequired, requireRole(1), eliminarUsuario);

module.exports = router;
