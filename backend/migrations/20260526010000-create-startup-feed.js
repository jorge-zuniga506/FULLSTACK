'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('startup_posts', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      startup_id: {
        type: Sequelize.INTEGER, allowNull: false,
        references: { model: 'startups', key: 'id' },
        onDelete: 'CASCADE'
      },
      contenido: { type: Sequelize.TEXT, allowNull: false },
      imagen_url: { type: Sequelize.TEXT, allowNull: true },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
    });

    await queryInterface.createTable('startup_comentarios', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      post_id: {
        type: Sequelize.INTEGER, allowNull: false,
        references: { model: 'startup_posts', key: 'id' },
        onDelete: 'CASCADE'
      },
      startup_id: {
        type: Sequelize.INTEGER, allowNull: false,
        references: { model: 'startups', key: 'id' },
        onDelete: 'CASCADE'
      },
      contenido: { type: Sequelize.TEXT, allowNull: false },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('startup_comentarios');
    await queryInterface.dropTable('startup_posts');
  }
};
