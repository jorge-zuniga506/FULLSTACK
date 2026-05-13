const express = require('express');
const router = express.Router();
const { login, logout } = require('../controllers/AuthController');
const { authenticateToken } = require('../middlewares/authMiddleware');

// Endpoint POST /auth/login
router.post('/login', login);

// Endpoint POST /auth/logout (protegido por middleware de autenticación)
router.post('/logout', authenticateToken, logout);

module.exports = router;
