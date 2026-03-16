import api from './axios';

export const userApi = {
  // Get all users
  getAllUsers: async () => {
    const response = await api.get('/api/users');
    return response.data;
  },

  // Get user by ID - GET /api/users/{userId}
  getUserById: async (userId) => {
    const response = await api.get(`/api/users/${userId}`);
    return response.data;
  },

  // Get user by email - GET /api/users/by-email?email={email}
  getUserByEmail: async (email) => {
    const response = await api.get(`/api/users/by-email?email=${encodeURIComponent(email)}`);
    return response.data;
  },
};

export default userApi;
