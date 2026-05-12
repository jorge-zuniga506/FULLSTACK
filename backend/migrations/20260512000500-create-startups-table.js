module.exports = {
  async up(queryInterface, Sequelize, transaction) {
    await queryInterface.createTable('startups', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      nombre_comercial: { type: Sequelize.STRING(255), allowNull: false },
      descripcion: { type: Sequelize.TEXT },
      fase: { type: Sequelize.ENUM('Idea', 'Semilla', 'Serie A', 'Serie B', 'Escalamiento') },
      logo_url: { type: Sequelize.TEXT },
      sector_id: {
        type: Sequelize.INTEGER,
        references: { model: 'sectores', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      }
    }, { transaction });
  },

  async down(queryInterface, Sequelize, transaction) {
    await queryInterface.dropTable('startups', { transaction });
  }
};
