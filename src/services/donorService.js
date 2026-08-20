import { api } from './api';

export const donorService = {
  getMe: async () => {
    const res = await api.get('/donors/me');
    return res.data.data;
  },

  updateMe: async (updates) => {
    const res = await api.patch('/donors/me', updates);
    return res.data.data;
  },

  getDonorById: async (id) => {
    const res = await api.get(`/donors/${id}`);
    return res.data.data;
  },
};
