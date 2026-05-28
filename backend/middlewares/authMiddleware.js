/**
 * middlewares/authMiddleware.js — Middleware de autenticación JWT con validación de sesión
 *
 * Exporta:
 *   authRequired — middleware que protege rutas privadas de la API
 *
 * Flujo de validación (en orden):
 * 1. Extrae el token del header `Authorization: Bearer <token>`
 * 2. Verifica la firma y expiración del JWT con jsonwebtoken
 * 3. Busca la sesión en la tabla `sessions` (token_jwt + es_valido = true)
 * 4. Verifica que la sesión no haya expirado (campo `expiracion`)
 * 5. Adjunta el payload decodificado a `req.user` para uso en controllers
 *
 * Doble validación de expiración:
 * - jwt.verify() verifica la expiración embebida en el token (campo `exp`)
 * - La comparación con session.expiracion es una segunda capa de seguridad
 *   que permite revocar tokens individualmente (logout) incluso si el JWT
 *   sigue siendo criptográficamente válido.
 *
 * Códigos HTTP de error:
 *   401 → token ausente, inválido, expirado o sesión revocada
 *   500 → error inesperado del servidor
 */
const jwt     = require('jsonwebtoken');
const { Session } = require('../models');

const extractTokenFromCookies = (cookieHeader = '') => {
  if (!cookieHeader) return null;
  const parts = cookieHeader.split(';').map(part => part.trim());
  const tokenPair = parts.find(part => part.startsWith('access_token='));
  if (!tokenPair) return null;
  return decodeURIComponent(tokenPair.split('=')[1] || '');
};

/**
 * authRequired — Middleware de autenticación
 *
 * Uso en rutas:
 *   router.get('/ruta-privada', authRequired, controller)
 *
 * Después de pasar este middleware, `req.user` contiene:
 *   { id, email, role_id, iat, exp }
 */
const authRequired = async (req, res, next) => {
  try {
    // ── 1. Extrae el token del header Authorization ─────────────────────
    // Formato esperado: "Bearer eyJhbGci..."
    const authHeader = req.headers['authorization'];
    const bearerToken = authHeader && authHeader.split(' ')[1];
    const cookieToken = extractTokenFromCookies(req.headers.cookie);
    const token = bearerToken || cookieToken; // Toma la parte después de 'Bearer '

    if (!token) {
      return res.status(401).json({ message: 'Token de acceso requerido.' });
    }

    // ── 2. Verifica firma y expiración del JWT ──────────────────────────
    const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_123';
    const decoded = jwt.verify(token, JWT_SECRET); // Lanza JsonWebTokenError o TokenExpiredError si falla

    // ── 3. Busca la sesión activa en la BD ─────────────────────────────
    // La sesión debe existir Y tener es_valido = true
    // (es_valido se pone en false al hacer logout)
    const session = await Session.findOne({
      where: {
        token_jwt: token,
        es_valido: true
      }
    });

    if (!session) {
      return res.status(401).json({ message: 'Sesión inválida o token revocado.' });
    }

    // ── 4. Verifica expiración de la sesión en BD ───────────────────────
    // Segunda capa de seguridad contra tokens con exp largo pero sesiones revocadas
    const now = new Date();
    if (session.expiracion < now) {
      return res.status(401).json({ message: 'Token expirado.' });
    }

    // ── 5. Adjunta payload a req.user y continúa ────────────────────────
    // Los controllers pueden acceder a req.user.id, req.user.role_id, etc.
    req.user = decoded;
    next();

  } catch (error) {
    // Errores específicos de jsonwebtoken
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token inválido.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expirado.' });
    }
    // Error inesperado del servidor
    res.status(500).json({ message: 'Error en la autenticación.', error: error.message });
  }
};

/**
 * Requiere que el usuario autenticado tenga uno de los roles indicados.
 * Debe usarse DESPUÉS de authRequired (req.user debe existir).
 *
 * Uso: router.delete('/ruta', authRequired, requireRole(1), controller)
 * donde 1 = id del rol 'admin'
 */
const requireRole = (...roleIds) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'No autenticado.' });
  }
  if (!roleIds.includes(req.user.role_id)) {
    return res.status(403).json({ message: 'No autorizado. No tienes permisos suficientes.' });
  }
  next();
};

module.exports = { authRequired, requireRole };

