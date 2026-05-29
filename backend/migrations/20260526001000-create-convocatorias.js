module.exports = {
  async up(queryInterface, Sequelize, transaction) {
    await queryInterface.createTable('convocatorias', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      aceleradora_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'aceleradoras', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      nombre_batch: { type: Sequelize.STRING(255), allowNull: false },
      descripcion: { type: Sequelize.TEXT },
      requisitos: { type: Sequelize.TEXT },
      fecha_inicio: { type: Sequelize.DATEONLY },
      fecha_cierre: { type: Sequelize.DATEONLY },
      estado: {
        type: Sequelize.ENUM('borrador', 'abierta', 'cerrada'),
        defaultValue: 'borrador'
      },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
    }, { transaction });
  },

  async down(queryInterface, Sequelize, transaction) {
    await queryInterface.dropTable('convocatorias', { transaction });
  }
};
