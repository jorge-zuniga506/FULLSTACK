const SessionService = require('../services/SessionService');
const getSessionId = (params) => params.id || params.id_session;

const crearSession = async (req, res) => {
    try {
        const session = await SessionService.crearSession(req.body);
        res.status(201).json({ message: 'Session creada exitosamente', session });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la session', error: error.message });
    }
}

const ObtenerSessions = async (req, res) => {
    try {
        const sessions = await SessionService.obtenerSessions();
        res.status(200).json(sessions);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las sessions', error: error.message });
    }
}

const eliminarSession = async (req, res) => {
    try {
        await SessionService.eliminarSession(getSessionId(req.params));
        res.status(200).json({ message: 'Session eliminada correctamente' });
    } catch (error) {
        if (error.message === 'Session no encontrada') {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: 'Error al eliminar la session', error: error.message });
    }
}

const editarSession = async (req, res) => {
    try {
        const sessionEditada = await SessionService.editarSession(getSessionId(req.params), req.body);
        res.status(200).json(sessionEditada);
    } catch (error) {
        if (error.message === 'Session no encontrada') {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: 'Error al editar la session', error: error.message });
    }
}

module.exports = {
    crearSession,
    ObtenerSessions,
    eliminarSession,
    editarSession
}
