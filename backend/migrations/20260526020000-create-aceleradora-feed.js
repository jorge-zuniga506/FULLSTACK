'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('aceleradora_posts', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      aceleradora_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'aceleradoras', key: 'id' },
        onDelete: 'CASCADE'
      },
      contenido: { type: Sequelize.TEXT, allowNull: false },
      imagen_url: { type: Sequelize.TEXT, allowNull: true },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
    });

    await queryInterface.createTable('aceleradora_comentarios', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      post_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'aceleradora_posts', key: 'id' },
        onDelete: 'CASCADE'
      },
      aceleradora_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'aceleradoras', key: 'id' },
        onDelete: 'CASCADE'
      },
      contenido: { type: Sequelize.TEXT, allowNull: false },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('aceleradora_comentarios');
    await queryInterface.dropTable('aceleradora_posts');
  }
};
