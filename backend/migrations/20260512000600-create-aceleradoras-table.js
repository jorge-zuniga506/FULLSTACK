module.exports = {
  async up(queryInterface, Sequelize, transaction) {
    await queryInterface.createTable('aceleradoras', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      nombre: { type: Sequelize.STRING(255), allowNull: false },
      programas_activos: { type: Sequelize.TEXT },
      sitio_web: { type: Sequelize.STRING(255) }
    }, { transaction });
  },

  async down(queryInterface, Sequelize, transaction) {
    await queryInterface.dropTable('aceleradoras', { transaction });
  }
};
