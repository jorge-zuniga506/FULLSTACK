/**
 * middlewares/errorHandler.js — Manejador global de errores de Express
 *
 * Middleware de 4 parámetros (err, req, res, next) — Express lo identifica
 * automáticamente como manejador de errores cuando tiene exactamente 4 params.
 *
 * Se activa cuando:
 * - Un middleware llama a next(err) con un objeto de error
 * - Una ruta arroja una excepción no capturada (con express-async-errors)
 *
 * Comportamiento:
 * - Registra el mensaje y el stack del error en consola (útil para debugging)
 * - Determina el código HTTP: usa err.statusCode, err.status, o 500 como fallback
 * - En entorno 'development', incluye el stack trace en la respuesta JSON
 *   para facilitar el debugging desde el cliente/Postman
 * - En producción, omite el stack trace para no exponer información interna
 *
 * Formato de respuesta:
 * {
 *   success: false,
 *   message: "Descripción del error",
 *   stack: "..." // Solo en NODE_ENV=development
 * }
 *
 * IMPORTANTE: debe registrarse como ÚLTIMO middleware en app.js para
 * poder capturar errores de todos los routers anteriores.
 */
module.exports = (err, req, res, next) => {
  // Registra el error en consola para trazabilidad en servidor
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);

  // Determina el código HTTP:
  // Usa statusCode o status si el error los define (ej: errores personalizados),
  // de lo contrario usa 500 (Internal Server Error)
  const statusCode = err.statusCode || err.status || 500;

  // Construye la respuesta de error
  // El stack trace solo se incluye en desarrollo para no exponer internos en producción
  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Error interno del servidor',
    data: null,
    meta: {
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};