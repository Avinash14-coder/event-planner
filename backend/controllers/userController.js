// ============================================
// USER CONTROLLER
// ============================================

const User = require('../models/UserModel');

// GET /api/users
const getAllUsers = async (req, res) => {
  try {
    // Hide password from response
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/users/:id
const updateUser = async (req, res) => {
  try {
    let updateData = req.body;

    // Handle profile picture upload
    if (req.file) {
      const fullUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      updateData.profilePic = fullUrl;
    }

    // Update user and return new document
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllUsers, updateUser };
