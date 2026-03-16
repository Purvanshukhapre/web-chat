import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import userApi from '../api/userApi';

const Sidebar = ({ users, selectedUser, onSelectUser, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const { user: currentUser, logout } = useAuth();

  // Filter users based on search term (client-side for empty search)
  const filteredUsers = searchTerm.trim() === '' 
    ? users 
    : searchResults.length > 0 
      ? searchResults 
      : users.filter(user =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );

  // Search users by name when searchTerm changes
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.trim() !== '') {
        setIsSearching(true);
        try {
          const response = await userApi.searchUsersByName(searchTerm);
          // API returns { success: true, message: '...', data: [...] }
          setSearchResults(response.data || []);
        } catch (error) {
          console.error('Error searching users:', error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

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
    <div className="w-full md:w-80 bg-white border-r border-gray-200 flex flex-col h-full shadow-lg">
      {/* Header with current user */}
      <div className="p-5 border-b border-gray-200 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src={currentUser?.profilePicture || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(currentUser?.name || 'User') + '&background=ffffff&color=2563eb&size=128'}
                alt={currentUser?.name}
                className="w-11 h-11 rounded-full border-2 border-white shadow-md object-cover"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div>
              <h3 className="text-white font-bold text-base">{currentUser?.name}</h3>
              <p className="text-blue-100 text-xs font-medium flex items-center mt-0.5">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5"></span>
                Online
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="text-white hover:bg-blue-700 p-2.5 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-sm"
            title="Logout"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-blue-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search users by name..."
            className="w-full pl-10 pr-10 py-2.5 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/30 focus:border-white/50 transition-all duration-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {isSearching && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Users List */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        {filteredUsers.length === 0 && !isSearching ? (
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-200 rounded-full mb-3">
              <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">{searchTerm.trim() !== '' ? 'No users found' : 'No users available'}</p>
            {searchTerm.trim() !== '' && (
              <p className="text-gray-400 text-sm mt-1">Try a different search term</p>
            )}
          </div>
        ) : isSearching ? (
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-3">
              <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p className="text-gray-600 font-medium">Searching...</p>
            <p className="text-gray-400 text-sm mt-1">Finding users by name</p>
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              className={`group flex items-center p-4 mx-3 my-2 rounded-2xl border transition-all duration-200 cursor-pointer ${
                selectedUser?.id === user.id 
                  ? 'bg-blue-50 border-blue-300 shadow-md scale-[1.02]' 
                  : 'bg-white border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-white hover:border-blue-200 hover:shadow-sm'
              }`}
              onClick={() => onSelectUser(user)}
            >
              <div className="relative flex-shrink-0">
                <img
                  src={user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username || user.name)}&background=e0e7ff&color=2563eb&size=128`}
                  alt={user.username || user.name}
                  className="w-14 h-14 rounded-2xl object-cover shadow-sm group-hover:shadow-md transition-shadow duration-200"
                />
                {user.isOnline && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-3 border-white animate-pulse shadow-sm"></div>
                )}
              </div>
              <div className="ml-4 flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h3 className={`font-bold text-base truncate ${selectedUser?.id === user.id ? 'text-blue-700' : 'text-gray-800 group-hover:text-blue-700'}`}>{user.username || user.name}</h3>
                  <span className={`text-xs font-medium ml-2 px-2 py-1 rounded-full ${
                    selectedUser?.id === user.id 
                      ? 'text-blue-600 bg-blue-100' 
                      : 'text-gray-400 group-hover:text-blue-600 group-hover:bg-blue-50'
                  }`}>
                    {user.lastMessageTime || 'Now'}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1.5">
                  <p className={`text-sm truncate max-w-[160px] ${
                    selectedUser?.id === user.id 
                      ? 'text-blue-600 font-medium' 
                      : 'text-gray-500 group-hover:text-blue-600'
                  }`}>
                    {user.lastMessage || 'Start a conversation'}
                  </p>
                  {user.unreadCount > 0 && (
                    <span className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-md animate-pulse">
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
