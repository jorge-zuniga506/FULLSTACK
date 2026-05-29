'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('inversor_posts', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      inversor_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'inversores', key: 'id' },
        onDelete: 'CASCADE'
      },
      contenido: { type: Sequelize.TEXT, allowNull: false },
      imagen_url: { type: Sequelize.TEXT, allowNull: true },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
    });

    await queryInterface.createTable('inversor_comentarios', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      post_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'inversor_posts', key: 'id' },
        onDelete: 'CASCADE'
      },
      inversor_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'inversores', key: 'id' },
        onDelete: 'CASCADE'
      },
      contenido: { type: Sequelize.TEXT, allowNull: false },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('inversor_comentarios');
    await queryInterface.dropTable('inversor_posts');
  }
};
