module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`DROP TRIGGER IF EXISTS prevent_user_role_update;`);
    await queryInterface.sequelize.query(`
      CREATE TRIGGER prevent_user_role_update
      BEFORE UPDATE ON users
      FOR EACH ROW
      BEGIN
        IF NOT (NEW.role_id <=> OLD.role_id) THEN
          SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No se permite cambiar el rol del usuario.';
        END IF;
      END;
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`DROP TRIGGER IF EXISTS prevent_user_role_update;`);
  }
};
