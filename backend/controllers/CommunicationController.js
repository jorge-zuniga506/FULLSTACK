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
        const mensajes = await CommunicationService.obtenerMensajes();
        res.status(200).json(mensajes);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los mensajes', error: error.message });
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
        const consultasIA = await CommunicationService.obtenerConsultasIA();
        res.status(200).json(consultasIA);
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
    eliminarMensaje,
    editarMensaje,
    crearConsultaIA,
    ObtenerConsultasIA,
    eliminarConsultaIA,
    editarConsultaIA
}
