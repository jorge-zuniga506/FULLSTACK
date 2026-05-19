const { Role } = require('../models');

class RoleService {
    static async crearRole(data) {
        return await Role.create(data);
    }

    static async obtenerRoles() {
        return await Role.findAll();
    }

    static async obtenerRolePorId(id) {
        const role = await Role.findByPk(id);
        if (!role) throw new Error('Role no encontrado');
        return role;
    }

    static async editarRole(id, data) {
        const role = await this.obtenerRolePorId(id);
        return await role.update(data);
    }

    static async eliminarRole(id) {
        const role = await this.obtenerRolePorId(id);
        await role.destroy();
        return true;
    }
}

module.exports = RoleService;
