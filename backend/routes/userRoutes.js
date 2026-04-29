// ============================================
// USER ROUTES
// ============================================

const express = require('express');
const router = express.Router();
const { getAllUsers, updateUser, deleteUser } = require('../controllers/userController');
const upload = require('../middleware/upload');

// --- USER ENDPOINTS ---
router.get('/', getAllUsers);
router.put('/:id', upload.single('profilePic'), updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
