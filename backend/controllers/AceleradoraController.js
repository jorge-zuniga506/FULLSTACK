const AceleradoraService = require('../services/AceleradoraService');

const crearAceleradora = async (req, res) => {
    try {
        const aceleradora = await AceleradoraService.crearAceleradora(req.body);
        res.status(201).json({ message: 'Aceleradora creada exitosamente', aceleradora });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la aceleradora', error: error.message });
    }
}

const ObtenerAceleradoras = async (req, res) => {
    try {
        const aceleradoras = await AceleradoraService.obtenerAceleradoras();
        res.status(200).json(aceleradoras);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las aceleradoras', error: error.message });
    }
}

const eliminarAceleradora = async (req, res) => {
    try {
        await AceleradoraService.eliminarAceleradora(req.params.id_aceleradora);
        res.status(200).json({ message: 'Aceleradora eliminada correctamente' });
    } catch (error) {
        if (error.message === 'Aceleradora no encontrada') {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: 'Error al eliminar la aceleradora', error: error.message });
    }
}

const editarAceleradora = async (req, res) => {
    try {
        const aceleradoraEditada = await AceleradoraService.editarAceleradora(req.params.id_aceleradora, req.body);
        res.status(200).json(aceleradoraEditada);
    } catch (error) {
        if (error.message === 'Aceleradora no encontrada') {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: 'Error al editar la aceleradora', error: error.message });
    }
}

module.exports = {
    crearAceleradora,
    ObtenerAceleradoras,
    eliminarAceleradora,
    editarAceleradora
}
