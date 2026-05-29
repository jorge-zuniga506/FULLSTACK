module.exports = {
  async up(queryInterface, Sequelize, transaction) {
    await queryInterface.createTable('reclamaciones_perks', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      perk_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'perks', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      startup_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'startups', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      estado: {
        type: Sequelize.ENUM('pendiente', 'aprobada', 'rechazada'),
        defaultValue: 'pendiente'
      },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
    }, { transaction });
  },

  async down(queryInterface, Sequelize, transaction) {
    await queryInterface.dropTable('reclamaciones_perks', { transaction });
  }
};
