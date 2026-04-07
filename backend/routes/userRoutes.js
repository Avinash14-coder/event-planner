// ============================================
// USER ROUTES
// ============================================

const express = require('express');
const router = express.Router();
const { getAllUsers, updateUser } = require('../controllers/userController');
const upload = require('../middleware/upload');

// --- USER ENDPOINTS ---
router.get('/', getAllUsers);
router.put('/:id', upload.single('profilePic'), updateUser);

module.exports = router;
