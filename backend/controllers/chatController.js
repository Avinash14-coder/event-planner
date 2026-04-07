// ============================================
// CHAT CONTROLLER
// ============================================

const ChatMessage = require('../models/ChatMessage');
const Booking = require('../models/BookingModel');

// GET /api/chat/:bookingId — Get all chat messages for a booking
const getChatMessages = async (req, res) => {
  try {
    const messages = await ChatMessage.find({ bookingId: req.params.bookingId })
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/chat — Save a chat message
const sendChatMessage = async (req, res) => {
  try {
    const { bookingId, senderId, senderName, senderRole, message } = req.body;

    // Verify booking exists and is accepted
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    if (booking.status !== 'accepted') {
      return res.status(403).json({ error: 'Chat is only available for accepted bookings' });
    }

    const chatMessage = new ChatMessage({
      bookingId,
      senderId,
      senderName,
      senderRole,
      message
    });

    await chatMessage.save();
    res.status(201).json(chatMessage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/chat/:messageId/read — Mark message as read
const markMessageAsRead = async (req, res) => {
  try {
    const message = await ChatMessage.findByIdAndUpdate(
      req.params.messageId,
      { isRead: true },
      { new: true }
    );
    res.json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getChatMessages,
  sendChatMessage,
  markMessageAsRead
};
