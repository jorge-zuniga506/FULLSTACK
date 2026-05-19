/**
 * models/Profiles.js — Agrupador de modelos de perfil con validación de rol
 *
 * Este archivo tiene dos responsabilidades:
 *
 * 1. IMPORTAR Y RE-EXPORTAR los modelos de perfil de entidad:
 *    Session, Startup, Aceleradora, Inversor
 *
 * 2. APLICAR VALIDACIÓN DE ROL en los hooks de Sequelize para
 *    Startup, Aceleradora e Inversor mediante `attachRoleValidation`.
 *
 * ─── Validación de Rol (attachRoleValidation) ──────────────────────────────
 * Antes de crear un perfil (beforeValidate), verifica que el user_id
 * proporcionado pertenezca a un usuario con el rol correcto:
 *   Startup     → rol 'startup'
 *   Aceleradora → rol 'aceleradora'
 *   Inversor    → rol 'inversor'
 *
 * Si el usuario tiene un rol diferente, la operación es abortada con un Error.
 * Esto garantiza que un usuario 'inversor' no pueda crearse un perfil de 'startup', etc.
 *
 * Mapeo de validación:
 *   ROLE_BY_MODEL = { Startup: 'startup', Aceleradora: 'aceleradora', Inversor: 'inversor' }
 *
 * Importación correcta (desde controllers/services):
 *   const { Startup, Aceleradora, Inversor, Session } = require('../models');
 *   → Usar models/index.js, NO este archivo directamente
 */
const User        = require('./User');
const Role        = require('./Role');
const Sector      = require('./Sector');
const Session     = require('./Session');
const Startup     = require('./Startup');
const Aceleradora = require('./Aceleradora');
const Inversor    = require('./Inversor');

/**
 * Mapeo modelo → nombre del rol requerido
 * Se usa para generar mensajes de error descriptivos
 */
const ROLE_BY_MODEL = {
  Startup:     'startup',
  Aceleradora: 'aceleradora',
  Inversor:    'inversor'
};

/**
 * attachRoleValidation — Agrega un hook beforeValidate al modelo dado
 *
 * El hook verifica que el user_id del registro nuevo corresponda a un usuario
 * cuyo rol coincide con el `role` esperado para ese tipo de perfil.
 *
 * @param {Model}  model - Modelo Sequelize al que se adjunta el hook
 * @param {string} role  - Nombre del rol requerido (ej: 'startup')
 *
 * Lanza Error si:
 *   - El user_id no existe en la tabla `users`
 *   - El role_id del usuario no existe en `roles`
 *   - El nombre del rol no coincide con el requerido
 */
const attachRoleValidation = (model, role) => {
  model.addHook('beforeValidate', async (instance) => {
    // Si no hay user_id (ej: creación sin FK), omitir validación
    if (!instance.user_id) return;

    // Busca el usuario dueño del perfil
    const user = await User.findByPk(instance.user_id);
    if (!user) {
      throw new Error(`El usuario ${instance.user_id} no existe.`);
    }

    // Busca el rol del usuario
    const userRole = await Role.findByPk(user.role_id);
    if (!userRole) {
      throw new Error(`El rol del usuario ${instance.user_id} no existe.`);
    }

    // Verifica que el rol coincida con el esperado para este tipo de perfil
    if (userRole.nombre !== role) {
      throw new Error(`El usuario ${instance.user_id} debe tener rol "${role}".`);
    }
  });
};

// ─── Aplica la validación de rol a cada modelo de perfil ──────────────────────
attachRoleValidation(Startup,     ROLE_BY_MODEL.Startup);
attachRoleValidation(Aceleradora, ROLE_BY_MODEL.Aceleradora);
attachRoleValidation(Inversor,    ROLE_BY_MODEL.Inversor);

// Re-exporta los modelos con los hooks ya adjuntos
module.exports = { Session, Startup, Aceleradora, Inversor };
