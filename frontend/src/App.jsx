import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';

// --- LAYOUTS ---
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// --- PUBLIC PAGES ---
import Home from './pages/public/Home';
import Login from './pages/public/Login';
import CategoryHub from './pages/public/CategoryHub';
import SubCategoryListing from './pages/public/SubCategoryListing';
import VendorList from './pages/public/VendorList';
import About from './pages/public/About';
import VendorDetails from './pages/public/VendorDetails';

// --- USER PAGES ---
import UserProfile from './pages/users/UserProfile';

// --- VENDOR PAGES ---
import VendorDashboard from './pages/vendor/VendorDashboard';
import AddService from './pages/vendor/AddService';
import VendorBookings from './pages/vendor/VendorBookings';

// --- ADMIN PAGES ---
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  const [user, setUser] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Handle user login
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Handle user logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <ThemeProvider>
      <Router>
        <Toaster position="top-center" reverseOrder={false} />

        <Routes>
          {/* =====================================================
              PUBLIC LAYOUT ROUTES
             ===================================================== */}
          <Route element={<PublicLayout user={user} onLogout={handleLogout} />}>
            <Route path="/" element={<Home />} />

            {/* Category hub page */}
            <Route path="/category/:categoryName" element={<CategoryHub />} />

            {/* About page */}
            <Route path="/about" element={<About />} />

            {/* Sub-category listing page */}
            <Route
              path="/category/:categoryName/services/:serviceType"
              element={<SubCategoryListing />}
            />

            {/* All vendors page */}
            <Route path="/vendors" element={<VendorList />} />

            {/* Vendor details page */}
            <Route path="/vendors/:id" element={<VendorDetails />} />

            {/* User profile page (protected) */}
            <Route
              path="/user/profile"
              element={
                user && user.role === 'user' ? (
                  <UserProfile user={user} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            {/* Login page */}
            <Route
              path="/login"
              element={
                user ? (
                  <Navigate
                    to={
                      user.role === 'vendor'
                        ? '/vendor/dashboard'
                        : user.role === 'admin'
                          ? '/admin/dashboard'
                          : '/user/profile'
                    }
                  />
                ) : (
                  <Login onLogin={handleLogin} />
                )
              }
            />
          </Route>

          {/* =====================================================
              VENDOR DASHBOARD ROUTES (Protected)
             ===================================================== */}
          <Route
            path="/vendor"
            element={
              user && user.role === 'vendor' ? (
                <DashboardLayout role="vendor" user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" />
              )
            }
          >
            <Route path="dashboard" element={<VendorDashboard />} />
            <Route path="add-service" element={<AddService />} />
            <Route path="bookings" element={<VendorBookings />} />
          </Route>

          {/* =====================================================
              ADMIN DASHBOARD ROUTES (Protected)
             ===================================================== */}
          <Route
            path="/admin"
            element={
              user && user.role === 'admin' ? (
                <DashboardLayout role="admin" user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" />
              )
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;