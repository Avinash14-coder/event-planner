// ============================================
// VENDOR/SERVICE ROUTES
// ============================================

const express = require('express');
const router = express.Router();
const {
  createVendor,
  getAllVendors,
  getMyServices,
  getVendorById,
  deleteVendor
} = require('../controllers/vendorController');
const upload = require('../middleware/upload');

// --- VENDOR ENDPOINTS ---
// NOTE: /my-services/:ownerId must be declared BEFORE /:id to avoid route conflicts
router.get('/my-services/:ownerId', getMyServices);
router.get('/:id', getVendorById);
router.get('/', getAllVendors);
router.post('/', upload.single('image'), createVendor);
router.delete('/:id', deleteVendor);

module.exports = router;
