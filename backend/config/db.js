const { Sequelize } = require('sequelize');

const config = require('./config')[process.env.NODE_ENV || 'development'];

const MAX_RETRIES = parseInt(process.env.DB_RETRIES, 10) || 5;
const RETRY_DELAY_MS = parseInt(process.env.DB_RETRY_DELAY, 10) || 3000;

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    logging: config.logging,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const checkConnection = async (retries = MAX_RETRIES) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await sequelize.authenticate();
      if (process.env.NODE_ENV !== 'test') {
        const dialect = sequelize.getDialect();
        console.log(`DB connection OK (${dialect}).`);
      }
      return;
    } catch (error) {
      if (attempt === retries) {
        console.error(`Error de conexión a la base de datos después de ${retries} intentos.`);
        console.error('Verifica que el servidor de BD esté corriendo y las credenciales en .env sean correctas.');
        console.error(`Host: ${config.host}, DB: ${config.database}, User: ${config.username}`);
        throw new Error(`No se pudo conectar a la base de datos: ${error.message}`);
      }
      if (process.env.NODE_ENV !== 'test') {
        console.warn(`Intento ${attempt}/${retries} falló. Reintentando en ${RETRY_DELAY_MS / 1000}s...`);
      }
      await sleep(RETRY_DELAY_MS);
    }
  }
};

checkConnection();

module.exports = sequelize;
