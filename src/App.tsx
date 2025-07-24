import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from './contexts/AuthContext';
import { useGame } from './contexts/GameContext';
import { useTheme } from './contexts/ThemeContext';

// Layout Components
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Sidebar from './components/Layout/Sidebar';
import LoadingScreen from './components/UI/LoadingScreen';
import ErrorBoundary from './components/UI/ErrorBoundary';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import GamesPage from './pages/GamesPage';
import GamePage from './pages/GamePage';
import WalletPage from './pages/WalletPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';

// Protected Route Component
import ProtectedRoute from './components/Auth/ProtectedRoute';

// Styled Components
const AppContainer = styled.div<{ platform: string }>`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${props => props.theme.gradients.primary};
  position: relative;
  overflow-x: hidden;
  
  ${props => props.platform === 'ios' && `
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
  `}
  
  ${props => props.platform === 'android' && `
    overscroll-behavior: contain;
  `}
  
  ${props => props.platform === 'electron' && `
    user-select: none;
    -webkit-app-region: no-drag;
  `}
`;

const MainContent = styled.main<{ sidebarOpen: boolean }>`
  flex: 1;
  display: flex;
  position: relative;
  overflow: hidden;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ContentArea = styled.div<{ sidebarOpen: boolean }>`
  flex: 1;
  transition: all 0.3s ease;
  padding: 0;
  overflow-y: auto;
  overflow-x: hidden;
  
  @media (min-width: 769px) {
    margin-left: ${props => props.sidebarOpen ? '280px' : '0'};
  }
`;

const BackgroundElements = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: -1;
  overflow: hidden;
`;

const floatingAnimation = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  25% { transform: translateY(-20px) rotate(90deg); }
  50% { transform: translateY(-10px) rotate(180deg); }
  75% { transform: translateY(-30px) rotate(270deg); }
`;

const FloatingIcon = styled.div<{ delay: number; size: number; left: string; top: string }>`
  position: absolute;
  left: ${props => props.left};
  top: ${props => props.top};
  font-size: ${props => props.size}px;
  opacity: 0.1;
  animation: ${floatingAnimation} 20s infinite linear;
  animation-delay: ${props => props.delay}s;
  color: ${props => props.theme.colors.accent};
`;

// Page transition variants
const pageVariants = {
  initial: { 
    opacity: 0, 
    x: -20,
    scale: 0.98
  },
  in: { 
    opacity: 1, 
    x: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  },
  out: { 
    opacity: 0, 
    x: 20,
    scale: 1.02,
    transition: {
      duration: 0.3,
      ease: "easeIn"
    }
  }
};

interface AppProps {
  platform: string;
}

const App: React.FC<AppProps> = ({ platform }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const { isConnected, gameState } = useGame();
  const { theme } = useTheme();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Platform-specific effects
  useEffect(() => {
    // Set platform-specific CSS variables
    document.documentElement.style.setProperty('--platform', platform);
    
    // Platform-specific optimizations
    if (platform === 'electron') {
      // Electron-specific optimizations
      document.body.style.cursor = 'default';
    }
    
    if (platform === 'ios' || platform === 'android') {
      // Mobile-specific optimizations
      document.body.style.touchAction = 'manipulation';
      document.body.style.userSelect = 'none';
    }
  }, [platform]);

  // Handle route changes
  useEffect(() => {
    // Close sidebar on route change for mobile
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
    
    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Handle loading state
  if (loading) {
    return <LoadingScreen />;
  }

  // Generate floating background elements
  const floatingIcons = ['🦁', '🎮', '🪙', '⚡', '🏆', '🎯', '🚀', '💎'].map((icon, index) => (
    <FloatingIcon
      key={index}
      delay={index * 2.5}
      size={Math.random() * 30 + 20}
      left={`${Math.random() * 90}%`}
      top={`${Math.random() * 90}%`}
    >
      {icon}
    </FloatingIcon>
  ));

  return (
    <ErrorBoundary>
      <AppContainer platform={platform}>
        <BackgroundElements>
          {floatingIcons}
        </BackgroundElements>
        
        <Navbar 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />
        
        <MainContent sidebarOpen={sidebarOpen}>
          {isAuthenticated && (
            <Sidebar 
              isOpen={sidebarOpen} 
              onClose={() => setSidebarOpen(false)}
              platform={platform}
            />
          )}
          
          <ContentArea sidebarOpen={isAuthenticated ? sidebarOpen : false}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={location.pathname}
                variants={pageVariants}
                initial="initial"
                animate="in"
                exit="out"
                style={{ height: '100%' }}
              >
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
                  <Route 
                    path="/settings" 
                    element={
                      <ProtectedRoute>
                        <SettingsPage />
                      </ProtectedRoute>
                    } 
                  />

                  {/* 404 Route */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </motion.div>
            </AnimatePresence>
          </ContentArea>
        </MainContent>

        <Footer />
      </AppContainer>
    </ErrorBoundary>
  );
};

export default App;