const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User, Session } = require('../models');

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
            { expiresIn: '2h' } // El token expira en 2 horas
        );

        // Calcular fecha de expiración para la sesión (2 horas desde ahora)
        const expiracion = new Date(Date.now() + 2 * 60 * 60 * 1000);

        // Crear sesión en la base de datos para rastrear el token
        try {
            await Session.create({
                user_id: usuario.id,
                token_jwt: token,
                expiracion: expiracion,
                es_valido: true
            });
        } catch (sessionError) {
            console.error('Error al crear sesión:', sessionError);
            return res.status(500).json({ message: 'Error al crear sesión de autenticación.' });
        }
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

const logout = async (req, res) => {
    try {
        // Extraer token del header Authorization
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(400).json({ message: 'Token requerido para logout.' });
        }

        // Buscar y invalidar la sesión en la base de datos
        const session = await Session.findOne({
            where: {
                token_jwt: token,
                es_valido: true
            }
        });

        if (!session) {
            return res.status(400).json({ message: 'Sesión no encontrada o ya inválida.' });
        }

        // Marcar la sesión como inválida
        await session.update({ es_valido: false });

        res.status(200).json({ message: 'Logout exitoso. Token invalidado.' });

    } catch (error) {
        res.status(500).json({
            message: 'Error en el servidor al intentar cerrar sesión',
            error: error.message
        });
    }
};

const getMe = async (req, res) => {
    try {
        // req.user viene del middleware authRequired
        const usuario = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password_hash'] }
        });

        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        res.status(200).json({
            message: 'Datos del usuario obtenidos exitosamente',
            user: usuario
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener datos del usuario', error: error.message });
    }
};

module.exports = {
    login,
    logout,
    getMe
};
