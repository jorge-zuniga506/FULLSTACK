const { Aceleradora } = require('../models');

const crearAceleradora = async (req,res)=>{
    const {user_id,nombre_aceleradora,sector_id,metas_anuales,descripcion,es_verified} = req.body;
    try{
        const aceleradora = await Aceleradora.create({
            user_id,
            nombre,
            programa_activo,
            sitio_web
            
        });
        res.status(201).json({message: 'Aceleradora creada exitosamente', aceleradora});
    }catch(error){
        res.status(500).json({message: 'Error al crear la aceleradora', error});
    }
}

const ObtenerAceleradoras = async (req,res)=>{
    try{
const aceleradoras = await Aceleradora.findAll();
res.status(200).json(aceleradoras); 

    }catch (error){
        res.status(500).json({message: 'Error al obtener las aceleradoras', error});
    }
}

const eliminarAceleradora = async (req,res)=>{
    try{
        const {id_aceleradora} = req.params;

        const aceleradoraEncontrada =await Aceleradora.findByPk(id_aceleradora);
        if(!aceleradoraEncontrada){
            return res.status(404).json({message: 'Aceleradora no encontrada'});
        }
        await aceleradoraEncontrada.destroy()
        res.status(500).json({message: 'Aceleradora eliminada correctamente'});

    }catch (error){
        res.status(500).json({message: 'Error al eliminar la aceleradora', error});
    }
}

const editarAceleradora = async (req,res)=>{
    try{
        const {id_aceleradora} = req.params;

        const {user_id,nombre,programa_activo,sitio_web} = req.body;

        const aceleradoraEncontrada = await Aceleradora.findByPk(id_aceleradora);

        if(!aceleradoraEncontrada){
            return res.status(404).json({message: 'Aceleradora no encontrada'});
        }

        await aceleradoraEncontrada.update({user_id,nombre,programa_activo,sitio_web});

        res.status(200).json(aceleradoraEncontrada);

    }catch (error){
        res.status(500).json({message: 'Error al editar la aceleradora', error});
    }
}

module.exports = {
    crearAceleradora,
    ObtenerAceleradoras,
    eliminarAceleradora, 
    editarAceleradora
}   
