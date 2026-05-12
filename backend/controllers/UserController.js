// Instalaciones e importaciones necesarias
const { User } = require('../models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


//Método de crear usuario
const crearUsuario = async (req, res) => {
    const { cedula, nombre_hacienda, email, password_hash, role_id } = req.body
    const clave_encriptada = await bcrypt.hash(password_hash, 10)

    try {
        const usuario = await User.create({
            cedula,
            nombre_hacienda,
            email,
            password_hash: clave_encriptada,
            role_id
        })
        res.status(201).json({
            message: 'Usuario creado exitosamente',
            usuario
        })
    } catch (error) {
        res.status(500).json({
            message: 'Error al crear el usuario',
            error: error.message
        })
    }

}
module.exports = {
    crearUsuario
}