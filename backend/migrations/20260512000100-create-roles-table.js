module.exports = {
  async up(queryInterface, Sequelize, transaction) {
    await queryInterface.createTable('roles', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      nombre: { type: Sequelize.STRING(50), allowNull: false, unique: true }
    }, { transaction });
  },

  async down(queryInterface, Sequelize, transaction) {
    await queryInterface.dropTable('roles', { transaction });
  }
};
