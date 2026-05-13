// Instalaciones e importaciones necesarias
const { User } = require('../models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')



//INSERT
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
    
    //SELECT 
 const ObtenerUsuarios = async (req,res)=>{
    try{
const usuarios = await User.findAll();
res.status(200).json(usuarios); 

    }catch (error){
        res.status(500).json({message: 'Error al obtener los usuarios', error});
    }
}

//DELETE
const eliminarUsuarios = async (req,res)=>{
    try{
        const {id_Usuario} = req.params;

        const usuarioEncontrado =await User.findByPk(id_Usuario);
        if(!usuarioEncontrado){
            return res.status(404).json({message: 'Usuario no encontrado'});
        }
        await usuarioEncontrado.destroy()
        res.status(500).json({message: 'Usuario eliminado correctamente'});

    }catch (error){
        res.status(500).json({message: 'Error al eliminar el usuario', error});
    }
}
//UPDATE
const editarUsuarios = async (req,res)=>{
    try{
        const {id_Usuario} = req.params;

        const {cedula,nombre_hacienda,email,password_hash,role_id} = req.body;

        const usuarioEncontrado = await User.findByPk(id_Usuario);

        if(!usuarioEncontrado){
            return res.status(404).json({message: 'Usuario no encontrado'});
        }

        await usuarioEncontrado.update({cedula,nombre_hacienda,email,password_hash,role_id});

        res.status(200).json(usuarioEncontrado);

    }catch (error){
        res.status(500).json({message: 'Error al editar el usuario', error});
    }
}
    

}
module.exports = {
    crearUsuario,
    ObtenerUsuarios,
    eliminarUsuarios,
    editarUsuarios
}