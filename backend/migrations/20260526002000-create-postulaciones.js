module.exports = {
  async up(queryInterface, Sequelize, transaction) {
    await queryInterface.createTable('postulaciones', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      convocatoria_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'convocatorias', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      startup_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'startups', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      pitch_deck_url: { type: Sequelize.TEXT },
      mensaje: { type: Sequelize.TEXT },
      estado: {
        type: Sequelize.ENUM('Recibida', 'Entrevistada', 'Aceptada', 'Rechazada'),
        defaultValue: 'Recibida'
      },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
    }, { transaction });
  },

  async down(queryInterface, Sequelize, transaction) {
    await queryInterface.dropTable('postulaciones', { transaction });
  }
};
