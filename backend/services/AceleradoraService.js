const { Aceleradora } = require('../models');

class AceleradoraService {
    static async crearAceleradora(data) {
        return await Aceleradora.create(data);
    }

    static async obtenerAceleradoras() {
        return await Aceleradora.findAll();
    }

    static async obtenerAceleradoraPorId(id) {
        const aceleradora = await Aceleradora.findByPk(id);
        if (!aceleradora) throw new Error('Aceleradora no encontrada');
        return aceleradora;
    }

    static async editarAceleradora(id, data) {
        const aceleradora = await this.obtenerAceleradoraPorId(id);
        return await aceleradora.update(data);
    }

    static async eliminarAceleradora(id) {
        const aceleradora = await this.obtenerAceleradoraPorId(id);
        await aceleradora.destroy();
        return true;
    }
}

module.exports = AceleradoraService;
