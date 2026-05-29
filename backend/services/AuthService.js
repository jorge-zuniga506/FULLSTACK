/**
 * services/AuthService.js — Lógica de negocio de autenticación
 *
 * Clase estática que encapsula toda la lógica de autenticación,
 * separándola del controlador HTTP para facilitar testing y reutilización.
 */
const jwt     = require('jsonwebtoken');
const bcrypt  = require('bcrypt');
const { OAuth2Client } = require('google-auth-library');
const { User, Session } = require('../models');
const { notificarCodigoInicioSesion } = require('./EmailService');
const { sendOtpByWhatsApp, maskPhone } = require('./WhatsAppService');
const { ADMIN_SECRET_DASHBOARD_PATH } = require('../config/adminSecurity');
const USER_SELECTABLE_ROLES = [2, 3, 4];

// Google OAuth Client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class AuthService {

  /**
   * Autentica un usuario y crea una sesión JWT
   * @param {string} email    - Email del usuario
   * @param {string} password - Contraseña en texto plano
   * @returns {{ token: string, usuario: object }} Token JWT y datos del usuario
   * @throws {Error} Si las credenciales son inválidas o falta algún campo
   */
  static async login(email, password, options = {}) {
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
      throw new Error('Credenciales inválidas.');
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

    // Generar un nuevo código de 2FA en cada inicio de sesión para facilitar las pruebas
    const codeDispatch = await AuthService.issueAndSendLoginCode(usuario, options);

    // Elimina el hash antes de retornar — nunca exponer el hash en la API
    const usuarioResponse = usuario.toJSON();
    delete usuarioResponse.password_hash;

    const redirectPath = AuthService.getRedirectPath(usuario.role_id);

    return {
      token,
      usuario: usuarioResponse,
      redirectPath,
      requiresExtraVerification: true,
      twoFactorDelivery: codeDispatch.delivery,
      twoFactorDestination: codeDispatch.destinationMasked,
      twoFactorExpiresAt: codeDispatch.expiresAt
    };
  }

  /**
   * Genera un código de verificación basado en el rol del usuario
   */
  static generarCodigoRol(role_id) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let prefix = 'DEMO';
    if (role_id === 1 || role_id === '1') prefix = 'ADMIN';
    else if (role_id === 2 || role_id === '2') prefix = 'STARTUP';
    else if (role_id === 3 || role_id === '3') prefix = 'ACELERADORA';
    else if (role_id === 4 || role_id === '4') prefix = 'INVERSOR';
    
    let randomStr = '';
    for (let i = 0; i < 4; i++) {
      randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `${prefix}${randomStr}`;
  }

  static generateOneTimeCode(length = 6) {
    const digits = '0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
      code += digits.charAt(Math.floor(Math.random() * digits.length));
    }
    return code;
  }

  static getTwoFactorTtlMinutes() {
    const parsed = parseInt(process.env.TWO_FACTOR_TTL_MINUTES || '10', 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 10;
  }

  static maskEmail(email = '') {
    if (!email || !email.includes('@')) return '';
    const [local, domain] = email.split('@');
    if (!local || !domain) return '';
    if (local.length <= 2) return `${local[0] || '*'}***@${domain}`;
    return `${local.slice(0, 2)}***@${domain}`;
  }

  static resolveOtpChannel(rawChannel = '') {
    const normalized = String(rawChannel || '').trim().toLowerCase();
    return normalized === 'whatsapp' ? 'whatsapp' : 'email';
  }

  static async issueAndSendLoginCode(usuario, options = {}) {
    const requestedChannel = AuthService.resolveOtpChannel(options.deliveryChannel);
    const verificationCode = AuthService.generateOneTimeCode(6);
    const ttlMinutes = AuthService.getTwoFactorTtlMinutes();
    const codeExpires = new Date(Date.now() + ttlMinutes * 60 * 1000);

    await usuario.update({
      two_factor_code: verificationCode,
      two_factor_expires_at: codeExpires,
      is_role_whitelisted: false
    });

    if (requestedChannel === 'whatsapp') {
      const whatsappResult = await sendOtpByWhatsApp({
        phone: options.whatsappPhone,
        apiKey: options.whatsappApiKey,
        userName: usuario.nombre_hacienda || usuario.email,
        code: verificationCode,
        expiresMinutes: ttlMinutes
      });

      if (!whatsappResult.ok) {
        throw new Error(whatsappResult.error || 'No se pudo enviar el codigo por WhatsApp.');
      }

      return {
        delivery: 'whatsapp',
        destinationMasked: whatsappResult.destinationMasked || maskPhone(options.whatsappPhone),
        expiresAt: codeExpires
      };
    }

    const mailSent = await notificarCodigoInicioSesion({
      to: usuario.email,
      userName: usuario.nombre_hacienda || usuario.email,
      code: verificationCode,
      expiresMinutes: ttlMinutes
    });

    if (!mailSent) {
      throw new Error('No se pudo enviar el codigo de verificacion al correo de inicio de sesion.');
    }

    return {
      delivery: 'email',
      destinationMasked: AuthService.maskEmail(usuario.email),
      expiresAt: codeExpires
    };
  }

  /**
   * Autentica a un usuario usando un ID Token de Google (OAuth 2.0).
   * Si el usuario no existe, lo registra automáticamente con un rol de 'startup' por defecto.
   * @param {string} token - ID Token (JWT) enviado desde el frontend
   * @returns {Promise<{ token: string, usuario: object, redirectPath: string }>}
   */
  static async loginWithGoogle(token, roleId) {
    if (!token) {
      throw new Error('Token de Google es requerido.');
    }

    let payload;
    try {
      // Intentamos verificar como Access Token llamando a la API de UserInfo de Google
      const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`);
      if (response.ok) {
        payload = await response.json();
      } else {
        throw new Error('No es un Access Token válido');
      }
    } catch (err) {
      // Si falla, intentamos verificarlo como ID Token (JWT)
      try {
        const ticket = await googleClient.verifyIdToken({
          idToken: token,
          audience: process.env.GOOGLE_CLIENT_ID
        });
        payload = ticket.getPayload();
      } catch (idErr) {
        console.error('Error al verificar token con Google (Access & ID Token):', idErr.message);
        throw new Error('Token de Google inválido o expirado.');
      }
    }

    const email = payload.email;
    const name = payload.name;
    const picture = payload.picture;
    const googleId = payload.sub;

    // Busca si el usuario ya existe por email
    let usuario = await User.findOne({ where: { email } });

    if (!usuario) {
      // Si el usuario no existe y no nos pasaron un roleId,
      // retornamos una bandera indicando que el usuario debe elegir su rol en el frontend
      if (!roleId) {
        return {
          requiresRoleSelection: true,
          googleToken: token,
          email,
          name,
          picture
        };
      }

      // Si nos pasaron un roleId, procedemos con el registro automático
      const randomPassword = Math.random().toString(36).slice(-16) + 'A1!';
      const passwordHash = await bcrypt.hash(randomPassword, 10);

      // Generar una cédula mock para cumplir con la restricción de allowNull: false
      const mockCedula = `G-${googleId.slice(-9)}`;

      const selectedRole = parseInt(roleId, 10);
      if (!USER_SELECTABLE_ROLES.includes(selectedRole)) {
        throw new Error('Rol invalido. Solo se permite Startup, Aceleradora o Inversionista.');
      }

      usuario = await User.create({
        cedula: mockCedula,
        nombre_hacienda: name || 'Usuario Google',
        email: email,
        password_hash: passwordHash,
        role_id: selectedRole,
        profile_picture: picture || null,
        survey_completed: true,
        is_role_whitelisted: true // Bypasseamos 2FA automático para registros con Google
      });
    } else {
      // Si el usuario existe y no tiene foto de perfil cargada, actualizamos su foto
      if (!usuario.profile_picture && picture) {
        await usuario.update({ profile_picture: picture });
      }
      // Auto-whitelisteamos rol de 2FA para ingresos con Google
      await usuario.update({ is_role_whitelisted: true });
    }

    // Genera el JWT
    const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_123';
    const jwtToken = jwt.sign(
      { id: usuario.id, email: usuario.email, role_id: usuario.role_id },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const expiracion = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Registra la sesión en BD
    await Session.create({
      user_id:   usuario.id,
      token_jwt: jwtToken,
      expiracion,
      es_valido: true
    });

    const usuarioResponse = usuario.toJSON();
    delete usuarioResponse.password_hash;

    const redirectPath = AuthService.getRedirectPath(usuario.role_id);

    return {
      requiresRoleSelection: false,
      token: jwtToken,
      usuario: usuarioResponse,
      redirectPath
    };
  }

  /**
   * Retorna la ruta del dashboard correspondiente al rol
   */
  static getRedirectPath(role_id) {
    switch (parseInt(role_id, 10)) {
      case 1: return ADMIN_SECRET_DASHBOARD_PATH;
      case 2: return '/dashboard/startup';
      case 3: return '/dashboard/aceleradora';
      case 4: return '/dashboard/inversor';
      default: return '/dashboard';
    }
  }

  /**
   * Verifica el código de rol de doble factor
   */
  static async verifyRoleCode(userId, code) {
    if (!code) {
      throw new Error('El código es requerido.');
    }

    const usuario = await User.findByPk(userId);
    if (!usuario) {
      throw new Error('Usuario no encontrado.');
    }

    // Verificar si el código coincide
    const providedCode = String(code).trim().toUpperCase();
    const storedCode = String(usuario.two_factor_code || '').trim().toUpperCase();
    if (!storedCode || storedCode !== providedCode) {
      throw new Error('Código de verificación inválido.');
    }

    // Verificar expiración
    if (usuario.two_factor_expires_at && new Date() > usuario.two_factor_expires_at) {
      throw new Error('El código ha expirado.');
    }

    // Marcar como verificado
    await usuario.update({
      is_role_whitelisted: true,
      two_factor_code: null,
      two_factor_expires_at: null
    });

    return true;
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

    const [updatedCount] = await Session.update(
      { es_valido: false },
      { where: { token_jwt: token, es_valido: true } }
    );

    if (!updatedCount) {
      throw new Error('Sesion no encontrada o ya invalida.');
    }
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

  /**
   * Reenvia un código temporal de doble factor al correo del usuario
   * @param {number} userId - ID del usuario
   * @returns {Date} Fecha de expiración del nuevo código
   */
  static async resetRoleCode(userId, options = {}) {
    const usuario = await User.findByPk(userId);
    if (!usuario) {
      throw new Error('Usuario no encontrado.');
    }

    return await AuthService.issueAndSendLoginCode(usuario, options);
  }

  /**
   * Actualiza el rol de un usuario saltándose el hook de seguridad de Sequelize.
   */
  static async changeUserRole(userId, newRoleId) {
    const roleIdNum = parseInt(newRoleId, 10);
    if (![2, 3, 4].includes(roleIdNum)) {
      throw new Error('Rol inválido. Solo se permite seleccionar Startup, Aceleradora o Inversionista.');
    }

    const usuario = await User.findByPk(userId);
    if (!usuario) {
      throw new Error('Usuario no encontrado.');
    }

    // Bypassear el hook de Sequelize usando { hooks: false }
    await usuario.update({ role_id: roleIdNum }, { hooks: false });

    // Retornar el usuario actualizado sin hash
    const usuarioResponse = usuario.toJSON();
    delete usuarioResponse.password_hash;

    // Generar nuevo redirectPath
    const redirectPath = AuthService.getRedirectPath(roleIdNum);

    return {
      usuario: usuarioResponse,
      redirectPath
    };
  }
}

module.exports = AuthService;
