// ============================================
// EVENTRA - Event Planner Backend Server
// ============================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');

// --- IMPORTS ---
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const chatRoutes = require('./routes/chatRoutes');

// --- INITIALIZE APP ---
const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const corsOptions = {
  origin: [
    'https://event-planner-delta-one.vercel.app',
    'http://localhost:5173',  // for local dev
    'http://localhost:3000',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};


// --- MIDDLEWARE ---
app.use(express.json());
app.use(cors(corsOptions));

// Serve the 'uploads' folder as static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/chat', chatRoutes);

// --- SOCKET.IO CONNECTION ---
io.on('connection', (socket) => {
  console.log(`✅ User connected: ${socket.id}`);

  // Join a specific chat room based on booking ID
  socket.on('join-chat', (bookingId) => {
    socket.join(`chat-${bookingId}`);
    console.log(`User ${socket.id} joined chat-${bookingId}`);
  });

  // Listen for incoming chat messages
  socket.on('send-message', (data) => {
    const { bookingId, senderId, senderName, senderRole, message } = data;
    
    // Broadcast message to all users in the specific chat room
    io.to(`chat-${bookingId}`).emit('receive-message', {
      senderId,
      senderName,
      senderRole,
      message,
      timestamp: new Date()
    });
    
    console.log(`Message in chat-${bookingId}: ${message}`);
  });

  // Leave chat room
  socket.on('leave-chat', (bookingId) => {
    socket.leave(`chat-${bookingId}`);
    console.log(`User ${socket.id} left chat-${bookingId}`);
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});

// --- DATABASE CONNECTION & SERVER START ---
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}).catch((error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});
