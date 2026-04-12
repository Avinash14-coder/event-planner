// ============================================
// AUTHENTICATION CONTROLLER
// ============================================

const User = require('../models/UserModel');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || 'PLACEHOLDER_CLIENT_ID');

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

// POST /api/auth/google
const googleLogin = async (req, res) => {
  try {
    const { credential, role } = req.body;
    
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID || 'PLACEHOLDER_CLIENT_ID',
    });
    const payload = ticket.getPayload();
    const { email, name, sub: googleId, picture } = payload;
    
    let user = await User.findOne({ email });
    
    if (user) {
      // If user logs in with a specific role, ensure it matches unless they are just logging in generically
      if (role && user.role !== role && role !== 'user' && user.role !== 'admin') {
         // Wait, the client sends 'role'. Let's just update their role or just accept them.
         // Let's accept them but return their actual role so frontend can redirect properly.
      }
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }
      return res.json({ user });
    } else {
      // Auto-create user
      user = new User({
        name,
        email,
        googleId,
        role: role || 'user',
        profilePic: picture,
      });
      await user.save();
      return res.json({ user });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { signup, login, googleLogin };
