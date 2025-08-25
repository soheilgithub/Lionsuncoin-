import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { Home, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          py: 4
        }}
      >
        <Typography
          variant="h1"
          component="h1"
          sx={{
            fontWeight: 'bold',
            mb: 2,
            background: 'linear-gradient(45deg, #FFD700, #FFA500)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: { xs: '6rem', sm: '8rem', md: '10rem' }
          }}
        >
          404
        </Typography>
        
        <Typography variant="h4" component="h2" sx={{ mb: 2, color: '#FFD700' }}>
          🦁 Page Not Found
        </Typography>
        
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 500 }}>
          Oops! The page you're looking for doesn't exist. 
          It might have been moved, deleted, or you entered the wrong URL.
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button
            variant="contained"
            startIcon={<Home />}
            onClick={() => navigate('/')}
            sx={{
              background: 'linear-gradient(45deg, #FFD700, #FFA500)',
              '&:hover': {
                background: 'linear-gradient(45deg, #FFA500, #FFD700)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(255,215,0,0.4)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Go Home
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
            sx={{
              borderColor: '#FFD700',
              color: '#FFD700',
              '&:hover': {
                borderColor: '#FFA500',
                backgroundColor: 'rgba(255,215,0,0.1)'
              }
            }}
          >
            Go Back
          </Button>
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
          If you believe this is an error, please contact our support team.
        </Typography>
      </Box>
    </Container>
  );
};

export default NotFoundPage;