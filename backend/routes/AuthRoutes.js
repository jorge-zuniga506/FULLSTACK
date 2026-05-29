/**
 * routes/AuthRoutes.js — Rutas de autenticación
 *
 * Prefijo: /api/auth (montado en app.js)
 *
 * Rutas públicas:
 *   POST /api/auth/login  → { email, password } → JWT + datos del usuario
 *
 * Rutas protegidas (requieren authRequired):
 *   POST /api/auth/logout → invalida la sesión activa en BD
 *   GET  /api/auth/me     → retorna los datos del usuario autenticado
 */
const express  = require('express');
const router   = express.Router();
const { login, logout, getMe, verifyRoleCode, resetRoleCode, resendRoleCode, googleLogin, changeRole } = require('../controllers/AuthController');
const { authRequired }         = require('../middlewares/authMiddleware');

// Pública: genera JWT si las credenciales son correctas
router.post('/login', login);

// Pública: autenticación mediante Google OAuth
router.post('/google', googleLogin);

// Protegida: verifica código 2FA
router.post('/verify-role-code', authRequired, verifyRoleCode);

// Protegida: regenera y envía código 2FA por correo
router.post('/reset-role-code', authRequired, resetRoleCode);

// Protegida: reenvía código 2FA al correo del usuario autenticado
router.post('/resend-role-code', authRequired, resendRoleCode);

// Protegida: cambia el rol de un usuario en caliente
router.post('/change-role', authRequired, changeRole);

// Protegida: invalida la sesión activa (logout)
router.post('/logout', authRequired, logout);

// Protegida: retorna datos del usuario autenticado
router.get('/me', authRequired, getMe);

module.exports = router;
