const jwt = require('jsonwebtoken');
const { Session } = require('../models');

// Middleware para verificar JWT y validar sesión
const authRequired = async (req, res, next) => {
    try {
        // Extraer token del header Authorization (formato: Bearer <token>)
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Obtener token después de 'Bearer '

        if (!token) {
            return res.status(401).json({ message: 'Token de acceso requerido.' });
        }

        // Verificar el JWT
        const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_123';
        const decoded = jwt.verify(token, JWT_SECRET);

        // Buscar la sesión en la base de datos
        const session = await Session.findOne({
            where: {
                token_jwt: token,
                es_valido: true
            }
        });

        if (!session) {
            return res.status(401).json({ message: 'Sesión inválida o token revocado.' });
        }

        // Verificar si la sesión ha expirado
        const now = new Date();
        if (session.expiracion < now) {
            return res.status(401).json({ message: 'Token expirado.' });
        }

        // Adjuntar información del usuario a la request
        req.user = decoded;
        next(); // Continuar con la siguiente función middleware o ruta

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Token inválido.' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expirado.' });
        }
        res.status(500).json({ message: 'Error en la autenticación.', error: error.message });
    }
};

module.exports = { authRequired };
