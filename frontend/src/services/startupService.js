import { apiService } from './apiService';

/**
 * startupService.js — Capa de servicio específica para la entidad de Startups
 *
 * Encapsula de forma estricta los endpoints, rutas y lógica del CRUD
 * de Startups en el frontend, delegando en apiService.js.
 */
export const startupService = {
  /**
   * Obtiene la lista de Startups (paginada y filtrable)
   * @param {object} params - Parámetros de consulta (page, limit, search)
   * @param {string} token - JWT Token de la sesión
   */
  getAll(params, token) {
    return apiService.getAll('/api/startups', params, token);
  },

  /**
   * Registra una nueva Startup en el servidor
   * @param {object} data - Datos de la Startup
   * @param {string} token - JWT Token de la sesión
   */
  create(data, token) {
    return apiService.create('/api/startups', data, token);
  },

  /**
   * Actualiza los datos de una Startup existente
   * @param {string|number} id - Identificador de la Startup
   * @param {object} data - Datos actualizados
   * @param {string} token - JWT Token de la sesión
   */
  update(id, data, token) {
    return apiService.update('/api/startups', id, data, token);
  },

  /**
   * Elimina de forma definitiva una Startup
   * @param {string|number} id - Identificador de la Startup a borrar
   * @param {string} token - JWT Token de la sesión
   */
  delete(id, token) {
    return apiService.delete('/api/startups', id, token);
  }
};
