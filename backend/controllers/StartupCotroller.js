const {Startup} = require('../models');

const crearStartup = async (req,res)=>{
    const {user_id,nombre,descripcion,sector,fecha_fundacion,estado} = req.body;
    try{
        const startup = await Startup.create({
            user_id,
            nombre,
            descripcion,
            sector,
            fecha_fundacion,
            estado
        });
        res.status(201).json({message: 'Startup creada exitosamente', startup});
    }catch(error){
        res.status(500).json({message: 'Error al crear la startup', error});
    }
}

const ObtenerStartups = async (req,res)=>{
    try{
const startups = await Startup.findAll();
res.status(200).json(startups); 

    }catch (error){
        res.status(500).json({message: 'Error al obtener las startups', error});
    }
}

const eliminarStartup = async (req,res)=>{
    try{
        const {id_Startup} = req.params;

        const startupEncontrada =await Startup.findByPk(id_Startup);
        if(!startupEncontrada){
            return res.status(404).json({message: 'Startup no encontrada'});
        }
        await startupEncontrada.destroy()
        res.status(500).json({message: 'Startup eliminada correctamente'});

    }catch (error){
        res.status(500).json({message: 'Error al eliminar la startup', error});
    }
}

const editarStartup = async (req,res)=>{
    try{
        const {id_Startup} = req.params;

        const {user_id,nombre,descripcion,sector,fecha_fundacion,estado} = req.body;

        const startupEncontrada = await Startup.findByPk(id_Startup);

        if(!startupEncontrada){
            return res.status(404).json({message: 'Startup no encontrada'});
        }

        await startupEncontrada.update({user_id,nombre,descripcion,sector,fecha_fundacion,estado});

        res.status(200).json(startupEncontrada);

    }catch (error){
        res.status(500).json({message: 'Error al editar la startup', error});
    }
}

module.exports = {
    crearStartup,
    ObtenerStartups,
    eliminarStartup,
    editarStartup
}
    