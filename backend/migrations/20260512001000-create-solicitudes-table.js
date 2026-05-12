module.exports = {
  async up(queryInterface, Sequelize, transaction) {
    await queryInterface.createTable('solicitudes', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      tipo: { type: Sequelize.ENUM('startup', 'aceleradora', 'inversor'), allowNull: false },
      estado: {
        type: Sequelize.ENUM('Pendiente', 'Aprobada', 'Rechazada'),
        defaultValue: 'Pendiente'
      },
      comentarios_admin: { type: Sequelize.TEXT }
    }, { transaction });
  },

  async down(queryInterface, Sequelize, transaction) {
    await queryInterface.dropTable('solicitudes', { transaction });
  }
};
