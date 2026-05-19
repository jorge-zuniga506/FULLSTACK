/**
 * services/UserService.js — Lógica de negocio de gestión de usuarios
 *
 * Clase estática que encapsula las operaciones CRUD sobre la tabla `users`.
 * Mantiene la lógica fuera de los controllers para facilitar testing.
 *
 * Métodos:
 *
 * ── crearUsuario(data) ───────────────────────────────────────────────────────
 * Crea un nuevo usuario hasheando la contraseña antes de persistirla.
 * Retorna el usuario creado SIN password_hash.
 *
 * ── obtenerUsuarios() ────────────────────────────────────────────────────────
 * Retorna todos los usuarios excluyendo password_hash de la query SQL.
 *
 * ── obtenerUsuarioPorId(id) ──────────────────────────────────────────────────
 * Busca por PK. Lanza Error si no existe (el controller lo convierte en 404).
 *
 * ── actualizarUsuario(id, data) ──────────────────────────────────────────────
 * Actualiza datos del usuario. Reglas de seguridad:
 *   - role_id está PROHIBIDO: lanza Error 403 si se intenta cambiar
 *   - password_hash: si se recibe, se hashea antes de guardar
 *   - Solo actualiza los campos permitidos: cedula, nombre_hacienda, email
 *
 * ── eliminarUsuario(id) ──────────────────────────────────────────────────────
 * Elimina el usuario. Gracias a onDelete: 'CASCADE' en las asociaciones,
 * se eliminan automáticamente sus sesiones, perfil y demás registros relacionados.
 */
const { User } = require('../models');
const bcrypt   = require('bcrypt');

class UserService {

  /**
   * Crea un nuevo usuario en la BD
   * @param {object} data - { cedula, nombre_hacienda, email, password_hash, role_id }
   * @returns {object} Usuario creado (sin password_hash)
   */
  static async crearUsuario(data) {
    const { cedula, nombre_hacienda, email, password_hash, role_id } = data;

    // Hashea la contraseña con bcrypt (salt rounds: 10)
    // El campo se llama password_hash en el modelo pero viene como texto plano desde el controller
    const clave_encriptada = await bcrypt.hash(password_hash, 10);

    const usuario = await User.create({
      cedula,
      nombre_hacienda,
      email,
      password_hash: clave_encriptada, // Guarda el hash, nunca el texto plano
      role_id
    });

    // Elimina el hash del objeto antes de retornar al cliente
    const usuarioResponse = usuario.toJSON();
    delete usuarioResponse.password_hash;
    return usuarioResponse;
  }

  /**
   * Retorna todos los usuarios sin sus contraseñas
   * @returns {User[]} Array de usuarios
   */
  static async obtenerUsuarios() {
    return await User.findAll({
      attributes: { exclude: ['password_hash'] } // Excluye el hash en la query SQL
    });
  }

  /**
   * Busca un usuario por su PK
   * @param {number} id - ID del usuario
   * @returns {User} Instancia del usuario (con todos los campos)
   * @throws {Error} 'Usuario no encontrado' si el ID no existe
   */
  static async obtenerUsuarioPorId(id) {
    const usuario = await User.findByPk(id);
    if (!usuario) throw new Error('Usuario no encontrado');
    return usuario;
  }

  /**
   * Actualiza los datos de un usuario
   * @param {number} id   - ID del usuario a actualizar
   * @param {object} data - Campos a actualizar (role_id prohibido)
   * @returns {object} Usuario actualizado (sin password_hash)
   * @throws {Error} Si se intenta cambiar role_id (403 en el controller)
   */
  static async actualizarUsuario(id, data) {
    const { cedula, nombre_hacienda, email, password_hash, role_id } = data;

    // Barrera de seguridad: role_id no debe modificarse nunca vía este endpoint
    // (la segunda capa está en los hooks beforeUpdate del modelo User)
    if (role_id !== undefined) {
      throw new Error('No se permite cambiar el rol del usuario desde este endpoint.');
    }

    const usuario = await this.obtenerUsuarioPorId(id);

    // Solo incluye los campos permitidos en la actualización
    let updateData = { cedula, nombre_hacienda, email };

    // Si se envía una nueva contraseña, la hashea antes de actualizar
    if (password_hash) {
      updateData.password_hash = await bcrypt.hash(password_hash, 10);
    }

    await usuario.update(updateData);

    // Retorna el usuario actualizado sin hash
    const usuarioResponse = usuario.toJSON();
    delete usuarioResponse.password_hash;
    return usuarioResponse;
  }

  /**
   * Elimina un usuario y sus registros relacionados (CASCADE)
   * @param {number} id - ID del usuario a eliminar
   * @returns {true}
   * @throws {Error} Si el usuario no existe
   */
  static async eliminarUsuario(id) {
    const usuario = await this.obtenerUsuarioPorId(id);
    await usuario.destroy(); // El CASCADE en BD elimina sesiones, perfiles, etc.
    return true;
  }
}

module.exports = UserService;
