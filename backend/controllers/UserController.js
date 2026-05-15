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

/**
 * Crea un nuevo usuario en la plataforma
 */
const crearUsuario = async (req, res) => {
  try {
    const usuario = await UserService.crearUsuario(req.body);
    res.status(201).json({
      message: 'Usuario creado exitosamente',
      usuario
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al crear el usuario',
      error:   error.message
    });
  }
};

/**
 * Lista todos los usuarios sin sus contraseñas hasheadas
 */
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
    await UserService.eliminarUsuario(req.params.id_Usuario);
    res.status(200).json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    if (error.message === 'Usuario no encontrado') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error al eliminar el usuario', error: error.message });
  }
};

/**
 * Actualiza los datos de un usuario (role_id está bloqueado → 403)
 */
const actualizarUsuario = async (req, res) => {
  try {
    const usuarioEditado = await UserService.actualizarUsuario(req.params.id_Usuario, req.body);
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

module.exports = { crearUsuario, obtenerUsuarios, eliminarUsuario, actualizarUsuario };
