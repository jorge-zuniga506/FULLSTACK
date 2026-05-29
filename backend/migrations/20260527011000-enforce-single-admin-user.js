module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS prevent_multiple_admin_users_on_insert;
    `);

    await queryInterface.sequelize.query(`
      CREATE TRIGGER prevent_multiple_admin_users_on_insert
      BEFORE INSERT ON users
      FOR EACH ROW
      BEGIN
        IF NEW.role_id = 1 THEN
          IF (SELECT COUNT(*) FROM users WHERE role_id = 1) >= 1 THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Solo se permite un usuario administrador en el sistema.';
          END IF;
        END IF;
      END;
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS prevent_multiple_admin_users_on_insert;
    `);
  }
};

