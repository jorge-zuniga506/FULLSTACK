module.exports = {
  async up(queryInterface, Sequelize, transaction) {
    await queryInterface.createTable('perks', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      aceleradora_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'aceleradoras', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      titulo: { type: Sequelize.STRING(255), allowNull: false },
      descripcion: { type: Sequelize.TEXT },
      tipo: {
        type: Sequelize.ENUM('credito_cloud', 'espacio_trabajo', 'beneficio_comercial', 'otro'),
        defaultValue: 'otro'
      },
      valor: { type: Sequelize.STRING(100) },
      activo: { type: Sequelize.BOOLEAN, defaultValue: true }
    }, { transaction });
  },

  async down(queryInterface, Sequelize, transaction) {
    await queryInterface.dropTable('perks', { transaction });
  }
};
