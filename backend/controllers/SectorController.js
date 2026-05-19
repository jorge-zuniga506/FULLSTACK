const SectorService = require('../services/SectorService');
const getSectorId = (params) => params.id || params.id_sector;

const crearSector = async (req, res) => {
    try {
        const sector = await SectorService.crearSector(req.body);
        res.status(201).json({ message: 'Sector creado exitosamente', sector });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el sector', error: error.message });
    }
}

const ObtenerSectores = async (req, res) => {
    try {
        const sectores = await SectorService.obtenerSectores();
        res.status(200).json(sectores);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los sectores', error: error.message });
    }
}

const eliminarSector = async (req, res) => {
    try {
        await SectorService.eliminarSector(getSectorId(req.params));
        res.status(200).json({ message: 'Sector eliminado correctamente' });
    } catch (error) {
        if (error.message === 'Sector no encontrado') {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: 'Error al eliminar el sector', error: error.message });
    }
}

const editarSector = async (req, res) => {
    try {
        const sectorEditado = await SectorService.editarSector(getSectorId(req.params), req.body);
        res.status(200).json(sectorEditado);
    } catch (error) {
        if (error.message === 'Sector no encontrado') {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: 'Error al editar el sector', error: error.message });
    }
}

module.exports = {
    crearSector,
    ObtenerSectores,
    eliminarSector,
    editarSector
}
