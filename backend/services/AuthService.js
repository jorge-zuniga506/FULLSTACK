/**
 * services/AuthService.js — Lógica de negocio de autenticación
 *
 * Clase estática que encapsula toda la lógica de autenticación,
 * separándola del controlador HTTP para facilitar testing y reutilización.
 *
 * Métodos:
 *
 * ── login(email, password) ───────────────────────────────────────────────────
 * Flujo:
 *   1. Valida que email y password estén presentes
 *   2. Busca el usuario por email en la BD
 *   3. Compara la contraseña con bcrypt.compare (timing-safe)
 *   4. Genera un JWT firmado con id, email y role_id (expira en 24h)
 *   5. Crea un registro en la tabla `sessions` con el token y su expiración
 *   6. Retorna el token y el usuario (sin password_hash)
 *
 * Seguridad: el mensaje "Credenciales inválidas" es genérico tanto para
 * usuario-no-encontrado como para contraseña-incorrecta, evitando user enumeration.
 *
 * ── logout(token) ────────────────────────────────────────────────────────────
 * Busca la sesión activa por token y la marca como es_valido = false.
 * El token sigue siendo criptográficamente válido (no se puede "destruir" un JWT)
 * pero el authMiddleware rechazará cualquier request con ese token porque
 * ya no existe una sesión activa con es_valido = true.
 *
 * ── getMe(userId) ────────────────────────────────────────────────────────────
 * Retorna los datos del usuario autenticado (sin password_hash).
 * Se usa en la ruta GET /api/auth/me para que el frontend obtenga el perfil activo.
 */
const jwt     = require('jsonwebtoken');
const bcrypt  = require('bcrypt');
const { User, Session } = require('../models');

class AuthService {

  /**
   * Autentica un usuario y crea una sesión JWT
   * @param {string} email    - Email del usuario
   * @param {string} password - Contraseña en texto plano
   * @returns {{ token: string, usuario: object }} Token JWT y datos del usuario
   * @throws {Error} Si las credenciales son inválidas o falta algún campo
   */
  static async login(email, password) {
    // Validación de campos presentes
    if (!email || !password) {
      throw new Error('Por favor ingrese email y contraseña.');
    }

    // Busca el usuario — mensaje genérico para evitar user enumeration
    const usuario = await User.findOne({ where: { email } });
    if (!usuario) {
      throw new Error('Credenciales inválidas.');
    }

    // Compara contraseña con el hash almacenado (bcrypt es timing-safe)
    const passwordValido = await bcrypt.compare(password, usuario.password_hash);
    if (!passwordValido) {
      throw new Error('Credenciales inválidas.'); // Mismo mensaje que usuario-no-encontrado
    }

    // Genera el JWT — payload mínimo para no exponer datos sensibles
    const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_123';
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, role_id: usuario.role_id },
      JWT_SECRET,
      { expiresIn: '24h' } // El token expira en 24 horas
    );

    // Calcula la fecha de expiración para almacenarla en la BD
    const expiracion = new Date(Date.now() + 24 * 60 * 60 * 1000);

    try {
      // Crea el registro de sesión en BD (permite revocación individual via logout)
      await Session.create({
        user_id:   usuario.id,
        token_jwt: token,
        expiracion,
        es_valido: true
      });
    } catch (sessionError) {
      throw new Error('Error al crear sesión de autenticación.');
    }

    // Elimina el hash antes de retornar — nunca exponer el hash en la API
    const usuarioResponse = usuario.toJSON();
    delete usuarioResponse.password_hash;

    return { token, usuario: usuarioResponse };
  }

  /**
   * Invalida una sesión activa (logout)
   * @param {string} token - JWT de la sesión a cerrar
   * @returns {true} Siempre retorna true si tuvo éxito
   * @throws {Error} Si el token no existe o la sesión ya estaba inválida
   */
  static async logout(token) {
    if (!token) {
      throw new Error('Token requerido para logout.');
    }

    // Busca la sesión activa con ese token
    const session = await Session.findOne({
      where: { token_jwt: token, es_valido: true }
    });

    if (!session) {
      throw new Error('Sesión no encontrada o ya inválida.');
    }

    // Marca la sesión como inválida (el JWT sigue existiendo pero authMiddleware lo rechazará)
    await session.update({ es_valido: false });
    return true;
  }

  /**
   * Obtiene los datos del usuario autenticado sin password_hash
   * @param {number} userId - ID del usuario desde req.user.id
   * @returns {User} Instancia del usuario sin password_hash
   * @throws {Error} Si el usuario no existe
   */
  static async getMe(userId) {
    const usuario = await User.findByPk(userId, {
      attributes: { exclude: ['password_hash'] } // Excluye hash en la consulta SQL
    });

    if (!usuario) {
      throw new Error('Usuario no encontrado.');
    }

    return usuario;
  }
}

module.exports = AuthService;
