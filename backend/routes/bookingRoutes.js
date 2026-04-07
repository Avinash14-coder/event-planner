// ============================================
// BOOKING ROUTES
// ============================================

const express = require('express');
const router = express.Router();
const {
  createBooking,
  getBookingsForVendor,
  getBookingsForUser,
  updateBookingStatus,
} = require('../controllers/bookingController');

// --- BOOKING ENDPOINTS ---
router.post('/', createBooking);
router.get('/vendor/:vendorId', getBookingsForVendor);
router.get('/user/:userId', getBookingsForUser);
router.put('/:id/status', updateBookingStatus);

module.exports = router;
