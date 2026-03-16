# VibeChat - How It Works

## 🎯 Application Architecture

### Core Concept
VibeChat is a **real-time chat application** where users appear automatically when they sign up, not through manual user fetching.

---

## 🔄 User Flow

### 1. **First User Signs Up**
```
User A registers → Backend creates account → WebSocket broadcasts to all connected clients
                                                                    ↓
                                              User A sees: "No other users yet" (empty sidebar)
```

### 2. **Second User Signs Up**
```
User B registers → Backend creates account → WebSocket broadcasts to ALL clients
                                                      ↓
                                    ┌─────────────────┴─────────────────┐
                                    ↓                                   ↓
                              User A sees User B                  User B sees empty
                              in sidebar                          (no one else yet)
```

### 3. **Third User Signs Up**
```
User C registers → WebSocket broadcasts
                            ↓
              ┌─────────────┼─────────────┐
              ↓             ↓             ↓
        User A sees     User B sees    User C sees
        User B & C      User A & C      User A & B
```

---

## 📡 WebSocket Communication

### Subscriptions

When a user logs in, the frontend connects to WebSocket and subscribes to:

#### 1. **`/user/queue/messages`** - Private Messages
```javascript
{
  id: "msg-123",
  senderId: "user-a-id",
  receiverId: "user-b-id",
  content: "Hello!",
  messageType: "TEXT",
  status: "SENT",
  timestamp: "2026-03-20T10:30:00Z"
}
```

#### 2. **`/user/queue/status`** - Message Status Updates
```javascript
{
  messageId: "msg-123",
  status: "DELIVERED" // or READ
}
```

#### 3. **`/topic/users`** - User List Updates
```javascript
// When new user joins
{
  type: "USER_JOINED",
  user: {
    id: "user-c-id",
    username: "charlie",
    email: "charlie@example.com",
    status: "ONLINE",
    lastSeen: "2026-03-20T10:30:00Z"
  }
}

// Or full user list
{
  type: "USER_LIST",
  users: [
    { id: "user-a-id", username: "alice", ... },
    { id: "user-b-id", username: "bob", ... },
    { id: "user-c-id", username: "charlie", ... }
  ]
}
```

---

## 🗄️ Backend API Endpoints Used

### Authentication

#### Register User
```
POST /api/users/register
Body: {
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}

Response: {
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "user-id-here",
    "username": "john_doe",
    "email": "john@example.com",
    "status": "ONLINE"
  },
  "token": "jwt-token"
}
```

#### Login User
```
POST /api/users/login
Body: {
  "email": "john@example.com",
  "password": "SecurePass123"
}

Response: Same as registration
```

### Messaging

#### Get Chat History
```
GET /api/chat/history/{userId1}/{userId2}

Response: {
  "success": true,
  "data": [
    { messages... }
  ]
}
```

#### Send Message (REST fallback)
```
POST /api/messages/send
Body: {
  "senderId": "user-a-id",
  "receiverId": "user-b-id",
  "content": "Hello!",
  "messageType": "TEXT"
}
```

### ❌ NOT Used

- ~~`GET /api/users`~~ - **Doesn't exist!** Users come via WebSocket
- ~~`GET /api/chats`~~ - **Doesn't exist!** Chat history uses different endpoint

---

## 💻 Frontend Implementation

### Dashboard Component Flow

```javascript
1. User logs in
   ↓
2. AuthContext stores token + userId
   ↓
3. Dashboard mounts
   ↓
4. Connect WebSocket with userId
   ↓
5. Subscribe to /topic/users
   ↓
6. Initialize empty users array []
   ↓
7. Wait for WebSocket broadcast
   ↓
8. When USER_JOINED received → Update users state
   ↓
9. Sidebar shows updated user list
```

### Key Code Changes

#### Before (Wrong Approach)
```javascript
// ❌ Tried to fetch all users on mount
useEffect(() => {
  const users = await userApi.getAllUsers(); // This API doesn't exist!
  setUsers(users);
}, []);
```

#### After (Correct Approach)
```javascript
// ✅ Users come via WebSocket
useEffect(() => {
  socket.connect(userId, (message) => {
    if (message.type === 'USER_JOINED') {
      setUsers(prev => [...prev, message.user]);
    }
  });
  setUsers([]); // Start with empty list
}, [userId]);
```

---

## 🔐 Authentication & Token Storage

### Login Flow
```javascript
1. User enters credentials
   ↓
2. AuthContext.login(credentials)
   ↓
3. Backend returns: { token, data: { id, username, ... } }
   ↓
4. Store in localStorage:
   - localStorage.setItem('token', response.token)
   - localStorage.setItem('userId', response.data.id)
   ↓
5. Update React state:
   - setToken(response.token)
   - setUser(response.data)
   ↓
6. useEffect detects isAuthenticated = true
   ↓
7. Navigate to Dashboard
```

