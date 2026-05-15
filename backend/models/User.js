/**
 * models/User.js — Modelo Sequelize de usuarios
 *
 * Tabla: `users`
 *
 * Campos:
 *   id              — PK autoincremental
 *   cedula          — Número de identificación único (string, max 20 chars)
 *   nombre_hacienda — Nombre completo del usuario (requerido)
 *   email           — Correo único con validación de formato email
 *   password_hash   — Contraseña hasheada con bcrypt (TEXT para soportar hashes largos)
 *   role_id         — FK a `roles.id` — define qué perfil puede crear el usuario
 *
 * Opciones de tabla:
 *   timestamps: true  → gestiona created_at automáticamente
 *   createdAt: 'created_at' → mapea el campo al nombre real en BD
 *   updatedAt: false  → la tabla no tiene columna updated_at
 *
 * Seguridad de rol — Hooks de Sequelize:
 *   beforeUpdate:     evita que una actualización individual cambie role_id
 *   beforeBulkUpdate: evita que un update masivo incluya role_id en sus atributos
 *   → Ambos hooks lanzan un Error que aborta la operación si detectan el cambio
 *   → Esta es una capa de seguridad a nivel ORM (adicional a la capa de servicio)
 *
 * Asociaciones (definidas en models/index.js raíz):
 *   User hasMany Session       (un usuario puede tener múltiples sesiones activas)
 *   User belongsTo Role        (un usuario tiene exactamente un rol)
 *   User hasOne Startup        (un usuario startup tiene un perfil de startup)
 *   User hasOne Aceleradora    (un usuario aceleradora tiene un perfil)
 *   User hasOne Inversor       (un usuario inversor tiene un perfil)
 *   User hasMany Geolocalizacion
 *   User hasMany ConexionGrafo (como origen y como destino)
 *   User hasMany Solicitud
 *   User hasMany Mensaje
 *   User hasMany ConsultaIA
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cedula: {
    type: DataTypes.STRING(20),
    unique: true,       // No puede haber dos usuarios con el mismo número de ID
    allowNull: false
  },
  nombre_hacienda: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(255),
    unique: true,       // Un email solo puede tener una cuenta
    allowNull: false,
    validate: {
      isEmail: true     // Validación Sequelize: rechaza emails mal formados
    }
  },
  password_hash: {
    type: DataTypes.TEXT,  // TEXT para acomodar hashes bcrypt (60+ chars)
    allowNull: false
  },
  role_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'roles', // Nombre de la tabla (no el modelo)
      key: 'id'
    }
  }
}, {
  tableName:  'users',
  timestamps: true,
  createdAt:  'created_at', // Mapea al nombre de columna real en la tabla
  updatedAt:  false,        // La tabla no tiene columna updated_at

  hooks: {
    /**
     * beforeUpdate — Hook a nivel de instancia
     * Se dispara antes de User.save() o user.update()
     * Verifica si role_id está marcado como "changed" y aborta si lo está
     */
    beforeUpdate: (user, options) => {
      if (user.changed('role_id')) {
        throw new Error('No se permite cambiar el rol del usuario.');
      }
    },

    /**
     * beforeBulkUpdate — Hook a nivel de operaciones masivas
     * Se dispara antes de User.update({}, { where: {...} })
     * Verifica si los atributos a actualizar incluyen role_id
     */
    beforeBulkUpdate: (options) => {
      if (options.attributes && Object.prototype.hasOwnProperty.call(options.attributes, 'role_id')) {
        throw new Error('No se permite cambiar el rol del usuario.');
      }
    }
  }
});

module.exports = User;
