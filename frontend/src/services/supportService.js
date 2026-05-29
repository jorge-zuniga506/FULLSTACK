import { apiService } from './apiService';

export const supportService = {
  createReport(data, token) {
    return apiService.create('/api/support/reportes', data, token);
  },

  getMyReports(params, token) {
    return apiService.getAll('/api/support/mis-reportes', params, token);
  },

  getAdminReports(params, token) {
    return apiService.getAll('/api/support/reportes', params, token);
  },

  updateReportStatus(id, data, token) {
    return apiService.patch('/api/support/reportes', id + '/estado', data, token);
  }
};
