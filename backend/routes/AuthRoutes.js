const express = require('express');
const router = express.Router();
const { login, logout, getMe } = require('../controllers/AuthController');
const { authRequired } = require('../middlewares/authMiddleware');

// Endpoint POST /auth/login
router.post('/login', login);

// Endpoint POST /auth/logout (protegido por middleware de autenticación)
router.post('/logout', authRequired, logout);

// Endpoint GET /auth/me (protegido por middleware de autenticación)
router.get('/me', authRequired, getMe);

module.exports = router;
