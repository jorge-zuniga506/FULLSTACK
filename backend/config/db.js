/**
 * config/db.js — Instancia centralizada de Sequelize
 *
 * Lee la configuración del entorno activo (NODE_ENV) desde config.js
 * y crea una única instancia de Sequelize que se reutiliza en toda la app.
 *
 * Flujo de conexión:
 * 1. Lee process.env.NODE_ENV (default: 'development')
 * 2. Toma el bloque correspondiente de config.js
 * 3. Crea la instancia Sequelize con los parámetros del entorno
 * 4. Llama a checkConnection() para verificar la conectividad al importar el módulo
 *
 * Exporta: instancia `sequelize` lista para usar en modelos y routes
 *
 * Nota: checkConnection() se ejecuta automáticamente al requerir este módulo.
 * En entorno `test` (SQLite en memoria) la conexión siempre es exitosa.
 */
const { Sequelize } = require('sequelize');

// Selecciona el bloque de configuración según el entorno activo
const config = require('./config')[process.env.NODE_ENV || 'development'];

// Crea la instancia de Sequelize con la configuración del entorno
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host:    config.host,
    dialect: config.dialect,  // 'mysql' en dev/prod | 'sqlite' en test
    logging: config.logging   // false → no imprime SQL en consola
  }
);

/**
 * Verifica la conectividad con la base de datos
 * Se llama al cargar el módulo para detectar problemas de conexión al inicio
 */
const checkConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL OK.');
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error);
  }
};

// Ejecuta la verificación inmediatamente al importar el módulo
checkConnection();

module.exports = sequelize;
