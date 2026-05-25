import { apiService } from './apiService';

/**
 * investorService.js — Capa de servicio específica para la entidad de Inversores
 */
export const investorService = {
  getAll(params, token) {
    return apiService.getAll('/api/inversores', params, token);
  },
  create(data, token) {
    return apiService.create('/api/inversores', data, token);
  },
  update(id, data, token) {
    return apiService.update('/api/inversores', id, data, token);
  },
  delete(id, token) {
    return apiService.delete('/api/inversores', id, token);
  }
};
