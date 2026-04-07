// ============================================
// CHAT MESSAGE SCHEMA & MODEL
// ============================================

const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema({
  // Booking reference
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  
  // Message details
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  senderName: {
    type: String,
    required: true
  },
  senderRole: {
    type: String,
    enum: ['user', 'vendor'],
    required: true
  },
  
  // Message content
  message: {
    type: String,
    required: true
  },
  
  // Read status
  isRead: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('ChatMessage', ChatMessageSchema);
