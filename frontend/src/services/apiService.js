/**
 * apiService.js — Capa de servicio centralizada en el frontend para peticiones HTTP
 *
 * Responsabilidades:
 * - Realizar peticiones asíncronas REST (GET, POST, PUT, DELETE) de manera genérica
 * - Administrar la URL base y las cabeceras de Content-Type y Authorization (JWT Bearer Token)
 * - Devolver promesas limpias o arrojar errores legibles del backend
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3007';

const unpackResponse = (result) => {
  if (result && typeof result === 'object' && 'status' in result && 'data' in result) {
    if (result.status === 'success' && result.data && typeof result.data === 'object' && !Array.isArray(result.data)) {
      if (!('message' in result.data) && result.message) {
        result.data.message = result.message;
      }
    }
    return result.data;
  }
  return result;
};

export const apiService = {
  /**
   * GET — Obtiene colecciones de datos, con soporte para paginación y filtros
   * @param {string} endpoint - Ruta relativa del recurso (ej: '/api/startups')
   * @param {object} params - Parámetros de consulta opcionales (page, limit, search)
   * @param {string} token - JWT Token de la sesión activa
   */
  async getAll(endpoint, params = {}, token) {
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    
    // Anexamos parámetros de consulta de forma dinámica si están definidos
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        url.searchParams.append(key, params[key]);
      }
    });

    const headers = {
      'Content-Type': 'application/json'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result.message || 'Error al obtener los registros del servidor.');
    }

    return unpackResponse(result);
  },

  /**
   * GET — Obtiene un único recurso
   * @param {string} endpoint - Ruta relativa del recurso (ej: '/api/identity/hacienda/123456789')
   * @param {string} token - JWT Token de la sesión activa
   */
  async getOne(endpoint, token) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result.message || 'Error al obtener el recurso del servidor.');
    }

    return unpackResponse(result);
  },

  /**
   * POST — Crea un nuevo registro en la colección
   * @param {string} endpoint - Ruta relativa del recurso (ej: '/api/startups')
   * @param {object} data - Datos del recurso a crear
   * @param {string} token - JWT Token de la sesión activa
   */
  async create(endpoint, data, token) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result.message || (result.errors && result.errors[0]?.msg) || 'Error al guardar el nuevo registro.');
    }

    return unpackResponse(result);
  },

  /**
   * PUT — Actualiza un registro existente mediante su ID
   * @param {string} endpoint - Ruta relativa del recurso (ej: '/api/startups')
   * @param {string|number} id - Identificador del registro a modificar
   * @param {object} data - Datos actualizados del recurso
   * @param {string} token - JWT Token de la sesión activa
   */
  async update(endpoint, id, data, token) {
    const url = `${API_BASE_URL}${endpoint}/${id}`;
    
    const headers = {
      'Content-Type': 'application/json'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data)
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result.message || (result.errors && result.errors[0]?.msg) || 'Error al actualizar el registro.');
    }

    return unpackResponse(result);
  },

  /**
   * DELETE — Remueve de forma permanente un recurso
   * @param {string} endpoint - Ruta relativa del recurso (ej: '/api/startups')
   * @param {string|number} id - Identificador del registro a eliminar
   * @param {string} token - JWT Token de la sesión activa
   */
  async delete(endpoint, id, token) {
    const url = `${API_BASE_URL}${endpoint}/${id}`;
    
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: 'DELETE',
      headers
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result.message || 'Error al eliminar el registro en el servidor.');
    }

    return unpackResponse(result);
  }
};
