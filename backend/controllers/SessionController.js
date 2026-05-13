const {Session} = require('../models');
const crearSession = async (req,res)=>{
    const {user_id,tocken_jwt,expiracion,es_valido} = req.body;
    try{
        const session = await Session.create({
            user_id,
            tocken_jwt,
            expiracion,
            es_valido
        });
        res.status(201).json({message: 'Session creada exitosamente', session});
    }catch(error){
        res.status(500).json({message: 'Error al crear la session', error});
    }
}

const ObtenerSessions = async (req,res)=>{
    try{
const sessions = await Session.findAll();
res.status(200).json(sessions); 

    }catch (error){
        res.status(500).json({message: 'Error al obtener las sessions', error});
    }
}

const eliminarSession = async (req,res)=>{
    try{
        const {id_session} = req.params;

        const sessionEncontrada =await Session.findByPk(id_session);
        if(!sessionEncontrada){
            return res.status(404).json({message: 'Session no encontrada'});
        }
        await sessionEncontrada.destroy()
        res.status(500).json({message: 'Session eliminada correctamente'});

    }catch (error){
        res.status(500).json({message: 'Error al eliminar la session', error});
    }
}

const editarSession = async (req,res)=>{
    try{
        const {id_session} = req.params;

        const {user_id,tocken_jwt,expiracion,es_valido} = req.body;

        const sessionEncontrada = await Session.findByPk(id_session);

        if(!sessionEncontrada){
            return res.status(404).json({message: 'Session no encontrada'});
        }

        await sessionEncontrada.update({user_id,tocken_jwt,expiracion,es_valido});

        res.status(200).json(sessionEncontrada);

    }catch (error){
        res.status(500).json({message: 'Error al editar la session', error});
    }
}

module.exports = {
    crearSession,
    ObtenerSessions,
    eliminarSession,
    editarSession
}
    