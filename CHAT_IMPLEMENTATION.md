# Chat Feature Implementation Guide

## Overview
A real-time bidirectional chat system has been implemented using Socket.io, enabling vendors and clients to communicate after a booking has been accepted.

## Features ✨

### 1. **Real-Time Messaging**
- Instant message delivery using Socket.io
- Messages persist in MongoDB database
- Automatic scroll to latest messages

### 2. **Smart Access Control**
- Chat is **ONLY** available when booking status is **"accepted"**
- Prevents unauthorized communication during pending/rejected states
- Secure: verified on both client and server

### 3. **Beautiful UI**
- Gradient header (pink theme: #b14e79 → #8e3e61)
- Responsive design (works on mobile & desktop)
- Dark mode support
- Message bubbles with sender info and timestamp
- Sender differentiation (your messages vs other's messages)

### 4. **User Experience**
- Automatic connection to chat when modal opens
- Graceful cleanup on disconnect
- Smooth animations and transitions
- Prevents empty messages from being sent

---

## Backend Implementation

### New Files Created:

#### 1. **models/ChatMessage.js**
```javascript
- bookingId: Reference to the booking
- senderId: User sending the message
- senderName: Display name
- senderRole: 'user' or 'vendor'
- message: Message content
- isRead: Read status tracking
- timestamps: Created at & updated at
```

#### 2. **controllers/chatController.js**
```javascript
Endpoints:
- getChatMessages(bookingId) - Fetch all messages for a booking
- sendChatMessage() - Save new message (with validation)
- markMessageAsRead() - Mark message as read
```

#### 3. **routes/chatRoutes.js**
```javascript
GET    /api/chat/:bookingId       - Get messages
POST   /api/chat                  - Send message
PUT    /api/chat/:messageId/read  - Mark as read
```

#### 4. **Socket.io Events (in server.js)**
```javascript
- join-chat: User joins a specific chat room
- send-message: Broadcast message to chat room
- receive-message: Receive messages in real-time
- leave-chat: User leaves chat room
- disconnect: Cleanup on disconnect
```

### Updated Files:

#### 1. **server.js**
- Integrated Socket.io with Express
- Set up CORS for real-time communication
- Created event handlers for chat
- Uses `http.createServer()` instead of `app.listen()`

#### 2. **package.json**
- Added `socket.io: ^4.7.2`

---

## Frontend Implementation

### New Files Created:

#### 1. **components/Chat.jsx**
Complete chat component with:
- Message fetching from API
- Socket.io connection management
- Real-time message display
- Message input with form submission
- Auto-scroll to latest messages
- Loading states
- Error handling with toast notifications

### Updated Components:

#### 1. **pages/vendor/VendorBookings.jsx**
- Added `activeChatBooking` state
- Imported Chat component
- Added "Chat" button for accepted bookings
- Chat modal with overlay
- Proper prop passing to Chat component

#### 2. **pages/users/UserProfile.jsx**
- Added `activeChatBooking` state
- Imported Chat component
- Added "Chat" button in bookings tab
- Chat modal with overlay
- Proper prop passing (role="user")

#### 3. **package.json**
- Added `socket.io-client: ^4.7.2`

---

## How to Use

### For Vendors:
1. Navigate to "Booking Requests" page
2. View pending bookings
3. Click **"Accept"** button to accept a booking
4. Once accepted, new **"Chat"** button appears
5. Click "Chat" to open the chat modal
6. Send messages in real-time to the client
7. Continue using WhatsApp/Call buttons as before

### For Users/Clients:
1. Go to "My Bookings" in profile
2. Find an accepted booking
3. New **"Chat"** button appears alongside WhatsApp/Call
4. Click "Chat" to open the chat modal
5. Send messages to the vendor in real-time
6. Can still use WhatsApp/Call for other communication

---

## Technical Details

### Socket.io Chat Rooms
Each booking gets its own chat room: `chat-{bookingId}`
- Only users involved in that booking can access the chat
- Uses room-based broadcasting for efficiency

### Message Validation
Server validates:
- Booking exists
- Booking status is "accepted"
- Returns 403 if trying to chat on non-accepted bookings

### Database Schema
```javascript
ChatMessage {
  bookingId: ObjectId,
  senderId: ObjectId,
  senderName: String,
  senderRole: Enum['user', 'vendor'],
  message: String,
  isRead: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Color Theme
The chat UI follows your app's brand colors:
- **Primary Gradient**: #b14e79 → #8e3e61 (pink)
- **Light Mode**: White/gray backgrounds
- **Dark Mode**: #05070a, #0a0d14, #111622
- **Buttons**: Gradient pink for primary actions

---

## Testing the Feature

### Prerequisites:
1. Backend running: `npm start` or `node server.js` (port 5000)
2. Frontend running: `npm run dev` (port 5173)
3. MongoDB connected

### Test Steps:
1. **Create a Booking**:
   - User sends booking request to vendor
   - Status: "pending"

2. **Accept Booking**:
   - Vendor accepts the request
   - Status changes to "accepted"

3. **Open Chat**:
   - Click "Chat" button (now visible after acceptance)
   - Chat modal opens
   - Previous messages load automatically

4. **Send Messages**:
   - Type message and press Enter or click Send
   - Message appears immediately on both sides
   - Timestamp shows when message was sent

5. **Real-time Updates**:
   - Open same chat in two browser windows
   - Send message from one side
   - Appears instantly on the other side

---

## Environment Variables
No new environment variables needed. Uses existing:
- `MONGO_URI` - Database connection
- `PORT` - Server port (default 5000)

---

## Browser Compatibility
- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Full support

---

## Future Enhancements
Potential improvements:
- Typing indicators ("User is typing...")
- Read receipts
- Message search
- Chat history export
- File/image sharing
- Voice/video calling
- User online status
- Message pinning
- Emoji support

---

## Troubleshooting

### Chat Not Loading
- Ensure backend is running on port 5000
- Check browser console for errors
- Verify booking is actually "accepted"

### Messages Not Sending
- Check network connection
- Ensure Socket.io is connected (check console)
- Verify booking ID is correct

### Disconnect Issues
- Refresh the page to reconnect
- Check firewall/proxy settings
- Ensure CORS is properly configured

---

## Support
For issues or questions about the chat feature:
1. Check the console for error messages
2. Verify booking status is "accepted"
3. Ensure both users are authenticated
4. Check Socket.io connection in browser DevTools
