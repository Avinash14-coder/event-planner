// ============================================
// USER SCHEMA & MODEL
// ============================================

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  // Required fields
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: false
  },
  googleId: {
    type: String,
    default: null
  },
  
  // User role
  role: {
    type: String,
    enum: ['user', 'vendor', 'admin'],
    default: 'user'
  },
  
  // Optional profile information
  profilePic: {
    type: String,
    default: ""
  },
  phone: {
    type: String,
    default: ""
  },
  address: {
    type: String,
    default: ""
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);