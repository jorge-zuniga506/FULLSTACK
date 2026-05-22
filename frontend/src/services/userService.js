import { apiService } from './apiService';

/**
 * userService.js — Capa de servicio específica para la entidad de Usuarios
 */
export const userService = {
  getAll(params, token) {
    return apiService.getAll('/api/users', params, token);
  },
  create(data, token) {
    return apiService.create('/api/users', data, token);
  },
  update(id, data, token) {
    return apiService.update('/api/users', id, data, token);
  },
  delete(id, token) {
    return apiService.delete('/api/users', id, token);
  }
};
