const InversorService = require('../services/InversorService');

const crearInversor = async (req, res) => {
    try {
        const inversor = await InversorService.crearInversor(req.body);
        res.status(201).json({ message: 'Inversor creado exitosamente', inversor });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el inversor', error: error.message });
    }
}

const ObtenerInversores = async (req, res) => {
    try {
        const inversores = await InversorService.obtenerInversores();
        res.status(200).json(inversores);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los inversores', error: error.message });
    }
}

const eliminarInversor = async (req, res) => {
    try {
        await InversorService.eliminarInversor(req.params.id_inversor);
        res.status(200).json({ message: 'Inversor eliminado correctamente' });
    } catch (error) {
        if (error.message === 'Inversor no encontrado') {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: 'Error al eliminar el inversor', error: error.message });
    }
}

const editarInversor = async (req, res) => {
    try {
        const inversorEditado = await InversorService.editarInversor(req.params.id_inversor, req.body);
        res.status(200).json(inversorEditado);
    } catch (error) {
        if (error.message === 'Inversor no encontrado') {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: 'Error al editar el inversor', error: error.message });
    }
}

module.exports = {
    crearInversor,
    ObtenerInversores,
    eliminarInversor,
    editarInversor
}
