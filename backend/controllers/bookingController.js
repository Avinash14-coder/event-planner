// ============================================
// BOOKING CONTROLLER
// ============================================

const Booking = require('../models/BookingModel');

// POST /api/bookings — user sends a booking request
const createBooking = async (req, res) => {
  try {
    const {
      userId,
      userName,
      userEmail,
      userPhone,
      vendorId,
      vendorName,
      vendorPhone,
      eventDate,
      message
    } = req.body;

    const booking = new Booking({
      userId,
      userName,
      userEmail,
      userPhone,
      vendorId,
      vendorName,
      vendorPhone,
      eventDate,
      message
    });
    
    await booking.save();
    res.status(201).json({ message: 'Booking request sent!', booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/bookings/vendor/:vendorId — vendor sees all incoming requests
const getBookingsForVendor = async (req, res) => {
  try {
    const bookings = await Booking.find({ vendorId: req.params.vendorId }).sort({
      createdAt: -1
    });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/bookings/user/:userId — user sees their own sent requests
const getBookingsForUser = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId }).sort({
      createdAt: -1
    });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/bookings/:id/status — vendor accepts or rejects a booking
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    // Validate status
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({
        error: 'Invalid status. Allowed values: accepted, rejected'
      });
    }
    
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createBooking,
  getBookingsForVendor,
  getBookingsForUser,
  updateBookingStatus
};
