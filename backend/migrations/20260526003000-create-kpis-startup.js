module.exports = {
  async up(queryInterface, Sequelize, transaction) {
    await queryInterface.createTable('kpis_startup', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      startup_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'startups', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      convocatoria_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'convocatorias', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      periodo: { type: Sequelize.STRING(20), allowNull: false },
      nuevos_usuarios: { type: Sequelize.INTEGER, defaultValue: 0 },
      ventas_mensuales: { type: Sequelize.DECIMAL(12, 2), defaultValue: 0 },
      costo_adquisicion: { type: Sequelize.DECIMAL(12, 2), defaultValue: 0 },
      notas: { type: Sequelize.TEXT },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
    }, { transaction });
  },

  async down(queryInterface, Sequelize, transaction) {
    await queryInterface.dropTable('kpis_startup', { transaction });
  }
};
