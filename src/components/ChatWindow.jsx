import { useState, useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';

const ChatWindow = ({ selectedUser, messages, onSendMessage, loading }) => {
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  useEffect(() => {
    // Scroll to bottom after a short delay to ensure DOM is updated
    const timeout = setTimeout(() => {
      scrollToBottom();
    }, 100);
    return () => clearTimeout(timeout);
  }, [messages]);

  // Scroll to bottom on initial load
  useEffect(() => {
    if (messages.length > 0) {
      const initialTimeout = setTimeout(() => {
        scrollToBottom();
      }, 200);
      return () => clearTimeout(initialTimeout);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (messageText.trim() && onSendMessage) {
      onSendMessage(messageText);
      setMessageText('');
    }
  };

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-600 mb-2">Select a chat to start messaging</h2>
          <p className="text-gray-500">Choose a contact from the sidebar to begin a conversation</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 flex flex-col bg-gray-50">
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="animate-pulse flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/6 mt-2"></div>
            </div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-500">Loading messages...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Chat Header */}
      <div className="px-4 py-3 bg-white border-b border-gray-200 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={selectedUser.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser.username || selectedUser.name)}&background=e0e7ff&color=2563eb&size=128`}
              alt={selectedUser.username || selectedUser.name}
              className="w-10 h-10 rounded-full object-cover shadow-sm"
            />
            {selectedUser.isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 truncate">{selectedUser.username || selectedUser.name}</h3>
            <p className="text-xs text-gray-500 font-medium">
              {selectedUser.isOnline ? (
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>
                  Online
                </span>
              ) : (
                `Last seen ${new Date(selectedUser.lastSeen).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div 
        className="flex-1 overflow-y-auto px-4 py-6 space-y-3 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PCEtLSBQYXR0ZXJuIC0tPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjEuNSIgZmlsbD0iI2U1ZTdlYiIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==')]"
        style={{ scrollBehavior: 'smooth' }}
      >
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center max-w-md px-4">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">Start the Conversation</h3>
              <p className="text-gray-500">Send a message to begin chatting with {selectedUser.username || selectedUser.name}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message, index) => {
              const currentUserId = localStorage.getItem('userId');
              const isOwnMessage = message.senderId === currentUserId;
              
              return (
                <MessageBubble
                  key={message.id || message._id || index}
                  message={message}
                  isOwnMessage={isOwnMessage}
                />
              );
            })}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSubmit} className="bg-white border-t border-gray-200 px-4 py-3">
        <div className="flex items-center space-x-2 max-w-4xl mx-auto">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 px-5 py-3 bg-gray-100 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 text-gray-800 placeholder-gray-400"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
          />
          <button
            type="submit"
            className={`rounded-full p-3 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md ${
              messageText.trim() 
                ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            disabled={!messageText.trim()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;
