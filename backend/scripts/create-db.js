const mysql = require('mysql2/promise');
require('dotenv').config();

const createDb = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || '127.0.0.1',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root'
    });

    const dbName = process.env.DB_NAME || 'trello_db';
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    console.log(`Base de datos "${dbName}" verificada/creada.`);
    await connection.end();
  } catch (error) {
    console.error('Error creando la base de datos:', error);
    process.exit(1);
  }
};

createDb();
