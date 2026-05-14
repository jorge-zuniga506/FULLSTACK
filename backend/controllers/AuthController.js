const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require('../models');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Por favor ingrese email y contraseña.' });
        }

        // Buscar usuario por email
        const usuario = await User.findOne({ where: { email } });
        if (!usuario) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }

        // Comparar contraseña con el hash almacenado
        const passwordValido = await bcrypt.compare(password, usuario.password_hash);
        if (!passwordValido) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }

        // Obtener el secreto de variables de entorno o usar uno por defecto para desarrollo
        const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_123';

        // Generar JWT
        const token = jwt.sign(
            { id: usuario.id, email: usuario.email, role_id: usuario.role_id },
            JWT_SECRET,
            { expiresIn: '24h' } // El token expira en 24 horas
        );

        // Devolver usuario (sin password) y el token
        const usuarioResponse = usuario.toJSON();
        delete usuarioResponse.password_hash;

        res.status(200).json({
            message: 'Autenticación exitosa',
            token,
            usuario: usuarioResponse
        });

    } catch (error) {
        res.status(500).json({
            message: 'Error en el servidor al intentar iniciar sesión',
            error: error.message
        });
    }
};

const getMe = async (req, res) => {
    try {
        // El usuario ya fue adjuntado al request por el middleware de autenticación
        res.status(200).json({
            message: 'Información del usuario recuperada con éxito',
            usuario: req.user
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener la información del usuario',
            error: error.message
        });
    }
};

module.exports = {
    login,
    getMe
};
