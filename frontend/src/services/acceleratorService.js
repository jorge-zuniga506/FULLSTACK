import { apiService } from './apiService';

/**
 * acceleratorService.js — Capa de servicio específica para la entidad de Aceleradoras
 */
export const acceleratorService = {
  getAll(params, token) {
    return apiService.getAll('/api/aceleradoras', params, token);
  },
  create(data, token) {
    return apiService.create('/api/aceleradoras', data, token);
  },
  update(id, data, token) {
    return apiService.update('/api/aceleradoras', id, data, token);
  },
  delete(id, token) {
    return apiService.delete('/api/aceleradoras', id, token);
  }
};
