module.exports = {
  async up(queryInterface, Sequelize, transaction) {
    await queryInterface.createTable('inversores', {
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
      presupuesto_min: { type: Sequelize.DECIMAL(15, 2) },
      presupuesto_max: { type: Sequelize.DECIMAL(15, 2) },
      sectores_interes: { type: Sequelize.JSON }
    }, { transaction });
  },

  async down(queryInterface, Sequelize, transaction) {
    await queryInterface.dropTable('inversores', { transaction });
  }
};
