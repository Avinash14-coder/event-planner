// ============================================
// AUTHENTICATION CONTROLLER
// ============================================

const User = require('../models/UserModel');

// POST /api/auth/signup
const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Create new user
    const user = new User({ name, email, password, role });
    await user.save();
    
    res.json({ message: 'Signup Success' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    // Find user and validate credentials
    const user = await User.findOne({ email });
    if (!user || user.password !== password || user.role !== role) {
      return res.status(401).json({ error: 'Invalid Credentials' });
    }
    
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { signup, login };
