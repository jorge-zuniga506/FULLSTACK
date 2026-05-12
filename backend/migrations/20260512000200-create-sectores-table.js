module.exports = {
  async up(queryInterface, Sequelize, transaction) {
    await queryInterface.createTable('sectores', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      nombre: { type: Sequelize.STRING(100), allowNull: false },
      color_hex: { type: Sequelize.STRING(7), allowNull: false }
    }, { transaction });
  },

  async down(queryInterface, Sequelize, transaction) {
    await queryInterface.dropTable('sectores', { transaction });
  }
};
