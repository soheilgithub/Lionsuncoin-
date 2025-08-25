import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { PlayArrow } from '@mui/icons-material';

const GamesPage = () => {
  const games = [
    { id: 1, name: 'Puzzle Master', description: 'Solve challenging puzzles', reward: '50 LC' },
    { id: 2, name: 'Space Defender', description: 'Defend against alien invaders', reward: '75 LC' },
    { id: 3, name: 'Coin Runner', description: 'Endless running with coin collection', reward: '100 LC' },
    { id: 4, name: 'Strategy Empire', description: 'Build and manage your empire', reward: '150 LC' }
  ];

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" sx={{ mb: 4, color: '#FFD700', fontWeight: 'bold' }}>
          🎮 Available Games
        </Typography>
        
        <Grid container spacing={3}>
          {games.map((game) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={game.id}>
              <Card sx={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1, color: '#FFD700' }}>{game.name}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{game.description}</Typography>
                  <Typography variant="body2" sx={{ mb: 2, color: '#FFA500' }}>Reward: {game.reward}</Typography>
                  <Button variant="contained" startIcon={<PlayArrow />} fullWidth>
                    Play Now
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default GamesPage;