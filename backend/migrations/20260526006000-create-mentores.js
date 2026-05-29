module.exports = {
  async up(queryInterface, Sequelize, transaction) {
    await queryInterface.createTable('mentores', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      aceleradora_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'aceleradoras', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      nombre: { type: Sequelize.STRING(255), allowNull: false },
      especialidad: { type: Sequelize.STRING(255) },
      linkedin_url: { type: Sequelize.TEXT },
      foto_url: { type: Sequelize.TEXT },
      activo: { type: Sequelize.BOOLEAN, defaultValue: true }
    }, { transaction });
  },

  async down(queryInterface, Sequelize, transaction) {
    await queryInterface.dropTable('mentores', { transaction });
  }
};
