const RoleService = require('../services/RoleService');

const crearRole = async (req, res) => {
    try {
        const role = await RoleService.crearRole(req.body);
        res.status(201).json({ message: 'Role creado exitosamente', role });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el role', error: error.message });
    }
}

const ObtenerRoles = async (req, res) => {
    try {
        const roles = await RoleService.obtenerRoles();
        res.status(200).json(roles);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los roles', error: error.message });
    }
}

const eliminarRole = async (req, res) => {
    try {
        await RoleService.eliminarRole(req.params.id_role);
        res.status(200).json({ message: 'Role eliminado correctamente' });
    } catch (error) {
        if (error.message === 'Role no encontrado') {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: 'Error al eliminar el role', error: error.message });
    }
}

const editarRole = async (req, res) => {
    try {
        const roleEditado = await RoleService.editarRole(req.params.id_role, req.body);
        res.status(200).json(roleEditado);
    } catch (error) {
        if (error.message === 'Role no encontrado') {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: 'Error al editar el role', error: error.message });
    }
}

module.exports = {
    crearRole,
    ObtenerRoles,
    eliminarRole,
    editarRole
}
