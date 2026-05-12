module.exports = {
  async up(queryInterface, Sequelize, transaction) {
    await queryInterface.createTable('conexiones_grafo', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      actor_origen_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      actor_destino_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      tipo_vinculo: { type: Sequelize.ENUM('Inversion', 'Alianza', 'Mentoria'), allowNull: false }
    }, { transaction });
  },

  async down(queryInterface, Sequelize, transaction) {
    await queryInterface.dropTable('conexiones_grafo', { transaction });
  }
};
