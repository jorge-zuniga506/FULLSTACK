const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const AdminAuditLog = sequelize.define('AdminAuditLog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  admin_user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  action: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  entity: {
    type: DataTypes.STRING(60),
    allowNull: false
  },
  entity_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  details_json: {
    type: DataTypes.TEXT('long'),
    allowNull: true
  }
}, {
  tableName: 'admin_audit_logs',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = AdminAuditLog;

