const { User } = require('../models');
const bcrypt = require('bcrypt');

// INSERT
 const crearUsuario = async (req, res) => {
    try {
        const { cedula, nombre_hacienda, email, password_hash, role_id } = req.body;
        const clave_encriptada = await bcrypt.hash(password_hash, 10);

        const usuario = await User.create({
            cedula,
            nombre_hacienda,
            email,
            password_hash: clave_encriptada,
            role_id
        });

        // Removemos el password del objeto devuelto por seguridad
        const usuarioResponse = usuario.toJSON();
        delete usuarioResponse.password_hash;

        res.status(201).json({
            message: 'Usuario creado exitosamente',
            usuario: usuarioResponse
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al crear el usuario',
            error: error.message
        });
    }
};

// SELECT 
const obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await User.findAll({
            attributes: { exclude: ['password_hash'] } // No devolvemos hashes
        });
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los usuarios', error: error.message });
    }
};

// DELETE
const eliminarUsuario = async (req, res) => {
    try {
        const { id_Usuario } = req.params;

        const usuarioEncontrado = await User.findByPk(id_Usuario);
        if (!usuarioEncontrado) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        await usuarioEncontrado.destroy();

        res.status(200).json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el usuario', error: error.message });
    }
};

// UPDATE
const actualizarUsuario = async (req, res) => {
    try {
        const { id_Usuario } = req.params;
        const { cedula, nombre_hacienda, email, password_hash, role_id } = req.body;

        if (role_id !== undefined) {
            return res.status(403).json({ message: 'No se permite cambiar el rol del usuario desde este endpoint.' });
        }

        const usuarioEncontrado = await User.findByPk(id_Usuario);

        if (!usuarioEncontrado) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        let updateData = { cedula, nombre_hacienda, email };
        if (password_hash) {
            updateData.password_hash = await bcrypt.hash(password_hash, 10);
        }

        await usuarioEncontrado.update(updateData);

        const usuarioResponse = usuarioEncontrado.toJSON();
        delete usuarioResponse.password_hash;

        res.status(200).json(usuarioResponse);

    } catch (error) {
        res.status(500).json({ message: 'Error al editar el usuario', error: error.message });
    }
};

module.exports = {
    crearUsuario,
    obtenerUsuarios,
    eliminarUsuario,
    actualizarUsuario
};
