import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';

const LoadingScreen = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a3a 50%, #2d2d5f 100%)',
        backgroundAttachment: 'fixed',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Animated background elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: 100,
          height: 100,
          background: 'radial-gradient(circle, rgba(255,215,0,0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 6s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': {
              transform: 'translateY(0px) rotate(0deg)',
              opacity: 0.3
            },
            '50%': {
              transform: 'translateY(-20px) rotate(180deg)',
              opacity: 0.7
            }
          }
        }}
      />
      
      <Box
        sx={{
          position: 'absolute',
          top: '60%',
          right: '15%',
          width: 80,
          height: 80,
          background: 'radial-gradient(circle, rgba(255,165,0,0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 8s ease-in-out infinite reverse',
          '@keyframes float': {
            '0%, 100%': {
              transform: 'translateY(0px) rotate(0deg)',
              opacity: 0.3
            },
            '50%': {
              transform: 'translateY(-20px) rotate(180deg)',
              opacity: 0.7
            }
          }
        }}
      />

      {/* Main content */}
      <Box
        sx={{
          textAlign: 'center',
          zIndex: 1,
          position: 'relative'
        }}
      >
        {/* Logo */}
        <Typography
          variant="h1"
          component="div"
          sx={{
            fontWeight: 'bold',
            mb: 4,
            background: 'linear-gradient(45deg, #FFD700, #FFA500)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 50px rgba(255,215,0,0.5)',
            fontSize: { xs: '3rem', sm: '4rem', md: '5rem' },
            animation: 'glow 2s ease-in-out infinite alternate',
            '@keyframes glow': {
              '0%': {
                textShadow: '0 0 50px rgba(255,215,0,0.5)'
              },
              '100%': {
                textShadow: '0 0 80px rgba(255,215,0,0.8), 0 0 120px rgba(255,215,0,0.4)'
              }
            }
          }}
        >
          🦁 LionsunCoin
        </Typography>

        {/* Subtitle */}
        <Typography
          variant="h5"
          color="text.secondary"
          sx={{
            mb: 6,
            maxWidth: 600,
            mx: 'auto',
            opacity: 0.8,
            animation: 'fadeIn 1s ease-in-out 0.5s both',
            '@keyframes fadeIn': {
              '0%': {
                opacity: 0,
                transform: 'translateY(20px)'
              },
              '100%': {
                opacity: 0.8,
                transform: 'translateY(0)'
              }
            }
          }}
        >
          Gaming Platform
        </Typography>

        {/* Loading spinner */}
        <Box sx={{ position: 'relative', mb: 4 }}>
          <CircularProgress
            size={80}
            thickness={4}
            sx={{
              color: '#FFD700',
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round',
                animation: 'spin 1.5s linear infinite'
              }
            }}
          />
          
          {/* Inner glow effect */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 60,
              height: 60,
              background: 'radial-gradient(circle, rgba(255,215,0,0.2) 0%, transparent 70%)',
              borderRadius: '50%',
              animation: 'pulse 2s ease-in-out infinite'
            }}
          />
        </Box>

        {/* Loading text */}
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{
            mb: 2,
            opacity: 0.7,
            animation: 'fadeIn 1s ease-in-out 1s both'
          }}
        >
          Loading your gaming experience...
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            opacity: 0.5,
            animation: 'fadeIn 1s ease-in-out 1.5s both'
          }}
        >
          Please wait while we prepare everything for you
        </Typography>
      </Box>

      {/* Bottom decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          bottom: '10%',
          left: '20%',
          width: 60,
          height: 60,
          background: 'radial-gradient(circle, rgba(255,215,0,0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 7s ease-in-out infinite 1s',
        }}
      />
      
      <Box
        sx={{
          position: 'absolute',
          bottom: '20%',
          right: '25%',
          width: 40,
          height: 40,
          background: 'radial-gradient(circle, rgba(255,165,0,0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 9s ease-in-out infinite 2s reverse',
        }}
      />
    </Box>
  );
};

export default LoadingScreen;