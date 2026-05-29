module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('admin_audit_logs', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      admin_user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      action: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      entity: {
        type: Sequelize.STRING(60),
        allowNull: false
      },
      entity_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      details_json: {
        type: Sequelize.TEXT('long'),
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      }
    });

    await queryInterface.addIndex('admin_audit_logs', ['admin_user_id'], {
      name: 'idx_admin_audit_logs_admin_user_id'
    });

    await queryInterface.addIndex('admin_audit_logs', ['created_at'], {
      name: 'idx_admin_audit_logs_created_at'
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('admin_audit_logs');
  }
};

