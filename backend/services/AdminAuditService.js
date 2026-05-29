const { AdminAuditLog, User } = require('../models');

class AdminAuditService {
  static sanitizeLimit(rawLimit) {
    const parsed = parseInt(rawLimit, 10);
    if (!Number.isFinite(parsed) || parsed <= 0) return 100;
    return Math.min(parsed, 500);
  }

  static async log({ adminUserId, action, entity, entityId = null, details = null }) {
    if (!adminUserId || !action || !entity) return null;

    return await AdminAuditLog.create({
      admin_user_id: adminUserId,
      action: String(action).toUpperCase(),
      entity: String(entity).toLowerCase(),
      entity_id: entityId ? parseInt(entityId, 10) : null,
      details_json: details ? JSON.stringify(details) : null
    });
  }

  static async listRecent({ limit = 100 } = {}) {
    const safeLimit = AdminAuditService.sanitizeLimit(limit);
    const rows = await AdminAuditLog.findAll({
      include: [
        {
          model: User,
          as: 'AdminActor',
          attributes: ['id', 'email', 'nombre_hacienda']
        }
      ],
      order: [['created_at', 'DESC']],
      limit: safeLimit
    });

    return rows.map((row) => {
      const plain = row.toJSON();
      let details = null;

      if (plain.details_json) {
        try {
          details = JSON.parse(plain.details_json);
        } catch (_error) {
          details = plain.details_json;
        }
      }

      return {
        id: plain.id,
        created_at: plain.created_at,
        action: plain.action,
        entity: plain.entity,
        entity_id: plain.entity_id,
        admin: plain.AdminActor || null,
        details
      };
    });
  }
}

module.exports = AdminAuditService;

