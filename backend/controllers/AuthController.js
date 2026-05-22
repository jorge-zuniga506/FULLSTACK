/**
 * controllers/AuthController.js — Controlador de autenticación
 *
 * Actúa como capa HTTP entre las rutas de autenticación y AuthService.
 * No contiene lógica de negocio — solo traduce requests HTTP en llamadas
 * al service y formatea las respuestas JSON.
 *
 * Funciones:
 *
 * ── login ────────────────────────────────────────────────────────────────────
 * POST /api/auth/login
 * Body: { email, password }
 * → 200: { message, token, usuario }
 * → 400: campos faltantes
 * → 401: credenciales inválidas
 * → 500: error de servidor
 *
 * ── logout ───────────────────────────────────────────────────────────────────
 * POST /api/auth/logout   [requiere authRequired]
 * Header: Authorization: Bearer <token>
 * → 200: { message: 'Logout exitoso. Token invalidado.' }
 * → 400: token faltante o sesión ya inválida
 * → 500: error de servidor
 *
 * ── getMe ────────────────────────────────────────────────────────────────────
 * GET /api/auth/me   [requiere authRequired]
 * → 200: { message, user }
 * → 404: usuario no encontrado (caso extremo post-eliminación)
 * → 500: error de servidor
 *
 * El token para logout se extrae del mismo header Authorization
 * (authMiddleware ya lo validó previamente, aquí solo se lee para pasarlo al service)
 */
const AuthService = require('../services/AuthService');

/**
 * Maneja el inicio de sesión — genera JWT y crea sesión en BD
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const authData = await AuthService.login(email, password);

    res.status(200).json({
      message: 'Autenticación exitosa',
      token:   authData.token,
      usuario: authData.usuario,
      redirectPath: authData.redirectPath,
      requiresExtraVerification: authData.requiresExtraVerification,
      verificationCode: authData.verificationCode
    });
  } catch (error) {
    // Distingue entre errores de validación (400) y credenciales inválidas (401)
    if (error.message === 'Por favor ingrese email y contraseña.') {
      return res.status(400).json({ message: error.message });
    }
    if (error.message === 'Credenciales inválidas.') {
      return res.status(401).json({ message: error.message });
    }
    res.status(500).json({
      message: 'Error en el servidor al intentar iniciar sesión',
      error:   error.message
    });
  }
};

const verifyRoleCode = async (req, res) => {
  try {
    const { code } = req.body;
    const userId = req.user.id;

    await AuthService.verifyRoleCode(userId, code);

    res.status(200).json({
      message: 'Código de verificación verificado con éxito.'
    });
  } catch (error) {
    if (error.message === 'El código es requerido.' ||
        error.message === 'Código de verificación inválido.' ||
        error.message === 'El código ha expirado.') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({
      message: 'Error al verificar código de rol',
      error: error.message
    });
  }
};

/**
 * Maneja el cierre de sesión — marca el JWT como inválido en BD
 */
const logout = async (req, res) => {
  try {
    // El token viene del header Authorization (ya validado por authRequired)
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    await AuthService.logout(token);
    res.status(200).json({ message: 'Logout exitoso. Token invalidado.' });
  } catch (error) {
    if (error.message === 'Token requerido para logout.' ||
        error.message === 'Sesión no encontrada o ya inválida.') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({
      message: 'Error en el servidor al intentar cerrar sesión',
      error:   error.message
    });
  }
};

/**
 * Retorna los datos del usuario autenticado (desde req.user.id)
 */
const getMe = async (req, res) => {
  try {
    // req.user.id fue adjuntado por authMiddleware al verificar el JWT
    const usuario = await AuthService.getMe(req.user.id);
    res.status(200).json({
      message: 'Datos del usuario obtenidos exitosamente',
      user:    usuario
    });
  } catch (error) {
    if (error.message === 'Usuario no encontrado.') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error al obtener datos del usuario', error: error.message });
  }
};

const resetRoleCode = async (req, res) => {
  try {
    const { password } = req.body;
    const userId = req.user.id;

    const newCode = await AuthService.resetRoleCode(userId, password);

    res.status(200).json({
      message: 'Código de verificación restablecido con éxito.',
      verificationCode: newCode
    });
  } catch (error) {
    if (error.message === 'La contraseña es requerida.' ||
        error.message === 'Contraseña incorrecta.') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({
      message: 'Error al restablecer código de rol',
      error: error.message
    });
  }
};

module.exports = { login, logout, getMe, verifyRoleCode, resetRoleCode };
