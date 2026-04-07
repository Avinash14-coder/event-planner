// ============================================
// BOOKING SCHEMA & MODEL
// ============================================

const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  // User information
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  userPhone: {
    type: String,
    default: ''
  },
  
  // Vendor information
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  vendorName: {
    type: String,
    required: true
  },
  vendorPhone: {
    type: String,
    default: ''
  },
  
  // Booking details
  eventDate: {
    type: String,
    required: true
  },
  message: {
    type: String,
    default: ''
  },
  
  // Booking status
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);
