import React, { useEffect, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Box } from '@mui/material';

// Components (keep essential components eagerly loaded)
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import LoadingScreen from './components/UI/LoadingScreen';
import ProtectedRoute from './components/Auth/ProtectedRoute';

// Lazy-loaded Pages for code splitting
const HomePage = React.lazy(() => import('./pages/HomePage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage'));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const GamesPage = React.lazy(() => import('./pages/GamesPage'));
const GamePage = React.lazy(() => import('./pages/GamePage'));
const WalletPage = React.lazy(() => import('./pages/WalletPage'));
const LeaderboardPage = React.lazy(() => import('./pages/LeaderboardPage'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));

// Redux
import { initializeAuth } from './store/slices/authSlice';
import { connectSocket, disconnectSocket } from './store/slices/socketSlice';

// Optimized loading component for lazy routes
const PageLoader = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '60vh',
    }}
  >
    <LoadingScreen />
  </Box>
);

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading: authLoading } = useSelector((state) => state.auth);
  const { isConnected } = useSelector((state) => state.socket);

  useEffect(() => {
    // Initialize authentication on app start
    dispatch(initializeAuth());
  }, [dispatch]);

  useEffect(() => {
    // Connect socket when authenticated
    if (isAuthenticated && !isConnected) {
      dispatch(connectSocket());
    } else if (!isAuthenticated && isConnected) {
      dispatch(disconnectSocket());
    }

    // Cleanup socket on unmount
    return () => {
      if (isConnected) {
        dispatch(disconnectSocket());
      }
    };
  }, [dispatch, isAuthenticated, isConnected]);

  if (authLoading) {
    return <LoadingScreen />;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a3a 50%, #2d2d5f 100%)',
        backgroundAttachment: 'fixed',
      }}
    >
      <Navbar />
      
      <Container
        maxWidth="xl"
        sx={{
          flex: 1,
          py: 4,
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/" 
              element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <HomePage />} 
            />
            <Route 
              path="/login" 
              element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} 
            />
            <Route 
              path="/register" 
              element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />} 
            />

            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/games" 
              element={
                <ProtectedRoute>
                  <GamesPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/games/:gameId" 
              element={
                <ProtectedRoute>
                  <GamePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/wallet" 
              element={
                <ProtectedRoute>
                  <WalletPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/leaderboard" 
              element={
                <ProtectedRoute>
                  <LeaderboardPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />

            {/* 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </Container>

      <Footer />
    </Box>
  );
}

export default App;