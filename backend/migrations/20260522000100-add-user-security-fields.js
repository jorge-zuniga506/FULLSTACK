'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'two_factor_code', {
      type: Sequelize.STRING(20),
      allowNull: true,
      defaultValue: null
    });
    await queryInterface.addColumn('users', 'two_factor_expires_at', {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null
    });
    await queryInterface.addColumn('users', 'survey_completed', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });
    await queryInterface.addColumn('users', 'is_role_whitelisted', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('users', 'two_factor_code');
    await queryInterface.removeColumn('users', 'two_factor_expires_at');
    await queryInterface.removeColumn('users', 'survey_completed');
    await queryInterface.removeColumn('users', 'is_role_whitelisted');
  }
};
