const express = require('express');
const router = express.Router();
const { login, getMe } = require('../controllers/AuthController');
const authMiddleware = require('../middlewares/authMiddleware');

// Endpoint POST /auth/login
router.post('/login', login);

// Endpoint GET /auth/me - Protegido
router.get('/me', authMiddleware, getMe);

module.exports = router;
