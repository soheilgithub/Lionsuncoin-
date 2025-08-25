import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const GamePage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Button 
          startIcon={<ArrowBack />} 
          onClick={() => navigate('/games')}
          sx={{ mb: 3, color: '#FFD700' }}
        >
          Back to Games
        </Button>
        
        <Typography variant="h3" component="h1" sx={{ mb: 4, color: '#FFD700', fontWeight: 'bold' }}>
          🎮 Game Page
        </Typography>
        
        <Typography variant="body1" color="text.secondary">
          Individual game pages are under development. This is where players will be able to play games and earn LionsunCoins.
        </Typography>
      </Box>
    </Container>
  );
};

export default GamePage;