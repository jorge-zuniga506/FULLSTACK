module.exports = {
  async up(queryInterface, Sequelize, transaction) {
    await queryInterface.createTable('reservas_mentoria', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      mentor_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'mentores', key: 'id' },
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
      fecha_hora: { type: Sequelize.DATE },
      estado: {
        type: Sequelize.ENUM('pendiente', 'confirmada', 'cancelada'),
        defaultValue: 'pendiente'
      },
      notas: { type: Sequelize.TEXT },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
    }, { transaction });
  },

  async down(queryInterface, Sequelize, transaction) {
    await queryInterface.dropTable('reservas_mentoria', { transaction });
  }
};
