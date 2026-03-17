import { formatTime, formatMessageStatus } from '../utils/formatTime';

const MessageBubble = ({ message, isOwnMessage }) => {
  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-3 group`}>
      <div
        className={`relative max-w-[75%] md:max-w-md lg:max-w-lg px-4 py-2.5 rounded-2xl shadow-sm transition-all duration-200 ${
          isOwnMessage
            ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-md'
            : 'bg-white text-gray-800 rounded-bl-md border border-gray-100 hover:shadow-md'
        }`}
      >
        {/* Message content */}
        <p className="text-sm md:text-base break-words leading-relaxed">{message.content}</p>
        
        {/* Timestamp and status */}
        <div className={`flex items-center justify-end mt-1.5 space-x-1.5 ${
          isOwnMessage ? 'text-blue-100' : 'text-gray-400'
        }`}>
          <span className="text-xs font-medium">
            {formatTime(message.timestamp)}
          </span>
          {isOwnMessage && message.status && (
            <span className="text-xs">
              {formatMessageStatus(message.status)}
            </span>
          )}
        </div>
        
        {/* Small triangle indicator */}
        <div className={`absolute -bottom-2 w-3 h-3 ${
          isOwnMessage 
            ? '-right-1 bg-gradient-to-br from-blue-600 to-blue-700' 
            : '-left-1 bg-white border-l border-b border-gray-100'
        }`} style={{ clipPath: isOwnMessage 
          ? 'polygon(0 0, 0% 100%, 100% 0)' 
          : 'polygon(0 0, 100% 0, 100% 100%)'
        }}></div>
      </div>
    </div>
  );
};

export default MessageBubble;
