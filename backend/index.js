const sequelize = require('./config/db');

// Ensure profile role-validation hooks are attached at startup.
require('./models/Profiles');

const User = require('./models/User');
const Role = require('./models/Role');
const Sector = require('./models/Sector');
const Startup = require('./models/Startup');
const Session = require('./models/Session');
const Aceleradora = require('./models/Aceleradora');
const Inversor = require('./models/Inversor');

const {
  Geolocalizacion,
  ConexionGrafo,
  Solicitud,
  MetricaDashboard
} = require('./models/Ecosystem');

const { Mensaje, ConsultaIA } = require('./models/Communication');
const ContactoPublico = require('./models/ContactPublicMessage');
const Notificacion = require('./models/Notification');

User.hasMany(Session, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Session.belongsTo(User, { foreignKey: 'user_id' });

Role.hasMany(User, { foreignKey: 'role_id', onDelete: 'RESTRICT' });
User.belongsTo(Role, { foreignKey: 'role_id' });

User.hasOne(Startup, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Startup.belongsTo(User, { foreignKey: 'user_id' });

User.hasOne(Aceleradora, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Aceleradora.belongsTo(User, { foreignKey: 'user_id' });

User.hasOne(Inversor, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Inversor.belongsTo(User, { foreignKey: 'user_id' });

Sector.hasMany(Startup, { foreignKey: 'sector_id', onDelete: 'SET NULL' });
Startup.belongsTo(Sector, { foreignKey: 'sector_id' });

User.hasMany(Geolocalizacion, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Geolocalizacion.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(ConexionGrafo, { foreignKey: 'actor_origen_id', as: 'ConexionesSalientes', onDelete: 'CASCADE' });
User.hasMany(ConexionGrafo, { foreignKey: 'actor_destino_id', as: 'ConexionesEntrantes', onDelete: 'CASCADE' });
ConexionGrafo.belongsTo(User, { foreignKey: 'actor_origen_id', as: 'Origen' });
ConexionGrafo.belongsTo(User, { foreignKey: 'actor_destino_id', as: 'Destino' });

User.hasMany(Solicitud, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Solicitud.belongsTo(User, { foreignKey: 'user_id' });

Startup.hasMany(MetricaDashboard, { foreignKey: 'startup_id', onDelete: 'CASCADE' });
MetricaDashboard.belongsTo(Startup, { foreignKey: 'startup_id' });

User.hasMany(Mensaje, { foreignKey: 'emisor_id', onDelete: 'CASCADE' });
Mensaje.belongsTo(User, { foreignKey: 'emisor_id', as: 'Emisor' });

User.hasMany(ConsultaIA, { foreignKey: 'user_id', onDelete: 'CASCADE' });
ConsultaIA.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Notificacion, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Notificacion.belongsTo(User, { foreignKey: 'user_id' });

module.exports = {
  sequelize,
  User,
  Role,
  Sector,
  Startup,
  Session,
  Aceleradora,
  Inversor,
  Geolocalizacion,
  ConexionGrafo,
  Solicitud,
  MetricaDashboard,
  Mensaje,
  ConsultaIA,
  ContactoPublico,
  Notificacion
};
