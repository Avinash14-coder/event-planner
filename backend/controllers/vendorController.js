// ============================================
// VENDOR/SERVICE CONTROLLER
// ============================================

const Vendor = require('../models/VendorModel');

// POST /api/vendors
const createVendor = async (req, res) => {
  try {
    const { name, type, price, location, description, ownerId } = req.body;

    let imageUrl = '';
    if (req.file) {
      imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    const newVendor = new Vendor({
      name,
      type,
      price,
      location,
      description,
      ownerId,
      images: [imageUrl],
      rating: 0
    });

    await newVendor.save();
    res.json(newVendor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/vendors
const getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find();
    res.json(vendors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/vendors/my-services/:ownerId
const getMyServices = async (req, res) => {
  try {
    const myServices = await Vendor.find({ ownerId: req.params.ownerId });
    res.json(myServices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/vendors/:id
const getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    res.json(vendor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/vendors/:id
const deleteVendor = async (req, res) => {
  try {
    await Vendor.findByIdAndDelete(req.params.id);
    res.json({ message: 'Vendor deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createVendor,
  getAllVendors,
  getMyServices,
  getVendorById,
  deleteVendor
};
