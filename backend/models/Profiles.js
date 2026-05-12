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

module.exports = { Session, Startup, Aceleradora, Inversor };
