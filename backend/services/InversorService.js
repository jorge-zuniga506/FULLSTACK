const { Op } = require('sequelize');
const { Inversor } = require('../models');

class InversorService {
    static async crearInversor(data) {
        return await Inversor.create(data);
    }

    static async obtenerInversores(query = {}) {
        const { page, limit, sortBy = 'id', order = 'DESC', search } = query;

        if (!page && !limit && !search) {
            return await Inversor.findAll();
        }

        const p = parseInt(page, 10) || 1;
        const l = parseInt(limit, 10) || 10;
        const offset = (p - 1) * l;

        const where = {};
        if (search) where[Op.or] = [
            { nombre:           { [Op.like]: `%${search}%` } },
            { sectores_interes: { [Op.like]: `%${search}%` } }
        ];

        const result = await Inversor.findAndCountAll({
            where,
            limit: l,
            offset,
            order: [[sortBy, order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC']]
        });

        return {
            totalItems:  result.count,
            totalPages:  Math.ceil(result.count / l),
            currentPage: p,
            inversores:  result.rows
        };
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
