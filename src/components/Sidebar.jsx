import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ users, selectedUser, onSelectUser, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { user: currentUser, logout } = useAuth();

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
        <div className="p-4 border-b border-gray-200">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="flex-1 p-4 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse flex space-x-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full md:w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header with current user */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-blue-600">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <img
              src={currentUser?.profilePicture || 'https://via.placeholder.com/40'}
              alt={currentUser?.name}
              className="w-10 h-10 rounded-full border-2 border-white"
            />
            <div>
              <h3 className="text-white font-semibold">{currentUser?.name}</h3>
              <p className="text-blue-100 text-xs">Online</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="text-white hover:bg-blue-700 p-2 rounded-lg transition"
            title="Logout"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search users..."
          className="w-full px-4 py-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-full border border-white border-opacity-30 text-white placeholder-blue-100 focus:outline-none focus:ring-2 focus:ring-white focus:bg-white focus:text-gray-800 transition"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Users List */}
      <div className="flex-1 overflow-y-auto">
        {filteredUsers.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No users found
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              className={`flex items-center p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition ${
                selectedUser?.id === user.id ? 'bg-blue-50' : ''
              }`}
              onClick={() => onSelectUser(user)}
            >
              <div className="relative">
                <img
                  src={user.profilePicture || 'https://via.placeholder.com/48'}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                {user.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-900 truncate">{user.name}</h3>
                  <span className="text-xs text-gray-500 ml-2">
                    {user.lastMessageTime || 'Just now'}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-sm text-gray-600 truncate">
                    {user.lastMessage || 'Start a conversation'}
                  </p>
                  {user.unreadCount > 0 && (
                    <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ml-2">
                      {user.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Sidebar;
