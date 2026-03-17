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
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);
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
      // Handle typing indicator
      if (message.type === 'TYPING') {
        const typingData = message.data;
        const currentUserId = localStorage.getItem('userId');
        
        if (selectedUser && typingData.senderId === selectedUser.id && typingData.receiverId === currentUserId) {
          console.log('✅ Other user is typing:', typingData);
          setIsOtherUserTyping(typingData.isTyping);
          
          // Clear typing indicator after 2 seconds
          if (typingData.isTyping) {
            setTimeout(() => {
              setIsOtherUserTyping(false);
            }, 2000);
          }
        }
        return;
      }
      
      const receivedMessage = JSON.parse(message.body);
      
      console.log('📨 Raw WebSocket message:', message);
      console.log('📨 Parsed message:', receivedMessage);
      
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
      } else if (receivedMessage.senderId && receivedMessage.receiverId && receivedMessage.content) {
        // This is a chat message - verify it's for the current conversation
        const currentUserId = localStorage.getItem('userId');
        
        // Only add message if it's part of the current conversation
        if (
          (receivedMessage.senderId === currentUserId || receivedMessage.receiverId === currentUserId) &&
          selectedUser && (receivedMessage.senderId === selectedUser.id || receivedMessage.receiverId === selectedUser.id)
        ) {
          console.log('✅ Adding chat message to UI:', receivedMessage);
          
          setMessages(prev => {
            // Check if this message already exists (avoid duplicates)
            const exists = prev.find(msg => msg.id === receivedMessage.id);
            if (exists) {
              // Update existing message (e.g., status update)
              console.log('🔄 Updating existing message');
              return prev.map(msg => 
                msg.id === receivedMessage.id ? { ...msg, ...receivedMessage } : msg
              );
            }
            // Add new message and sort by timestamp
            console.log('➕ Adding new message');
            const updatedMessages = [...prev, receivedMessage];
            // Sort to ensure correct order (oldest to newest)
            return updatedMessages.sort((a, b) => {
              const timeA = new Date(a.timestamp).getTime();
              const timeB = new Date(b.timestamp).getTime();
              return timeA - timeB;
            });
          });
        } else {
          console.log('⚠️ Message not for current conversation');
        }
      } else {
        console.log('⚠️ Unknown message type:', receivedMessage);
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
        
        // Sort messages by timestamp (oldest first, newest last)
        const sortedMessages = [...response.data].sort((a, b) => {
          const timeA = new Date(a.timestamp).getTime();
          const timeB = new Date(b.timestamp).getTime();
          return timeA - timeB; // Ascending order: oldest to newest
        });
        
        setMessages(sortedMessages);
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

      console.log('Sending message via WebSocket:', messageData);
      
      // Optimistically add message to UI immediately
      const optimisticMessage = {
        ...messageData,
        id: `temp-${Date.now()}`,
        status: 'SENT',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => {
        const updatedMessages = [...prev, optimisticMessage];
        // Sort to maintain correct order
        return updatedMessages.sort((a, b) => {
          const timeA = new Date(a.timestamp).getTime();
          const timeB = new Date(b.timestamp).getTime();
          return timeA - timeB;
        });
      });
      
      // Send via WebSocket ONLY (as per API documentation)
      const sent = socket.send('/app/chat.send', messageData);
      
      if (!sent) {
        console.error('Failed to send message via WebSocket');
        // Remove optimistic message on failure
        setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
        alert('Unable to send message. Please check your connection.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
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
        isOtherUserTyping={isOtherUserTyping}
      />
    </div>
  );
};

export default Dashboard;
