module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('support_reports', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      reporter_user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      reporter_role_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      categoria: {
        type: Sequelize.STRING(30),
        allowNull: false
      },
      prioridad: {
        type: Sequelize.STRING(15),
        allowNull: false,
        defaultValue: 'media'
      },
      asunto: {
        type: Sequelize.STRING(180),
        allowNull: false
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      pagina_url: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      contexto_tecnico: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      estado: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'nuevo'
      },
      admin_note: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      }
    });

    await queryInterface.addIndex('support_reports', ['estado'], {
      name: 'idx_support_reports_estado'
    });

    await queryInterface.addIndex('support_reports', ['reporter_user_id'], {
      name: 'idx_support_reports_reporter_user_id'
    });

    await queryInterface.addIndex('support_reports', ['created_at'], {
      name: 'idx_support_reports_created_at'
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('support_reports');
  }
};
