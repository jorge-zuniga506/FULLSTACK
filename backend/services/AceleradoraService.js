const { Op } = require('sequelize');
const { Aceleradora } = require('../models');

class AceleradoraService {
    static async crearAceleradora(data) {
        return await Aceleradora.create(data);
    }

    static async obtenerAceleradoras(query = {}) {
        const { page = 1, limit = 10, sortBy = 'id', order = 'DESC', search } = query;
        const offset = (page - 1) * limit;

        const where = {};
        if (search) where[Op.or] = [
            { nombre:           { [Op.like]: `%${search}%` } },
            { programas_activos: { [Op.like]: `%${search}%` } }
        ];

        const aceleradoras = await Aceleradora.findAndCountAll({
            where,
            limit:  parseInt(limit, 10),
            offset: parseInt(offset, 10),
            order: [[sortBy, order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC']]
        });

        return {
            totalItems:   aceleradoras.count,
            totalPages:   Math.ceil(aceleradoras.count / limit),
            currentPage:  parseInt(page, 10),
            aceleradoras: aceleradoras.rows
        };
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
