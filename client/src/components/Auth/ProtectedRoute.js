import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // For now, just return the children without authentication check
  // In a real app, you would check if user is authenticated
  const isAuthenticated = false; // This would come from your auth state
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;
