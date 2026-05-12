module.exports = {
  async up(queryInterface, Sequelize, transaction) {
    await queryInterface.createTable('sessions', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      token_jwt: { type: Sequelize.TEXT, allowNull: false },
      expiracion: { type: Sequelize.DATE, allowNull: false },
      es_valido: { type: Sequelize.BOOLEAN, defaultValue: true }
    }, { transaction });
  },

  async down(queryInterface, Sequelize, transaction) {
    await queryInterface.dropTable('sessions', { transaction });
  }
};
