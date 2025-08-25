import React from 'react';
import { Navigate } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';

const ProtectedRoute = ({ children }) => {
  // Mock authentication state - replace with actual auth logic
  const isAuthenticated = false; // This should come from your auth context/store
  const isLoading = false; // This should come from your auth context/store

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a3a 50%, #2d2d5f 100%)',
          backgroundAttachment: 'fixed'
        }}
      >
        <CircularProgress 
          size={60} 
          sx={{ color: '#FFD700', mb: 2 }} 
        />
        <Typography variant="h6" color="text.secondary">
          Verifying authentication...
        </Typography>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;