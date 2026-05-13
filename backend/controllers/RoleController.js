const {Role}= require('../models');

const crearRole = async (req,res)=>{
    const {nombre} = req.body;
    try{
        const role = await Role.create({
            nombre
        });
        res.status(201).json({message: 'Role creado exitosamente', role});
    }catch(error){
        res.status(500).json({message: 'Error al crear el role', error});
    }
}

const ObtenerRoles = async (req,res)=>{
    try{
const roles = await Role.findAll();
res.status(200).json(roles); 

    }catch (error){
        res.status(500).json({message: 'Error al obtener los roles', error});
    }
}

const eliminarRole = async (req,res)=>{
    try{
        const {id_role} = req.params;

        const roleEncontrado =await Role.findByPk(id_role);
        if(!roleEncontrado){
            return res.status(404).json({message: 'Role no encontrado'});
        }
        await roleEncontrado.destroy()
        res.status(500).json({message: 'Role eliminado correctamente'});

    }catch (error){
        res.status(500).json({message: 'Error al eliminar el role', error});
    }
}

const editarRole = async (req,res)=>{
    try{
        const {id_role} = req.params;

        const {nombre} = req.body;

        const roleEncontrado = await Role.findByPk(id_role);

        if(!roleEncontrado){
            return res.status(404).json({message: 'Role no encontrado'});
        }

        await roleEncontrado.update({nombre});

        res.status(200).json(roleEncontrado);

    }catch (error){
        res.status(500).json({message: 'Error al editar el role', error});
    }
}

module.exports = {
    crearRole,
    ObtenerRoles,
    eliminarRole,
    editarRole
}