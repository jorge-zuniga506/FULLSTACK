module.exports = {
  async up(queryInterface, Sequelize, transaction) {
    await queryInterface.createTable('geolocalizacion', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      latitud: { type: Sequelize.DECIMAL(10, 8), allowNull: false },
      longitud: { type: Sequelize.DECIMAL(11, 8), allowNull: false },
      direccion: { type: Sequelize.TEXT }
    }, { transaction });
  },

  async down(queryInterface, Sequelize, transaction) {
    await queryInterface.dropTable('geolocalizacion', { transaction });
  }
};