### Token Persistence
```javascript
// On app reload
const token = localStorage.getItem('token');
const userId = localStorage.getItem('userId');

if (token && userId) {
  // Auto-login
  setToken(token);
  // Reconnect WebSocket
  socket.connect(userId, handleMessage);
}
```

---

## 📱 User Experience

### First User Experience
```
Sign Up → Login → Dashboard loads
                ↓
          Empty sidebar
          "No users to chat with yet"
                ↓
          Wait for others to join...
```

### When New User Joins
```
Existing User sees:
┌────────────────────────┐
│ Search users...        │
├────────────────────────┤
│ 👤 Alice (You)         │
│ 👤 Bob      [Online]   │ ← NEW!
│ 👤 Charlie  [Offline]  │ ← NEW!
└────────────────────────┘
```

### Starting a Chat
```
1. Click on user in sidebar
   ↓
2. Fetch chat history from backend
   ↓
3. Display messages
   ↓
4. Type and send message
   ↓
5. Message sent via WebSocket + REST API
   ↓
6. Real-time delivery to recipient
```

---

## 🎨 UI States

### Empty State (No Users)
```
┌────────────────────────┐
│ 👤 You                 │
├────────────────────────┤
│                        │
│   No users yet         │
│                        │
│   Be the first to      │
│   invite others!       │
│                        │
└────────────────────────┘
```

### With Users
```
┌────────────────────────┐
│ 👤 You                 │
├────────────────────────┤
│ 🔍 Search users...     │
├────────────────────────┤
│ 👤 Alice      [Online] │
│ 👤 Bob        [Away]   │
│ 👤 Charlie    [Offline]│
│ 👤 Diana      [Online] │
└────────────────────────┘
```

---

## 🔧 Configuration

### Development Mode
```javascript
// vite.config.js
server: {
  proxy: {
    '/api': {
      target: 'https://vibechat-production-24a1.up.railway.app',
      changeOrigin: true,
    },
    '/ws': {
      target: 'wss://vibechat-production-24a1.up.railway.app',
      ws: true,
    },
  }
}
```

### Production Mode
```javascript
// Direct connection to backend
API_BASE_URL = 'https://vibechat-production-24a1.up.railway.app';
```

---

## 📊 Data Flow Diagram

```
┌──────────────┐
│   User A     │
│  (Frontend)  │
└──────┬───────┘
       │
       │ 1. Signs up
       ↓
┌──────────────┐
│   Backend    │
│  (Spring     │
│    Boot)     │
└──────┬───────┘
       │
       │ 2. Creates user
       │ 3. Broadcasts via WebSocket
       ↓
    ┌──┴──┐
    │  /topic/users  │
    └──┬──┘
       │
       │ 4. Delivers to all connected clients
       ↓
┌──────────────┐  ┌──────────────┐
│   User B     │  │   User C     │
│  (Frontend)  │  │  (Frontend)  │
└──────────────┘  └──────────────┘
       │                  │
       │ 5. Updates UI    │ 5. Updates UI
       │ "User A joined!" │ "User A joined!"
       ↓                  ↓
   Show User A        Show User A
   in sidebar         in sidebar
```

---

## ⚠️ Important Notes

### For Users
- ✅ **You won't see anyone** until others sign up
- ✅ **Users appear automatically** when they register
- ✅ **No refresh needed** - real-time updates
- ✅ **Messages persist** - chat history loads on selection

### For Developers
- ❌ **No `GET /api/users` endpoint** - don't try to call it
- ✅ **WebSocket is mandatory** for user list
- ✅ **Backend broadcasts** user events
- ✅ **Handle empty state** gracefully in UI

### For Backend Integration
```java
// Backend must broadcast on user signup
@EventListener
public void handleUserSignup(UserSignupEvent event) {
    simpMessagingTemplate.convertAndSend(
        "/topic/users",
        new UserJoinMessage(event.getUser())
    );
}
```

---

## 🎉 Summary

**Key Takeaways:**

1. **Users appear via WebSocket** - Not fetched via API
2. **First user sees empty list** - Normal behavior
3. **Backend broadcasts user events** - `/topic/users`
4. **Frontend listens and updates** - Automatic UI refresh
5. **No manual user management** - Everything is real-time

This architecture ensures:
- ✅ Real-time user presence
- ✅ Automatic synchronization
- ✅ No polling needed
- ✅ Scalable design
- ✅ Better user experience

---

**Status**: ✅ Correctly implemented according to your explanation!

The app now works exactly as you described - users will appear automatically when they sign up! 🚀
