module.exports = {
  async up(queryInterface, Sequelize, transaction) {
    await queryInterface.createTable('notificaciones', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      titulo: { type: Sequelize.STRING(200), allowNull: false },
      mensaje: { type: Sequelize.TEXT, allowNull: false },
      tipo: { type: Sequelize.STRING(100), allowNull: true },
      leido: { type: Sequelize.BOOLEAN, defaultValue: false },
      fecha_creacion: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    }, { transaction });
  },

  async down(queryInterface, Sequelize, transaction) {
    await queryInterface.dropTable('notificaciones', { transaction });
  }
};
