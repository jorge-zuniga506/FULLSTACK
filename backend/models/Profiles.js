const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Sector = require('./Sector');

const Session = sequelize.define('Session', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  token_jwt: { type: DataTypes.TEXT, allowNull: false },
  expiracion: { type: DataTypes.DATE, allowNull: false },
  es_valido: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { 
  tableName: 'sessions',
  timestamps: false 
});

const Startup = sequelize.define('Startup', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre_comercial: { type: DataTypes.STRING(255), allowNull: false },
  descripcion: { type: DataTypes.TEXT },
  fase: { 
    type: DataTypes.ENUM('Idea', 'Semilla', 'Serie A', 'Serie B', 'Escalamiento'),
    allowNull: true
  },
  logo_url: { type: DataTypes.TEXT }
}, { 
  tableName: 'startups',
  timestamps: false 
});

const Aceleradora = sequelize.define('Aceleradora', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(255), allowNull: false },
  programas_activos: { type: DataTypes.TEXT },
  sitio_web: { type: DataTypes.STRING(255) }
}, { 
  tableName: 'aceleradoras',
  timestamps: false 
});

const Inversor = sequelize.define('Inversor', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(255), allowNull: false },
  presupuesto_min: { type: DataTypes.DECIMAL(15, 2) },
  presupuesto_max: { type: DataTypes.DECIMAL(15, 2) },
  sectores_interes: { type: DataTypes.JSON }
}, { 
  tableName: 'inversores',
  timestamps: false 
});

// Relaciones con ON DELETE CASCADE / SET NULL según el SQL
User.hasMany(Session, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Session.belongsTo(User, { foreignKey: 'user_id' });

User.hasOne(Startup, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Startup.belongsTo(User, { foreignKey: 'user_id' });

User.hasOne(Aceleradora, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Aceleradora.belongsTo(User, { foreignKey: 'user_id' });

User.hasOne(Inversor, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Inversor.belongsTo(User, { foreignKey: 'user_id' });

Sector.hasMany(Startup, { foreignKey: 'sector_id', onDelete: 'SET NULL' });
Startup.belongsTo(Sector, { foreignKey: 'sector_id' });

module.exports = { Session, Startup, Aceleradora, Inversor };
