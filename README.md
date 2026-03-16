# Chat Application Frontend

A production-ready real-time chat application built with React, Tailwind CSS, and WebSocket integration.

## Features

- 🔐 **JWT Authentication** - Secure login/signup with token-based authentication
- 💬 **Real-time Messaging** - Live chat using WebSocket (STOMP + SockJS)
- 👥 **User Management** - View and search users
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🎨 **Modern UI** - Beautiful interface similar to WhatsApp/Messenger
- ✅ **Message Status** - Track sent, delivered, and read messages
- 🔄 **Auto-scroll** - Automatically scrolls to latest messages
- 🔍 **Search Users** - Find contacts quickly
- 👤 **User Profile** - View and manage profile information

## Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router DOM** - Routing
- **Axios** - HTTP client
- **SockJS** - WebSocket fallback
- **StompJS** - STOMP protocol over WebSocket
- **Context API** - State management

## Project Structure

```
src/
├── api/
│   ├── axios.js           # Axios configuration with interceptors
│   ├── authApi.js         # Authentication API calls
│   ├── userApi.js         # User API calls
│   ├── chatApi.js         # Chat API calls
│   └── messageApi.js      # Message API calls
├── components/
│   ├── Sidebar.jsx        # User list sidebar
│   ├── ChatWindow.jsx     # Chat interface
│   └── MessageBubble.jsx  # Message display component
├── context/
│   └── AuthContext.jsx    # Authentication context provider
├── pages/
│   ├── Login.jsx          # Login page
│   ├── Signup.jsx         # Signup page
│   ├── Dashboard.jsx      # Main chat dashboard
│   └── Profile.jsx        # User profile page
├── routes/
│   ├── AppRoutes.jsx      # Route configuration
│   └── ProtectedRoute.jsx # Protected route wrapper
├── websocket/
│   └── socket.js          # WebSocket service
├── utils/
│   └── formatTime.js      # Time formatting utilities
├── App.jsx                # Main app component
├── main.jsx               # Entry point
└── index.css              # Global styles
```

## Backend API Integration

### Base URL
```
http://chatapp-production-809e.up.railway.app
```

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration

### User Endpoints
- `GET /api/users` - Get all users
- `GET /api/users/profile` - Get current user profile
- `GET /api/users/{userId}` - Get user by ID

### Chat Endpoints
- `GET /api/chats` - Get user's chats
- `GET /api/chats/{chatId}` - Get chat by ID

### Message Endpoints
- `POST /api/messages/send` - Send message
- `GET /api/messages/chat/{chatId}?page=0&size=50` - Get chat messages (paginated)
- `GET /api/messages/chat/{chatId}/all` - Get all messages in chat
- `PUT /api/messages/{messageId}/status?status=READ` - Update message status

### WebSocket Endpoints
- Connect to: `ws://chatapp-production-809e.up.railway.app/ws`
- Subscribe to: `/topic/chat/{chatId}`
- Send to: `/app/sendMessage`

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://chatapp-production-809e.up.railway.app
VITE_WS_URL=ws://chatapp-production-809e.up.railway.app/ws
```

## Usage

### Authentication

1. **Signup**: Create a new account with name, email, mobile, password, and optional profile picture
2. **Login**: Sign in with email/mobile and password
3. JWT token is automatically stored in localStorage and included in all requests

### Chatting

1. Select a user from the sidebar to start chatting
2. Type your message and press send
3. Messages are sent via both REST API and WebSocket
4. Real-time messages appear instantly
5. Message status updates automatically (SENT → DELIVERED → READ)

### Profile

1. Click on your profile picture to view profile details
2. See account information and statistics
3. Option to edit profile or change password

## Key Features Implementation

### JWT Authentication
- Token stored in localStorage
- Automatically attached to all API requests via Axios interceptor
- Auto-redirect to login on 401 errors
- Protected routes check authentication status

### WebSocket Integration
- SockJS for WebSocket connection with fallback support
- StompJS for STOMP protocol messaging
- Auto-reconnection on disconnect
- Subscribe to specific chat topics
- Real-time message broadcasting

### Responsive Design
- Mobile-first approach
- Collapsible sidebar on small screens
- Touch-friendly interface
- Adaptive layouts

### Error Handling
- API error handling with try-catch
- User-friendly error messages
- Loading states for async operations
- Network error recovery

## Code Quality

- **Modular Architecture** - Separated concerns (API, Components, Pages, Context)
- **Reusable Components** - DRY principle
- **Clean Code** - Readable and maintainable
- **Type Safety** - PropTypes where applicable
- **Performance** - Optimized re-renders

## Security

- JWT token authentication
- Secure token storage in localStorage
- Automatic token refresh on expiration
- Protected routes
- Input validation
- XSS prevention best practices

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational purposes.

## Contact

For questions or support, please contact the development team.
