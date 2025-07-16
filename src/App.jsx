// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

/**
 * The main application component for Speech2Text.
 * Sets up routing for public and protected pages.
 */
function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Route for the main app */}
        {/* The root path "/" will now require authentication */}
        <Route path="/" element={<ProtectedRoute />}>
          <Route index element={<HomePage />} /> {/* Renders HomePage at "/" if authenticated */}
        </Route>

        {/* Catch-all for 404 Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
