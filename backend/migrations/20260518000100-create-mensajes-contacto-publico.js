module.exports = {
  async up(queryInterface, Sequelize, transaction) {
    await queryInterface.createTable('mensajes_contacto_publico', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      nombre: { type: Sequelize.STRING(150), allowNull: false },
      email: { type: Sequelize.STRING(150), allowNull: false },
      asunto: { type: Sequelize.STRING(200), allowNull: false },
      mensaje: { type: Sequelize.TEXT, allowNull: false },
      leido: { type: Sequelize.BOOLEAN, defaultValue: false },
      fecha_envio: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    }, { transaction });
  },

  async down(queryInterface, Sequelize, transaction) {
    await queryInterface.dropTable('mensajes_contacto_publico', { transaction });
  }
};
