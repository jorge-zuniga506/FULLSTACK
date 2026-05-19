const { Sector } = require('../models');

class SectorService {
    static async crearSector(data) {
        return await Sector.create(data);
    }

    static async obtenerSectores() {
        return await Sector.findAll();
    }

    static async obtenerSectorPorId(id) {
        const sector = await Sector.findByPk(id);
        if (!sector) throw new Error('Sector no encontrado');
        return sector;
    }

    static async editarSector(id, data) {
        const sector = await this.obtenerSectorPorId(id);
        return await sector.update(data);
    }

    static async eliminarSector(id) {
        const sector = await this.obtenerSectorPorId(id);
        await sector.destroy();
        return true;
    }
}

module.exports = SectorService;
