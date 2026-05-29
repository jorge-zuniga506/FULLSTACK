module.exports = {
  async up(queryInterface, Sequelize, transaction) {
    await queryInterface.createTable('demoday_solicitudes', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      inversor_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'inversores', key: 'id' },
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
      mensaje: { type: Sequelize.TEXT },
      estado: {
        type: Sequelize.ENUM('pendiente', 'aceptada', 'rechazada'),
        defaultValue: 'pendiente'
      },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
    }, { transaction });
  },

  async down(queryInterface, Sequelize, transaction) {
    await queryInterface.dropTable('demoday_solicitudes', { transaction });
  }
};
