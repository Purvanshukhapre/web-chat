import api from './axios';

export const messageApi = {
  // Send message via WebSocket (recommended) or REST API fallback
  sendMessage: async (messageData) => {
    const response = await api.post('/api/messages/send', messageData);
    return response.data;
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
