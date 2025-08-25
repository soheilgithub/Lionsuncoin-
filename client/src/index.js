import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Toaster } from 'react-hot-toast';

import App from './App';
import { store } from './store';
import './index.css';

// Create custom theme for Lionsuncoin
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#DAA520', // Gold
      light: '#FFD700',
      dark: '#B8860B',
      contrastText: '#000000',
    },
    secondary: {
      main: '#8B4513', // Saddle Brown
      light: '#CD853F',
      dark: '#654321',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#0f0f23',
      paper: '#1a1a3a',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#DAA520',
    },
    success: {
      main: '#4CAF50',
    },
    error: {
      main: '#F44336',
    },
    warning: {
      main: '#FF9800',
    },
    info: {
      main: '#2196F3',
    },
  },
  typography: {
    fontFamily: [
      'Rajdhani',
      'Orbitron',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontFamily: 'Orbitron',
      fontWeight: 900,
      fontSize: '3rem',
      color: '#DAA520',
    },
    h2: {
      fontFamily: 'Orbitron',
      fontWeight: 700,
      fontSize: '2.5rem',
      color: '#DAA520',
    },
    h3: {
      fontFamily: 'Orbitron',
      fontWeight: 700,
      fontSize: '2rem',
      color: '#FFFFFF',
    },
    h4: {
      fontFamily: 'Rajdhani',
      fontWeight: 600,
      fontSize: '1.5rem',
      color: '#FFFFFF',
    },
    h5: {
      fontFamily: 'Rajdhani',
      fontWeight: 600,
      fontSize: '1.25rem',
      color: '#FFFFFF',
    },
    h6: {
      fontFamily: 'Rajdhani',
      fontWeight: 500,
      fontSize: '1rem',
      color: '#FFFFFF',
    },
    body1: {
      fontFamily: 'Rajdhani',
      fontSize: '1rem',
      fontWeight: 400,
    },
    body2: {
      fontFamily: 'Rajdhani',
      fontSize: '0.875rem',
      fontWeight: 400,
    },
    button: {
      fontFamily: 'Rajdhani',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.1rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '12px 24px',
          fontSize: '1rem',
          fontWeight: 600,
          boxShadow: '0 4px 15px rgba(218, 165, 32, 0.3)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 20px rgba(218, 165, 32, 0.4)',
          },
        },
        contained: {
          background: 'linear-gradient(45deg, #DAA520 30%, #FFD700 90%)',
          color: '#000000',
          '&:hover': {
            background: 'linear-gradient(45deg, #B8860B 30%, #DAA520 90%)',
          },
        },
        outlined: {
          borderColor: '#DAA520',
          color: '#DAA520',
          '&:hover': {
            borderColor: '#FFD700',
            backgroundColor: 'rgba(218, 165, 32, 0.1)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(26, 26, 58, 0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(218, 165, 32, 0.2)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(218, 165, 32, 0.5)',
            },
            '&:hover fieldset': {
              borderColor: '#DAA520',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#FFD700',
            },
          },
          '& .MuiInputLabel-root': {
            color: 'rgba(255, 255, 255, 0.7)',
            '&.Mui-focused': {
              color: '#DAA520',
            },
          },
        },
      },
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1a1a3a',
                color: '#ffffff',
                border: '1px solid #DAA520',
                borderRadius: '8px',
                fontFamily: 'Rajdhani',
              },
              success: {
                iconTheme: {
                  primary: '#4CAF50',
                  secondary: '#ffffff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#F44336',
                  secondary: '#ffffff',
                },
              },
            }}
          />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);