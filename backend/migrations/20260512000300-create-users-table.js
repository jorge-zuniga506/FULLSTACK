module.exports = {
  async up(queryInterface, Sequelize, transaction) {
    await queryInterface.createTable('users', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      cedula: { type: Sequelize.STRING(20), allowNull: false, unique: true },
      nombre_hacienda: { type: Sequelize.STRING(255), allowNull: false },
      email: { type: Sequelize.STRING(255), allowNull: false, unique: true },
      password_hash: { type: Sequelize.TEXT, allowNull: false },
      role_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'roles', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    }, { transaction });
  },

  async down(queryInterface, Sequelize, transaction) {
    await queryInterface.dropTable('users', { transaction });
  }
};
