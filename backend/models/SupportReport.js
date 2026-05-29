const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const SupportReport = sequelize.define('SupportReport', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  reporter_user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  reporter_role_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  categoria: {
    type: DataTypes.STRING(30),
    allowNull: false
  },
  prioridad: {
    type: DataTypes.STRING(15),
    allowNull: false,
    defaultValue: 'media'
  },
  asunto: {
    type: DataTypes.STRING(180),
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  pagina_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  contexto_tecnico: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  estado: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'nuevo'
  },
  admin_note: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'support_reports',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = SupportReport;
