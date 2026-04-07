// ============================================
// CHAT ROUTES
// ============================================

const express = require('express');
const router = express.Router();
const {
  getChatMessages,
  sendChatMessage,
  markMessageAsRead
} = require('../controllers/chatController');

// --- CHAT ENDPOINTS ---
router.get('/:bookingId', getChatMessages);
router.post('/', sendChatMessage);
router.put('/:messageId/read', markMessageAsRead);

module.exports = router;
