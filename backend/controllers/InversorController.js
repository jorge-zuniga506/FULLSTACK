const { Inversor } = require('../models');

const crearInversor = async (req,res)=>{
    const {user_id,nombre,presupuesto_min,presupuesto_max,sectores_interes} = req.body;
    try{
        const inversor = await Inversor.create({
            user_id,
            nombre,
            presupuesto_min,
            presupuesto_max,
            sectores_interes
        });
        res.status(201).json({message: 'Inversor creado exitosamente', inversor});
    }catch(error){
        res.status(500).json({message: 'Error al crear el inversor', error});
    }
}

const ObtenerInversores = async (req,res)=>{
    try{
const inversores = await Inversor.findAll();
res.status(200).json(inversores); 

    }catch (error){
        res.status(500).json({message: 'Error al obtener los inversores', error});
    }
}

const eliminarInversor = async (req,res)=>{
    try{
        const {id_inversor} = req.params;

        const inversorEncontrado =await Inversor.findByPk(id_inversor);
        if(!inversorEncontrado){
            return res.status(404).json({message: 'Inversor no encontrado'});
        }
        await inversorEncontrado.destroy()
        res.status(500).json({message: 'Inversor eliminado correctamente'});

    }catch (error){
        res.status(500).json({message: 'Error al eliminar el inversor', error});
    }
}

const editarInversor = async (req,res)=>{
    try{
        const {id_inversor} = req.params;

        const {user_id,nombre,presupuesto_min,presupuesto_max,sectores_interes} = req.body;

        const inversorEncontrado = await Inversor.findByPk(id_inversor);

        if(!inversorEncontrado){
            return res.status(404).json({message: 'Inversor no encontrado'});
        }

        await inversorEncontrado.update({user_id,nombre,presupuesto_min,presupuesto_max,sectores_interes});

        res.status(200).json(inversorEncontrado);

    }catch (error){
        res.status(500).json({message: 'Error al editar el inversor', error});
    }
}

module.exports = {
    crearInversor,
    ObtenerInversores,
    eliminarInversor,
    editarInversor
}   