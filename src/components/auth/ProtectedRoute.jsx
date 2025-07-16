// src/components/auth/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * A component that protects routes, redirecting unauthenticated users to the login page.
 * @param {Object} props - Component props.
 * @param {React.ReactNode} [props.children] - Child components to render if authenticated.
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Redirect to the login page if not authenticated
    return <Navigate to="/login" replace />;
  }

  // Render children or Outlet if authenticated
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
