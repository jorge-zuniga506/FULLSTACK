const jwt = require('jsonwebtoken');
const { User, Session } = require('../models');

// Middleware para verificar JWT y validar sesión
const authMiddleware = async (req, res, next) => {
    try {
        // 1. Obtener el token del encabezado Authorization
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                message: 'No se proporcionó un token de autenticación o el formato es inválido.' 
            });
        }

        const token = authHeader.split(' ')[1];

        // 2. Verificar el token
        const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_123';
        const decoded = jwt.verify(token, JWT_SECRET);

        // 3. Buscar y validar la sesión en la base de datos
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

        // 4. Buscar el usuario en la base de datos
        const user = await User.findByPk(decoded.id, {
            attributes: { exclude: ['password_hash'] } // No devolver el hash de la contraseña
        });

        if (!user) {
            return res.status(401).json({ message: 'Usuario no encontrado o token inválido.' });
        }

        // 5. Adjuntar el usuario al objeto request
        req.user = user;
        next();

    } catch (error) {
        let message = 'Token inválido o expirado.';
        if (error.name === 'TokenExpiredError') {
            message = 'El token ha expirado. Por favor, inicie sesión de nuevo.';
        } else if (error.name === 'JsonWebTokenError') {
            message = 'Token inválido.';
        }

        return res.status(401).json({ 
            message,
            error: error.message 
        });
    }
};

module.exports = authMiddleware;
