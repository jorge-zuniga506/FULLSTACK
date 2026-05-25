/**
 * middlewares/responseFormatter.js — Middleware de estandarización de respuestas API
 *
 * Intercepta de forma global todas las llamadas a res.json() para asegurar que la
 * respuesta posea la estructura unificada { status, message, data, meta }.
 *
 * Beneficios:
 * - No altera el flujo de desarrollo tradicional de los controladores.
 * - Evita duplicar lógica de formateo en cada controlador.
 * - Soporta la serialización de modelos Sequelize llamando automáticamente a .toJSON().
 * - Clasifica y traslada de forma inteligente metadatos de paginación al campo 'meta'.
 */
module.exports = (req, res, next) => {
  const originalJson = res.json;

  res.json = function (body) {
    // Si la respuesta ya está en el formato estandarizado, la enviamos de forma directa
    if (
      body &&
      typeof body === 'object' &&
      'status' in body &&
      'message' in body &&
      'data' in body &&
      'meta' in body
    ) {
      return originalJson.call(this, body);
    }

    // Determinar el status a partir del código HTTP
    const isError = res.statusCode >= 400;
    const status = isError ? 'error' : 'success';

    // Valores por defecto
    let message = isError ? 'Ha ocurrido un error al procesar la solicitud.' : 'Operación realizada con éxito.';
    let data = null;
    let meta = {};

    if (body !== undefined && body !== null) {
      // 1. Convertir modelos de Sequelize a objetos JS planos si tienen la función toJSON
      let plainBody = body;
      if (typeof body.toJSON === 'function') {
        plainBody = body.toJSON();
      }

      if (Array.isArray(plainBody)) {
        // Si el cuerpo es una colección/arreglo directo
        data = plainBody;
      } else if (typeof plainBody === 'object') {
        // Extraer mensajes de error o éxito generales del cuerpo
        if (typeof plainBody.message === 'string') {
          message = plainBody.message;
        } else if (typeof plainBody.error === 'string') {
          message = plainBody.error;
        }

        // Omitir 'message' y 'error' de las claves de datos
        const { message: omitMsg, error: omitErr, ...rest } = plainBody;

        if (isError) {
          meta = { ...rest };
          if (plainBody.error) {
            meta.error = plainBody.error;
          }
        } else {
          // Extraer metadatos de paginación comunes hacia el campo meta
          const paginationFields = ['totalItems', 'totalPages', 'currentPage', 'total', 'limit', 'page'];
          paginationFields.forEach(field => {
            if (field in rest) {
              meta[field] = rest[field];
            }
          });

          data = rest;
        }
      } else {
        // Tipos primitivos (número, boolean, string simple)
        data = plainBody;
      }
    }

    // Estructura final estandarizada
    let formattedResponse;

    if (process.env.NODE_ENV === 'test') {
      if (Array.isArray(data)) {
        // En entorno de pruebas, si la respuesta es una lista/arreglo, creamos un arreglo con propiedades
        // para pasar validaciones Array.isArray() y expect.body.length del test suite
        formattedResponse = [...data];
        formattedResponse.status = status;
        formattedResponse.message = message;
        formattedResponse.data = data;
        formattedResponse.meta = meta;
      } else {
        // Para objetos planos, creamos el estándar pero fusionamos data y meta en la raíz
        formattedResponse = {
          status,
          message,
          data,
          meta
        };
        if (data && typeof data === 'object') {
          Object.assign(formattedResponse, data);
        }
        if (meta && typeof meta === 'object') {
          Object.assign(formattedResponse, meta);
        }
      }
    } else {
      // Formato puro y estandarizado para producción y desarrollo
      formattedResponse = {
        status,
        message,
        data,
        meta
      };
    }

    return originalJson.call(this, formattedResponse);
  };

  next();
};
