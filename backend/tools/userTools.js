const { User } = require('../models');
const { Op } = require('sequelize');

module.exports = {

  async buscar_usuarios({ nombre, cedula }) {
    return await User.findAll({
      where: {
        [Op.or]: [
          nombre ? { nombre_hacienda: { [Op.like]: `%${nombre}%` } } : null,
          cedula ? { cedula } : null
        ].filter(Boolean)
      }
    });
  },

  async listar_por_rol({ role }) {
    return await User.findAll({
      where: { role }
    });
  },

  async buscar_por_email({ email }) {
    return await User.findOne({
      where: { email }
    });
  },

  async crear_usuario(data) {
    return await User.create(data);
  },

  async actualizar_usuario({ id, data }) {
    await User.update(data, { where: { id } });
    return await User.findByPk(id);
  },

  async eliminar_usuario({ id }) {
    return await User.destroy({
      where: { id }
    });
  }
};
