import api from './axios';

export const authApi = {
  // Register new user - POST /api/users/register
  register: async (userData) => {
    const response = await api.post('/api/users/register', userData);
    return response.data;
  },

  // Login user - POST /api/users/login
  login: async (credentials) => {
    const response = await api.post('/api/users/login', credentials);
    return response.data;
  },
};

export default authApi;
