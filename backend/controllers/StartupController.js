const StartupService = require('../services/StartupService');
const getStartupId = (params) => params.id || params.id_Startup;

const crearStartup = async (req, res) => {
    try {
        const startup = await StartupService.crearStartup(req.body);
        res.status(201).json({ message: 'Startup creada exitosamente', startup });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la startup', error: error.message });
    }
}

const ObtenerStartups = async (req, res) => {
    try {
        const resultado = await StartupService.obtenerStartups(req.query);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las startups', error: error.message });
    }
}

const eliminarStartup = async (req, res) => {
    try {
        await StartupService.eliminarStartup(getStartupId(req.params));
        res.status(200).json({ message: 'Startup eliminada correctamente' });
    } catch (error) {
        if (error.message === 'Startup no encontrada') {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: 'Error al eliminar la startup', error: error.message });
    }
}

const editarStartup = async (req, res) => {
    try {
        const startupEditada = await StartupService.editarStartup(getStartupId(req.params), req.body);
        res.status(200).json(startupEditada);
    } catch (error) {
        if (error.message === 'Startup no encontrada') {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: 'Error al editar la startup', error: error.message });
    }
}

module.exports = {
    crearStartup,
    ObtenerStartups,
    eliminarStartup,
    editarStartup
}
