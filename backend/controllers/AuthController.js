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

const buildCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: 24 * 60 * 60 * 1000
});

/**
 * Maneja el inicio de sesión — genera JWT y crea sesión en BD
 */
const login = async (req, res) => {
  try {
    const { email, password, otp_channel, whatsapp_phone, whatsapp_api_key } = req.body;
    const authData = await AuthService.login(email, password, {
      deliveryChannel: otp_channel,
      whatsappPhone: whatsapp_phone,
      whatsappApiKey: whatsapp_api_key
    });

    res.cookie('access_token', authData.token, buildCookieOptions());

    res.status(200).json({
      message: 'Autenticación exitosa',
      token:   authData.token,
      usuario: authData.usuario,
      redirectPath: authData.redirectPath,
      requiresExtraVerification: authData.requiresExtraVerification,
      twoFactorDelivery: authData.twoFactorDelivery,
      twoFactorDestination: authData.twoFactorDestination,
      twoFactorExpiresAt: authData.twoFactorExpiresAt
    });
  } catch (error) {
    // Distingue entre errores de validación (400) y credenciales inválidas (401)
    if (error.message === 'Por favor ingrese email y contraseña.') {
      return res.status(400).json({ message: error.message });
    }
    if (error.message && error.message.toLowerCase().includes('credenciales')) {
      return res.status(401).json({ message: error.message });
    }
    if (error.message && (
      error.message.toLowerCase().includes('codigo') ||
      error.message.toLowerCase().includes('whatsapp') ||
      error.message.toLowerCase().includes('callmebot') ||
      error.message.toLowerCase().includes('textmebot') ||
      error.message.toLowerCase().includes('api key') ||
      error.message.toLowerCase().includes('numero')
    )) {
      return res.status(400).json({ message: error.message });
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
    const bearerToken = authHeader && authHeader.split(' ')[1];
    const cookieHeader = req.headers.cookie || '';
    const cookieToken = cookieHeader.split(';').map(p => p.trim()).find(p => p.startsWith('access_token='));
    const token = bearerToken || (cookieToken ? decodeURIComponent(cookieToken.split('=')[1] || '') : null);

    await AuthService.logout(token);
    res.clearCookie('access_token', { path: '/', sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
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
    const userId = req.user.id;
    const { otp_channel, whatsapp_phone, whatsapp_api_key } = req.body || {};

    const codeDispatch = await AuthService.resetRoleCode(userId, {
      deliveryChannel: otp_channel,
      whatsappPhone: whatsapp_phone,
      whatsappApiKey: whatsapp_api_key
    });

    res.status(200).json({
      message: 'Codigo de verificacion enviado correctamente.',
      twoFactorDelivery: codeDispatch.delivery,
      twoFactorDestination: codeDispatch.destinationMasked,
      twoFactorExpiresAt: codeDispatch.expiresAt
    });
  } catch (error) {
    if (error.message && (
      error.message.toLowerCase().includes('usuario no encontrado') ||
      error.message.toLowerCase().includes('codigo') ||
      error.message.toLowerCase().includes('whatsapp') ||
      error.message.toLowerCase().includes('callmebot') ||
      error.message.toLowerCase().includes('textmebot') ||
      error.message.toLowerCase().includes('api key') ||
      error.message.toLowerCase().includes('numero')
    )) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({
      message: 'Error al restablecer codigo de rol',
      error: error.message
    });
  }
};

const resendRoleCode = resetRoleCode;

const googleLogin = async (req, res) => {
  try {
    const { token, role_id } = req.body;
    const authData = await AuthService.loginWithGoogle(token, role_id);

    // Si requiere selección de rol (es un usuario nuevo y no se especificó rol)
    if (authData.requiresRoleSelection) {
      return res.status(200).json({
        requiresRoleSelection: true,
        googleToken: authData.googleToken,
        email: authData.email,
        name: authData.name,
        picture: authData.picture
      });
    }

    res.cookie('access_token', authData.token, buildCookieOptions());

    res.status(200).json({
      requiresRoleSelection: false,
      message: 'Autenticación exitosa con Google',
      token:   authData.token,
      usuario: authData.usuario,
      redirectPath: authData.redirectPath,
      requiresExtraVerification: false // Bypasseamos 2FA para Google
    });
  } catch (error) {
    if (error.message === 'Token de Google es requerido.') {
      return res.status(400).json({ message: error.message });
    }
    if (error.message && error.message.toLowerCase().includes('rol invalido')) {
      return res.status(400).json({ message: error.message });
    }
    if (error.message && error.message.includes('Token de Google')) {
      return res.status(401).json({ message: error.message });
    }
    res.status(500).json({
      message: 'Error al iniciar sesión con Google',
      error:   error.message
    });
  }
};

const changeRole = async (req, res) => {
  try {
    const { role_id } = req.body;
    const userId = req.user.id;

    const result = await AuthService.changeUserRole(userId, role_id);

    // Regeneramos el JWT con el nuevo rol para que su sesión tenga los permisos correctos
    const jwt = require('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_123';
    const jwtToken = jwt.sign(
      { id: result.usuario.id, email: result.usuario.email, role_id: result.usuario.role_id },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Actualizamos la cookie
    res.cookie('access_token', jwtToken, buildCookieOptions());

    res.status(200).json({
      message: 'Rol actualizado exitosamente',
      token: jwtToken,
      usuario: result.usuario,
      redirectPath: result.redirectPath
    });
  } catch (error) {
    if (error.message && error.message.toLowerCase().includes('rol invalido')) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({
      message: 'Error al cambiar de rol',
      error: error.message
    });
  }
};

module.exports = { login, logout, getMe, verifyRoleCode, resetRoleCode, resendRoleCode, googleLogin, changeRole };


