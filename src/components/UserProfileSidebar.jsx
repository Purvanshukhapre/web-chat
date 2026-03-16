import FileCard from './FileCard';

const UserProfileSidebar = ({ user, onClose }) => {
  // In a real app, you would fetch shared files from the API
  const sharedFiles = user.sharedFiles || [
    {
      id: 1,
      name: "Project_Document.pdf",
      size: "2.4 MB",
      date: "2 days ago",
      type: "PDF"
    },
    {
      id: 2,
      name: "Meeting_Notes.docx",
      size: "1.1 MB",
      date: "1 week ago",
      type: "DOCX"
    },
    {
      id: 3,
      name: "Financial_Report.xlsx",
      size: "3.7 MB",
      date: "2 weeks ago",
      type: "XLSX"
    }
  ];

  return (
    <div className="w-80 bg-white border-l border-gray-200 h-full shadow-md flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Contact Info</h2>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* User Profile Section */}
      <div className="p-6 border-b border-gray-200 text-center">
        <div className="relative mx-auto mb-4">
          <img
            src={user.profilePicture || 'https://via.placeholder.com/96'}
            alt={user.name}
            className="w-24 h-24 rounded-full object-cover mx-auto"
          />
          <div className="absolute bottom-2 right-6 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
        <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
        <p className="text-gray-600">{user.role || 'User'}</p>
        <div className="mt-4 flex justify-center space-x-4">
          <button className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
            </svg>
          </button>
          <button className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 2a1 1 0 00-2 0v3H7a1 1 0 000 2h1v3a1 1 0 102 0V9h1a1 1 0 100-2h-1V4z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Shared Files Section */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-3">Shared Files</h3>
        <div className="space-y-3">
          {sharedFiles.map(file => (
            <FileCard key={file.id} file={file} />
          ))}
        </div>
      </div>

      {/* Contact Settings Section */}
      <div className="p-4 flex-1">
        <h3 className="font-semibold text-gray-800 mb-3">Contact Settings</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Mute notifications</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Search in Conversation</span>
            <button className="text-blue-500 hover:text-blue-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <div className="pt-4 border-t border-gray-200">
            <button className="text-red-500 hover:text-red-700 font-medium w-full text-left">
              Block this contact
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileSidebar;