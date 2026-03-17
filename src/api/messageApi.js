import api from './axios';

export const messageApi = {
  // Send message via WebSocket (recommended) or REST API fallback
  sendMessage: async (messageData) => {
    try {
      const token = localStorage.getItem('token');
      console.log('Sending message with token:', token ? 'Token exists' : 'No token');
      console.log('Message data:', messageData);
      
      const response = await api.post('/api/messages/send', messageData);
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      throw error;
    }
  },

  // Get chat history between two users - GET /api/chat/history/{userId1}/{userId2}
  getChatHistory: async (userId1, userId2) => {
    const response = await api.get(`/api/chat/history/${userId1}/${userId2}`);
    return response.data;
  },

  // Update message status - PUT /api/messages/{messageId}/status?status={status}
  updateMessageStatus: async (messageId, status) => {
    const response = await api.put(`/api/messages/${messageId}/status?status=${status}`);
    return response.data;
  },
};

export default messageApi;
