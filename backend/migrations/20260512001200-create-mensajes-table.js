module.exports = {
  async up(queryInterface, Sequelize, transaction) {
    await queryInterface.createTable('mensajes', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      emisor_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      chat_id: { type: Sequelize.INTEGER, allowNull: false },
      contenido: { type: Sequelize.TEXT, allowNull: false },
      leido: { type: Sequelize.BOOLEAN, defaultValue: false },
      fecha_envio: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    }, { transaction });
  },

  async down(queryInterface, Sequelize, transaction) {
    await queryInterface.dropTable('mensajes', { transaction });
  }
};
