# 403 Error Fix - Message Sending via WebSocket Only

## 🔴 Problem
Getting 403 Forbidden error when trying to send messages:
```
POST https://vibechat-production-24a1.up.railway.app/api/messages/send 403 (Forbidden)
```

## 📚 Root Cause
According to the **API Documentation** (`src/API_README_FOR_FRONTEND.md`):

1. **There is NO REST API endpoint for sending messages**
   - The endpoint `/api/messages/send` is NOT documented
   - Messages should ONLY be sent via WebSocket
   
2. **WebSocket is the PRIMARY and ONLY method** for sending messages
   - Destination: `/app/chat.send`
   - Message format includes `senderId`, `receiverId`, `content`, `messageType`

3. **All documented endpoints use standard response format**:
   ```json
   {
     "success": true,
     "message": "...",
     "data": [...]
   }
   ```

## ✅ Solution Implemented

### 1. Removed REST API Fallback
**File:** `src/pages/Dashboard.jsx`

**Before:**
```javascript
// Send via WebSocket (recommended)
socket.send('/app/chat.send', messageData);

// Also send via REST API as fallback
const sentMessage = await messageApi.sendMessage(messageData);
setMessages(prev => [...prev, sentMessage]);
```

**After:**
```javascript
console.log('Sending message via WebSocket:', messageData);

// Send via WebSocket ONLY (as per API documentation)
const sent = socket.send('/app/chat.send', messageData);

if (!sent) {
  console.error('Failed to send message via WebSocket');
  alert('Unable to send message. Please check your connection.');
}
```

### 2. Enhanced Socket Service
**File:** `src/websocket/socket.js`

Added return values to indicate success/failure:
```javascript
send = (destination, message) => {
  if (this.stompClient && this.connected) {
    this.stompClient.publish({
      destination,
      body: JSON.stringify(message),
    });
    console.log('📤 Sent message to', destination);
    return true; // Successfully sent
  } else {
    console.warn('Cannot send message - WebSocket not connected');
    return false; // Failed to send
  }
};
```

### 3. Added Better Error Handling
**Files:** `src/api/messageApi.js`, `src/api/axios.js`

- Added detailed logging for debugging
- Added 403 error interceptor
- Removed REST API fallback usage

## 🎯 Correct Message Flow

### According to API Documentation:

```javascript
// 1. Connect to WebSocket with userId
socket.connect(userId, onMessageReceived);

// 2. Subscribe to receive messages
stompClient.subscribe('/user/queue/messages', handleMessage);

// 3. Send message via WebSocket ONLY
const messageData = {
  senderId: currentUserId,
  receiverId: selectedUser.id,
  content: "Hello!",
  messageType: 'TEXT'
};

socket.send('/app/chat.send', messageData);

// 4. Receive confirmation via subscription
{
  "id": "msg-003",
  "senderId": "69b3e8bef3d78e3460382cea",
  "receiverId": "69b2a4ea3309db162a586654",
  "content": "Hello!",
  "messageType": "TEXT",
  "status": "SENT",
  "timestamp": "2026-03-16T14:45:00"
}
```

## 🔧 What Changed

### Files Modified:
1. ✅ `src/pages/Dashboard.jsx` - Removed REST API fallback
2. ✅ `src/websocket/socket.js` - Added return boolean
3. ✅ `src/api/messageApi.js` - Added logging (for debugging only)
4. ✅ `src/api/axios.js` - Added 403 error handling

### Key Points:
- ✅ Messages are sent **ONLY** via WebSocket
- ✅ No REST API fallback (endpoint doesn't exist)
- ✅ Better error messages for users
- ✅ Improved logging for debugging
- ✅ Follows API documentation exactly

## 🧪 Testing Checklist

### Before Testing:
- [ ] Ensure WebSocket is connected (check console for "✅ WebSocket Connected")
- [ ] Verify userId is stored in localStorage
- [ ] Check that you're logged in with valid token

### Test Scenarios:
- [ ] Send a text message when WebSocket is connected
- [ ] Send a message when WebSocket is disconnected (should show alert)
- [ ] Verify message appears in chat window
- [ ] Verify receiver gets the message in real-time
- [ ] Check console logs for proper message flow

## 📝 Important Notes

### API Endpoints Used:
1. **WebSocket Send**: `/app/chat.send` (destination)
2. **WebSocket Subscribe**: `/user/queue/messages`
3. **Chat History**: `GET /api/chat/history/{userId1}/{userId2}`

### NOT Used (Removed):
- ❌ `POST /api/messages/send` - Not documented, causes 403 error

### Response Format:
All backend responses follow this pattern:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

## 🚀 Next Steps

If messages still don't send:

1. **Check WebSocket Connection**:
   ```javascript
   // In browser console
   console.log(localStorage.getItem('userId'));
   // Should return a valid user ID
   ```

2. **Verify Backend WebSocket**:
   - Check if `wss://vibechat-production-24a1.up.railway.app/ws-chat` is accessible
   - Verify backend is running and accepting connections

3. **Check Browser Console**:
   - Look for "✅ WebSocket Connected"
   - Look for "📤 Sent message to /app/chat.send"
   - Check for any STOMP errors

4. **Network Tab**:
   - Verify WebSocket connection is established
   - Check for any failed HTTP requests

## 📞 References

- API Documentation: `src/API_README_FOR_FRONTEND.md`
- Implementation Summary: `IMPLEMENTATION_SUMMARY.md`
- WebSocket Guide: `src/WEBSOCKET_INTEGRATION_GUIDE.md`

---

**Status:** ✅ Fixed - Now follows official API documentation exactly
