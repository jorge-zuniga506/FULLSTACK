const CommunicationService = require('../services/CommunicationService');

const crearMensaje = async (req, res) => {
    try {
        const mensaje = await CommunicationService.crearMensaje(req.body);
        res.status(201).json({ message: 'Mensaje creado exitosamente', mensaje });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el mensaje', error: error.message });
    }
}

const ObtenerMensajes = async (req, res) => {
    try {
        const resultado = await CommunicationService.obtenerMensajes(req.query);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los mensajes', error: error.message });
    }
}

const listarChats = async (req, res) => {
    try {
        const chats = await CommunicationService.listarChats();
        res.status(200).json(chats);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los chats', error: error.message });
    }
}

const crearMensajeContactoPublico = async (req, res) => {
    try {
        const mensaje = await CommunicationService.crearMensajeContactoPublico(req.body);
        res.status(201).json({ message: 'Mensaje de contacto público creado exitosamente', mensaje });
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'Datos de contacto inválidos.', error: error.message });
        }
        res.status(500).json({ message: 'Error al crear el mensaje de contacto público', error: error.message });
    }
}

const listarMensajesContactoPublico = async (req, res) => {
    try {
        const resultado = await CommunicationService.obtenerMensajesContactoPublico(req.query);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los mensajes de contacto público', error: error.message });
    }
}

const crearChat = async (req, res) => {
    try {
        const chat = await CommunicationService.crearChat();
        res.status(201).json({ message: 'Chat creado exitosamente', chat });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el chat', error: error.message });
    }
}

const obtenerMensajesPorChat = async (req, res) => {
    try {
        const chat_id = Number(req.params.chat_id);
        const mensajes = await CommunicationService.obtenerMensajesPorChat(chat_id);
        res.status(200).json(mensajes);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener mensajes del chat', error: error.message });
    }
}

const enviarMensajeAlChat = async (req, res) => {
    try {
        const chat_id = Number(req.params.chat_id);
        const mensaje = await CommunicationService.enviarMensajeEnChat(chat_id, req.body);
        res.status(201).json({ message: 'Mensaje enviado al chat exitosamente', mensaje });
    } catch (error) {
        res.status(500).json({ message: 'Error al enviar mensaje al chat', error: error.message });
    }
}

const eliminarMensaje = async (req, res) => {
    try {
        await CommunicationService.eliminarMensaje(req.params.id_mensaje);
        res.status(200).json({ message: 'Mensaje eliminado correctamente' });
    } catch (error) {
        if (error.message === 'Mensaje no encontrado') {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: 'Error al eliminar el mensaje', error: error.message });
    }
}

const editarMensaje = async (req, res) => {
    try {
        const mensajeEditado = await CommunicationService.editarMensaje(req.params.id_mensaje, req.body);
        res.status(200).json(mensajeEditado);
    } catch (error) {
        if (error.message === 'Mensaje no encontrado') {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: 'Error al editar el mensaje', error: error.message });
    }
}

const marcarMensajeComoLeido = async (req, res) => {
    try {
        const mensaje = await CommunicationService.marcarMensajeComoLeido(req.params.id_mensaje);
        res.status(200).json({ message: 'Mensaje marcado como leído', mensaje });
    } catch (error) {
        if (error.message === 'Mensaje no encontrado') {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: 'Error al marcar el mensaje como leído', error: error.message });
    }
}

const marcarMensajesChatComoLeidos = async (req, res) => {
    try {
        const { chat_id } = req.body;
        if (!chat_id) {
            return res.status(400).json({ message: 'chat_id es requerido' });
        }
        const resultado = await CommunicationService.marcarMensajesChatComoLeidos(chat_id);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(500).json({ message: 'Error al marcar mensajes del chat como leídos', error: error.message });
    }
}

const crearConsultaIA = async (req, res) => {
    try {
        const consultaIA = await CommunicationService.crearConsultaIA(req.body);
        res.status(201).json({ message: 'Consulta IA creada exitosamente', consultaIA });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la consulta IA', error: error.message });
    }
}

const ObtenerConsultasIA = async (req, res) => {
    try {
        const resultado = await CommunicationService.obtenerConsultasIA(req.query);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las consultas IA', error: error.message });
    }
}

const eliminarConsultaIA = async (req, res) => {
    try {
        await CommunicationService.eliminarConsultaIA(req.params.id_consultaIA);
        res.status(200).json({ message: 'Consulta IA eliminada correctamente' });
    } catch (error) {
        if (error.message === 'Consulta IA no encontrada') {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: 'Error al eliminar la consulta IA', error: error.message });
    }
}

const editarConsultaIA = async (req, res) => {
    try {
        const consultaIAEditada = await CommunicationService.editarConsultaIA(req.params.id_consultaIA, req.body);
        res.status(200).json(consultaIAEditada);
    } catch (error) {
        if (error.message === 'Consulta IA no encontrada') {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: 'Error al editar la consulta IA', error: error.message });
    }
}

module.exports = {
    crearMensaje,
    ObtenerMensajes,
    crearMensajeContactoPublico,
    listarMensajesContactoPublico,
    listarChats,
    crearChat,
    obtenerMensajesPorChat,
    enviarMensajeAlChat,
    eliminarMensaje,
    editarMensaje,
    marcarMensajeComoLeido,
    marcarMensajesChatComoLeidos,
    crearConsultaIA,
    ObtenerConsultasIA,
    eliminarConsultaIA,
    editarConsultaIA
}
