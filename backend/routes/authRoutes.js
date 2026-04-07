// ============================================
// AUTHENTICATION ROUTES
// ============================================

const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');

// --- AUTH ENDPOINTS ---
router.post('/signup', signup);
router.post('/login', login);

module.exports = router;
