const { sequelize } = require('../models');

const syncDb = async () => {
  try {
    console.log('Iniciando sincronización de base de datos...');
    await sequelize.sync({ force: false });
    console.log('¡Éxito! Todas las tablas han sido creadas/actualizadas en MySQL.');
    process.exit(0);
  } catch (error) {
    console.error('Error durante la sincronización:', error);
    process.exit(1);
  }
};

syncDb();
