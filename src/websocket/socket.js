import { Client } from '@stomp/stompjs';

const WS_URL = 'wss://vibechat-production-24a1.up.railway.app/ws-chat';

class SocketService {
  constructor() {
    this.stompClient = null;
    this.connected = false;
    this.userId = null;
    this.typingSubscriptions = new Map(); // Store typing subscriptions by chat
  }

  connect = (userId, onMessageReceived) => {
    if (this.connected) {
      console.log('WebSocket already connected');
      return;
    }

    this.userId = userId;
    console.log('Opening Web Socket...');

    try {
      this.stompClient = new Client({
        brokerURL: WS_URL,
        reconnectDelay: 5000,
        onConnect: () => {
          this.connected = true;
          console.log('✅ WebSocket Connected');
          
          // Subscribe to receive private messages
          if (onMessageReceived && this.userId) {
            this.stompClient.subscribe('/user/queue/messages', (message) => {
              const msg = JSON.parse(message.body);
              console.log('📬 Received message:', msg);
              onMessageReceived(msg);
            });
            
            // Subscribe to typing indicators
            this.stompClient.subscribe('/user/queue/typing', (message) => {
              const typingData = JSON.parse(message.body);
              console.log('⌨️ Typing indicator:', typingData);
              if (onMessageReceived) {
                onMessageReceived({ type: 'TYPING', data: typingData });
              }
            });
            
            // Subscribe to status updates
            this.stompClient.subscribe('/user/queue/status', (message) => {
              const msg = JSON.parse(message.body);
              console.log('📊 Status update:', msg);
            });
            
            // Subscribe to user list updates
            this.stompClient.subscribe('/topic/users', (message) => {
              const userUpdate = JSON.parse(message.body);
              console.log('👥 User list update:', userUpdate);
              if (onMessageReceived) {
                onMessageReceived(message);
              }
            });
          }
        },
        onStompError: (frame) => {
          console.error('❌ STOMP Error:', frame);
          this.connected = false;
        },
        onClose: () => {
          console.log('WebSocket Closed');
          this.connected = false;
        },
      });

      this.stompClient.activate();
    } catch (error) {
      console.error('WebSocket connection error:', error);
    }
  };

  send = (destination, message) => {
    if (this.stompClient && this.connected) {
      this.stompClient.publish({
        destination,
        body: JSON.stringify(message),
      });
      console.log('📤 Sent message to', destination);
      return true; // Successfully sent
    } else {
      console.warn('Cannot send message - WebSocket not connected');
      return false; // Failed to send
    }
  };

  // Send typing indicator
  sendTypingIndicator = (senderId, receiverId, isTyping) => {
    if (this.stompClient && this.connected) {
      const typingData = {
        senderId,
        receiverId,
        isTyping,
        timestamp: new Date().toISOString()
      };
      
      this.stompClient.publish({
        destination: '/app/chat.typing',
        body: JSON.stringify(typingData),
      });
      console.log('⌨️ Sent typing indicator:', typingData);
      return true;
    } else {
      console.warn('Cannot send typing indicator - WebSocket not connected');
      return false;
    }
  };

  disconnect = () => {
    if (this.stompClient && this.connected) {
      console.log('>>> DISCONNECT');
      this.stompClient.deactivate();
      this.connected = false;
    }
  };
}

export default new SocketService();
