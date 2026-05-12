const User = require('./User');
const Role = require('./Role');
const Sector = require('./Sector');
const Session = require('./Session');
const Startup = require('./Startup');
const Aceleradora = require('./Aceleradora');
const Inversor = require('./Inversor');
const ROLE_BY_MODEL = {
  Startup: 'startup',
  Aceleradora: 'aceleradora',
  Inversor: 'inversor'
};

const attachRoleValidation = (model, role) => {
  model.addHook('beforeValidate', async (instance) => {
    if (!instance.user_id) return;
    const user = await User.findByPk(instance.user_id);
    if (!user) {
      throw new Error(`El usuario ${instance.user_id} no existe.`);
    }
    const userRole = await Role.findByPk(user.role_id);
    if (!userRole) {
      throw new Error(`El rol del usuario ${instance.user_id} no existe.`);
    }
    if (userRole.nombre !== role) {
      throw new Error(`El usuario ${instance.user_id} debe tener rol "${role}".`);
    }
  });
};

attachRoleValidation(Startup, ROLE_BY_MODEL.Startup);
attachRoleValidation(Aceleradora, ROLE_BY_MODEL.Aceleradora);
attachRoleValidation(Inversor, ROLE_BY_MODEL.Inversor);

// Relaciones con ON DELETE CASCADE / SET NULL según el SQL
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

module.exports = { Session, Startup, Aceleradora, Inversor };
