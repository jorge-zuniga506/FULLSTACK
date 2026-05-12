module.exports = {
  async up(queryInterface, Sequelize, transaction) {
    await queryInterface.createTable('consultas_ia', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      pregunta_usuario: { type: Sequelize.TEXT, allowNull: false },
      respuesta_ia: { type: Sequelize.TEXT('long'), allowNull: false },
      modelo: { type: Sequelize.STRING(100) }
    }, { transaction });
  },

  async down(queryInterface, Sequelize, transaction) {
    await queryInterface.dropTable('consultas_ia', { transaction });
  }
};
