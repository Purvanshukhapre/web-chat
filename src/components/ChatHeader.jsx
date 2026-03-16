const ChatHeader = ({ user }) => {
  return (
    <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center">
        <div className="relative">
          <img
            src={user.profilePicture || 'https://via.placeholder.com/40'}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
        <div className="ml-3">
          <h3 className="font-semibold text-gray-900">{user.name}</h3>
          <p className="text-xs text-gray-500">{user.isOnline ? 'Online' : 'Offline'}</p>
        </div>
      </div>
      <div className="flex space-x-4">
        <button className="text-gray-600 hover:text-blue-600 transition">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
          </svg>
        </button>
        <button className="text-gray-600 hover:text-blue-600 transition">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;