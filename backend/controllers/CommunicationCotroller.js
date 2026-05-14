const{Mensaje,ConsultaIA} = require('../models');

const crearMensaje = async (req,res)=>{
    const {emisor_id,chat_id,contenido,leido} = req.body;
    try{
        const mensaje = await Mensaje.create({
            emisor_id,
            chat_id,
            contenido,
            leido
        });
        res.status(201).json({message: 'Mensaje creado exitosamente', mensaje});
    }catch(error){
        res.status(500).json({message: 'Error al crear el mensaje', error});
    }
}

const ObtenerMensajes = async (req,res)=>{
    try{
const mensajes = await Mensaje.findAll();
res.status(200).json(mensajes); 

    }catch (error){
        res.status(500).json({message: 'Error al obtener los mensajes', error});
    }
}

const eliminarMensaje = async (req,res)=>{
    try{
        const {id_mensaje} = req.params;

        const mensajeEncontrado =await Mensaje.findByPk(id_mensaje);
        if(!mensajeEncontrado){
            return res.status(404).json({message: 'Mensaje no encontrado'});
        }
        await mensajeEncontrado.destroy()
        res.status(200).json({message: 'Mensaje eliminado correctamente'});

    }catch (error){
        res.status(500).json({message: 'Error al eliminar el mensaje', error});
    }
}

const editarMensaje = async (req,res)=>{
    try{
        const {id_mensaje} = req.params;

        const {emisor_id,chat_id,contenido,leido} = req.body;

        const mensajeEncontrado = await Mensaje.findByPk(id_mensaje);

        if(!mensajeEncontrado){
            return res.status(404).json({message: 'Mensaje no encontrado'});
        }

        await mensajeEncontrado.update({emisor_id,chat_id,contenido,leido});

        res.status(200).json(mensajeEncontrado);

    }catch (error){
        res.status(500).json({message: 'Error al editar el mensaje', error});
    }
}

const crearConsultaIA = async (req,res)=>{
    const {user_id,pregunta_usuario,respuesta_ia,modelo} = req.body;
    try{
        const consultaIA = await ConsultaIA.create({
            user_id,
            pregunta_usuario,
            respuesta_ia,
            modelo
        });
        res.status(201).json({message: 'Consulta IA creada exitosamente', consultaIA});
    }catch(error){
        res.status(500).json({message: 'Error al crear la consulta IA', error});
    }
}

const ObtenerConsultasIA = async (req,res)=>{
    try{
const consultasIA = await ConsultaIA.findAll();
res.status(200).json(consultasIA); 

    }catch (error){
        res.status(500).json({message: 'Error al obtener las consultas IA', error});
    }
}

const eliminarConsultaIA = async (req,res)=>{
    try{
        const {id_consultaIA} = req.params;

        const consultaIAEncontrada =await ConsultaIA.findByPk(id_consultaIA);
        if(!consultaIAEncontrada){
            return res.status(404).json({message: 'Consulta IA no encontrada'});
        }
        await consultaIAEncontrada.destroy()
        res.status(200).json({message: 'Consulta IA eliminada correctamente'});

    }catch (error){
        res.status(500).json({message: 'Error al eliminar la consulta IA', error});
    }
}

const editarConsultaIA = async (req,res)=>{
    try{
        const {id_consultaIA} = req.params;

        const {user_id,pregunta_usuario,respuesta_ia,modelo} = req.body;

        const consultaIAEncontrada = await ConsultaIA.findByPk(id_consultaIA);

        if(!consultaIAEncontrada){
            return res.status(404).json({message: 'Consulta IA no encontrada'});
        }

        await consultaIAEncontrada.update({user_id,pregunta_usuario,respuesta_ia,modelo});

        res.status(200).json(consultaIAEncontrada);

    }catch (error){
        res.status(500).json({message: 'Error al editar la consulta IA', error});
    }
}

module.exports = {
    crearMensaje,
    ObtenerMensajes,
    eliminarMensaje,
    editarMensaje,
    crearConsultaIA,
    ObtenerConsultasIA,
    eliminarConsultaIA,
    editarConsultaIA
}   
