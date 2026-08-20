import { api } from './api';

export const adminService = {
  listUsers: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const res = await api.get(`/admin/users?${params}`);
    return res.data.data;
  },

  verifyUser: async (id, verified = true) => {
    const res = await api.patch(`/admin/users/${id}/verify`, { verified });
    return res.data.data;
  },

  getStats: async () => {
    const res = await api.get('/admin/stats');
    return res.data.data;
  },
};
