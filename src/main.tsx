import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { GameProvider } from './contexts/GameContext';
import { ThemeProvider as CustomThemeProvider } from './contexts/ThemeContext';
import { defaultTheme } from './styles/theme';
import { GlobalStyle } from './styles/GlobalStyle';
import { registerSW } from 'virtual:pwa-register';
import './index.css';

// Register service worker for PWA
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('New content available. Reload?')) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log('App ready to work offline');
  },
});

// Performance monitoring
if (process.env.NODE_ENV === 'development') {
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    getCLS(console.log);
    getFID(console.log);
    getFCP(console.log);
    getLCP(console.log);
    getTTFB(console.log);
  });
}

// Error boundary
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error boundary caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '2rem',
          textAlign: 'center',
          backgroundColor: '#1a1a2e',
          color: '#fff',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <h1>🦁 Oops! Something went wrong</h1>
          <p>We're sorry, but something unexpected happened.</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '1rem 2rem',
              backgroundColor: '#ffd700',
              color: '#1a1a2e',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontWeight: 'bold',
              marginTop: '1rem'
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Platform detection
const detectPlatform = (): string => {
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (/electron/.test(userAgent)) return 'electron';
  if (/android/.test(userAgent)) return 'android';
  if (/iphone|ipad|ipod/.test(userAgent)) return 'ios';
  if (/windows/.test(userAgent)) return 'windows';
  if (/macintosh/.test(userAgent)) return 'macos';
  if (/linux/.test(userAgent)) return 'linux';
  
  return 'web';
};

// Initialize platform-specific features
const initializePlatform = () => {
  const platform = detectPlatform();
  
  // Set platform-specific CSS class
  document.body.classList.add(`platform-${platform}`);
  
  // Platform-specific initializations
  switch (platform) {
    case 'ios':
      // iOS-specific setup
      document.body.style.setProperty('--safe-area-inset-top', 'env(safe-area-inset-top)');
      document.body.style.setProperty('--safe-area-inset-bottom', 'env(safe-area-inset-bottom)');
      break;
    case 'android':
      // Android-specific setup
      if ('virtualKeyboard' in navigator) {
        (navigator as any).virtualKeyboard.overlaysContent = true;
      }
      break;
    case 'electron':
      // Electron-specific setup
      console.log('Running in Electron environment');
      break;
  }
  
  return platform;
};

// Initialize application
const init = async () => {
  const platform = initializePlatform();
  
  // Preload critical assets
  const preloadPromises = [
    // Preload fonts
    new Promise(resolve => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap';
      link.onload = resolve;
      document.head.appendChild(link);
    })
  ];
  
  try {
    await Promise.all(preloadPromises);
  } catch (error) {
    console.warn('Failed to preload some assets:', error);
  }
  
  // Render the app
  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
  );
  
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <BrowserRouter>
          <CustomThemeProvider>
            <ThemeProvider theme={defaultTheme}>
              <GlobalStyle />
              <AuthProvider>
                <GameProvider>
                  <App platform={platform} />
                </GameProvider>
              </AuthProvider>
            </ThemeProvider>
          </CustomThemeProvider>
        </BrowserRouter>
      </ErrorBoundary>
    </React.StrictMode>
  );
};

// Start the application
init().catch(error => {
  console.error('Failed to initialize application:', error);
});

// Hot module replacement for development
if (import.meta.hot) {
  import.meta.hot.accept();
}