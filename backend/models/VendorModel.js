// ============================================
// VENDOR/SERVICE SCHEMA & MODEL
// ============================================

const mongoose = require('mongoose');

const VendorSchema = new mongoose.Schema({
  // Link service to owner user account
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Service details
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  
  // Images and rating
  images: [{
    type: String
  }],
  rating: {
    type: Number,
    default: 0
  },
  
  // Contact information
  contact: {
    phone: {
      type: String
    },
    email: {
      type: String
    }
  }
});

module.exports = mongoose.model('Vendor', VendorSchema);