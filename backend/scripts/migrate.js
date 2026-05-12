const fs = require('fs');
const path = require('path');
const sequelize = require('../config/db');

const direction = process.argv[2] || 'up';
const migrationsDir = path.join(__dirname, '..', 'migrations');
const tableName = 'sequelize_meta';

const ensureMetaTable = async (queryInterface, Sequelize) => {
  await queryInterface.createTable(tableName, {
    name: {
      type: Sequelize.STRING(255),
      allowNull: false,
      primaryKey: true
    }
  });
};

const getExecutedMigrations = async (queryInterface, Sequelize) => {
  try {
    await ensureMetaTable(queryInterface, Sequelize);
  } catch (error) {
    const alreadyExists = ['ER_TABLE_EXISTS_ERROR', 'ER_TABLE_EXIST_ERROR'].includes(error.original?.code);
    if (!alreadyExists) throw error;
  }

  const rows = await sequelize.query(`SELECT name FROM ${tableName}`, {
    type: Sequelize.QueryTypes.SELECT
  });
  return new Set(rows.map((row) => row.name));
};

const loadMigrations = () => {
  if (!fs.existsSync(migrationsDir)) return [];

  return fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith('.js'))
    .sort()
    .map((file) => ({
      name: file,
      migration: require(path.join(migrationsDir, file))
    }));
};

const runUp = async (queryInterface, Sequelize, migrations, executed) => {
  for (const { name, migration } of migrations) {
    if (executed.has(name)) continue;

    await sequelize.transaction(async (transaction) => {
      await migration.up(queryInterface, Sequelize, transaction);
      await queryInterface.bulkInsert(tableName, [{ name }], { transaction });
    });
    console.log(`Migracion aplicada: ${name}`);
  }
};

const runDown = async (queryInterface, Sequelize, migrations, executed) => {
  const lastMigration = migrations
    .filter(({ name }) => executed.has(name))
    .pop();

  if (!lastMigration) {
    console.log('No hay migraciones para revertir.');
    return;
  }

  await sequelize.transaction(async (transaction) => {
    await lastMigration.migration.down(queryInterface, Sequelize, transaction);
    await queryInterface.bulkDelete(tableName, { name: lastMigration.name }, { transaction });
  });
  console.log(`Migracion revertida: ${lastMigration.name}`);
};

const main = async () => {
  if (!['up', 'down'].includes(direction)) {
    throw new Error('Uso: node scripts/migrate.js [up|down]');
  }

  const queryInterface = sequelize.getQueryInterface();
  const Sequelize = sequelize.Sequelize;
  const migrations = loadMigrations();
  const executed = await getExecutedMigrations(queryInterface, Sequelize);

  if (direction === 'up') {
    await runUp(queryInterface, Sequelize, migrations, executed);
  } else {
    await runDown(queryInterface, Sequelize, migrations, executed);
  }
};

main()
  .catch((error) => {
    console.error('Error ejecutando migraciones:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await sequelize.close();
  });
