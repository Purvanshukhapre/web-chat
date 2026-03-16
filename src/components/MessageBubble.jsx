import { formatTime, formatMessageStatus } from '../utils/formatTime';

const MessageBubble = ({ message, isOwnMessage }) => {
  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl shadow-sm ${
          isOwnMessage
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-gray-200 text-gray-800 rounded-bl-none'
        }`}
      >
        <p className="text-sm md:text-base break-words">{message.content}</p>
        <div className={`text-xs mt-1 flex items-center justify-end space-x-1 ${
          isOwnMessage ? 'text-blue-100' : 'text-gray-500'
        }`}>
          <span>{formatTime(message.timestamp)}</span>
          {isOwnMessage && (
            <span className="text-xs">{formatMessageStatus(message.status)}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
