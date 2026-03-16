import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import { useAuth } from '../context/AuthContext';
import messageApi from '../api/messageApi';
import socket from '../websocket/socket';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      // Don't fetch users - they will come via WebSocket
      // Just initialize WebSocket connection
      const userId = localStorage.getItem('userId');
      if (userId) {
        socket.connect(userId, handleWebSocketMessage);
      }
      
      // Initialize with empty users array
      setUsers([]);
      setLoading(false);
    }

    return () => {
      // Safe disconnect
      socket.disconnect();
    };
  }, [token]);


  const handleWebSocketMessage = (message) => {
    try {
      const receivedMessage = JSON.parse(message.body);
      
      // Check if this is a user list update or new user notification
      if (receivedMessage.type === 'USER_JOINED' || receivedMessage.type === 'USER_LIST') {
        console.log('User list update received:', receivedMessage);
        // Update users list from WebSocket message
        if (receivedMessage.users) {
          setUsers(receivedMessage.users);
        } else if (receivedMessage.user) {
          // Add single new user to the list
          setUsers(prev => {
            const exists = prev.find(u => u.id === receivedMessage.user.id);
            if (!exists) {
              return [...prev, receivedMessage.user];
            }
            return prev;
          });
        }
      } else {
        // Regular chat message
        setMessages(prev => [...prev, receivedMessage]);
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  };

  const handleSelectUser = async (user) => {
    setSelectedUser(user);
    setChatLoading(true);
    setMessages([]);

    try {
      // Get current user ID from token or storage
      const currentUserId = localStorage.getItem('userId');
      
      if (!currentUserId) {
        console.error('Current user ID not found');
        setMessages([]);
        setChatLoading(false);
        return;
      }

      // Get chat history between current user and selected user
      console.log('Fetching chat history between', currentUserId, 'and', user.id);
      const response = await messageApi.getChatHistory(currentUserId, user.id);
      
      if (response && response.data) {
        console.log('Chat history loaded:', response.data.length, 'messages');
        setMessages(response.data);
      } else {
        console.log('No chat history found - empty messages array');
        setMessages([]);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      setMessages([]); // Show empty messages on error
    } finally {
      setChatLoading(false);
    }
  };

  const handleSendMessage = async (content) => {
    if (!selectedUser || !content.trim()) return;

    try {
      // Get current user ID
      const currentUserId = localStorage.getItem('userId');
      
      if (!currentUserId) {
        console.error('Current user ID not found');
        return;
      }

      const messageData = {
        senderId: currentUserId,
        receiverId: selectedUser.id,
        content: content,
        messageType: 'TEXT',
      };

      // Send via WebSocket (recommended)
      socket.send('/app/chat.send', messageData);
      
      // Also send via REST API as fallback
      const sentMessage = await messageApi.sendMessage(messageData);
      setMessages(prev => [...prev, sentMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="h-screen flex">
      <Sidebar
        users={users}
        selectedUser={selectedUser}
        onSelectUser={handleSelectUser}
        loading={loading}
      />
      <ChatWindow
        selectedUser={selectedUser}
        messages={messages}
        onSendMessage={handleSendMessage}
        loading={chatLoading}
      />
    </div>
  );
};

export default Dashboard;
