// ============================================
// API CONFIGURATION
// ============================================

// Determine backend URL based on environment
const baseUrl = window.location.hostname === 'localhost'
  ? 'http://localhost:5000'
  : 'https://event-planner-1kse.onrender.com';

export default baseUrl;
