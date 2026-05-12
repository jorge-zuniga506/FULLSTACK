const { Sequelize } = require('sequelize');
const config = require('./config')[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    logging: config.logging
  }
);

const checkConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL OK.');
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error);
  }
};

checkConnection();

module.exports = sequelize;
