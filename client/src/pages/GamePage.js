import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { useParams } from 'react-router-dom';

const GamePage = () => {
  const { gameId } = useParams();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Game {gameId}
      </Typography>
      <Box sx={{ height: 400, bgcolor: 'grey.100', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6">Game Canvas Placeholder</Typography>
      </Box>
    </Container>
  );
};

export default GamePage;
