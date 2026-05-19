const { Inversor } = require('../models');

class InversorService {
    static async crearInversor(data) {
        return await Inversor.create(data);
    }

    static async obtenerInversores() {
        return await Inversor.findAll();
    }

    static async obtenerInversorPorId(id) {
        const inversor = await Inversor.findByPk(id);
        if (!inversor) throw new Error('Inversor no encontrado');
        return inversor;
    }

    static async editarInversor(id, data) {
        const inversor = await this.obtenerInversorPorId(id);
        return await inversor.update(data);
    }

    static async eliminarInversor(id) {
        const inversor = await this.obtenerInversorPorId(id);
        await inversor.destroy();
        return true;
    }
}

module.exports = InversorService;
