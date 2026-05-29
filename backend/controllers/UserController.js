/**
 * controllers/UserController.js — Controlador de usuarios
 *
 * Capa HTTP que traduce requests de /api/usuarios a llamadas a UserService.
 * Gestiona códigos de error diferenciados para cada tipo de fallo.
 *
 * Funciones:
 *
 * ── crearUsuario ─────────────────────────────────────────────────────────────
 * POST /api/usuarios
 * Body: { cedula, nombre_hacienda, email, password_hash, role_id }
 * → 201: { message, usuario }
 * → 500: error de servidor (ej: email duplicado, cedula duplicada)
 *
 * ── obtenerUsuarios ───────────────────────────────────────────────────────────
 * GET /api/usuarios
 * → 200: [ ...usuarios ] (sin password_hash)
 *
 * ── eliminarUsuario ───────────────────────────────────────────────────────────
 * DELETE /api/usuarios/:id_Usuario
 * → 200: { message: 'Usuario eliminado correctamente' }
 * → 404: usuario no encontrado
 * → 500: error de servidor
 *
 * ── actualizarUsuario ─────────────────────────────────────────────────────────
 * PUT /api/usuarios/:id_Usuario
 * Body: { cedula?, nombre_hacienda?, email?, password_hash? } (role_id prohibido)
 * → 200: usuario actualizado (sin password_hash)
 * → 403: intento de cambiar role_id
 * → 404: usuario no encontrado
 * → 500: error de servidor
 */
const UserService = require('../services/UserService');
const AdminAuditService = require('../services/AdminAuditService');
const getUserId = (params) => params.id || params.id_Usuario;

const crearUsuario = async (req, res) => {
  try {
    const usuario = await UserService.crearUsuario(req.body);
    res.status(201).json({
      message: 'Usuario creado exitosamente',
      usuario
    });
  } catch (error) {
    if (error.message === 'Rol invalido. Solo se permite registrar Startup, Aceleradora o Inversionista.') {
      return res.status(400).json({ message: error.message });
    }

    if (error.name === 'SequelizeUniqueConstraintError') {
      const duplicateFields = (error.errors || []).map((e) => e.path);
      if (duplicateFields.includes('email')) {
        return res.status(409).json({ message: 'Ya existe una cuenta registrada con ese correo.' });
      }
      if (duplicateFields.includes('cedula')) {
        return res.status(409).json({ message: 'Ya existe una cuenta registrada con esa cedula.' });
      }
      return res.status(409).json({ message: 'Ya existe un usuario con los datos proporcionados.' });
    }

    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ message: 'El rol seleccionado no es valido.' });
    }

    if (error.name === 'SequelizeValidationError') {
      const firstMessage = error.errors?.[0]?.message || 'Datos de registro invalidos.';
      return res.status(400).json({ message: firstMessage });
    }

    res.status(500).json({
      message: 'Error al crear el usuario',
      error:   error.message
    });
  }
};

const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await UserService.obtenerUsuarios();
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los usuarios', error: error.message });
  }
};

/**
 * Elimina un usuario por su ID
 * El parámetro de ruta es :id_Usuario (no :id)
 */
const eliminarUsuario = async (req, res) => {
  try {
    const targetUserId = Number(getUserId(req.params));
    await UserService.eliminarUsuario(targetUserId);

    if (req.user?.role_id === 1) {
      await AdminAuditService.log({
        adminUserId: req.user.id,
        action: 'DELETE',
        entity: 'user',
        entityId: targetUserId,
        details: {
          endpoint: 'DELETE /api/usuarios/:id'
        }
      });
    }

    res.status(200).json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    if (error.message === 'Usuario no encontrado') {
      return res.status(404).json({ message: error.message });
    }
    if (error.message === 'No se puede eliminar el unico administrador del sistema.') {
      return res.status(409).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error al eliminar el usuario', error: error.message });
  }
};

/**
 * Actualiza los datos de un usuario (role_id está bloqueado → 403)
 */
const actualizarUsuario = async (req, res) => {
  try {
    const targetUserId = Number(getUserId(req.params));
    const requesterId = Number(req.user?.id);
    const isAdmin = Number(req.user?.role_id) === 1;

    if (!isAdmin && requesterId !== targetUserId) {
      return res.status(403).json({ message: 'No autorizado. Solo puedes editar tu propio perfil.' });
    }

    const usuarioEditado = await UserService.actualizarUsuario(targetUserId, req.body);

    if (isAdmin) {
      const changedFields = Object.keys(req.body || {}).filter((key) => key !== 'password_hash');
      await AdminAuditService.log({
        adminUserId: req.user.id,
        action: 'UPDATE',
        entity: 'user',
        entityId: targetUserId,
        details: {
          endpoint: 'PUT /api/usuarios/:id',
          changedFields
        }
      });
    }

    res.status(200).json(usuarioEditado);
  } catch (error) {
    if (error.message === 'Usuario no encontrado') {
      return res.status(404).json({ message: error.message });
    }
    // Intento de cambiar el rol → 403 Forbidden
    if (error.message === 'No se permite cambiar el rol del usuario desde este endpoint.') {
      return res.status(403).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error al editar el usuario', error: error.message });
  }
};

const obtenerAdminAuditLogs = async (req, res) => {
  try {
    const limit = req.query?.limit ? parseInt(req.query.limit, 10) : 100;
    const logs = await AdminAuditService.listRecent({ limit });
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la bitacora administrativa', error: error.message });
  }
};

module.exports = {
  crearUsuario,
  obtenerUsuarios,
  eliminarUsuario,
  actualizarUsuario,
  obtenerAdminAuditLogs
};
