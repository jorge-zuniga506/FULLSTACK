module.exports = {
  async up(queryInterface, Sequelize, transaction) {
    await queryInterface.createTable('metricas_dashboard', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      startup_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'startups', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      num_empleados: { type: Sequelize.INTEGER },
      valoracion_estimada: { type: Sequelize.DECIMAL(15, 2) },
      fecha_reporte: { type: Sequelize.DATEONLY }
    }, { transaction });
  },

  async down(queryInterface, Sequelize, transaction) {
    await queryInterface.dropTable('metricas_dashboard', { transaction });
  }
};
