import React from 'react';
import { Container, Typography, Grid, Card, CardContent, Button } from '@mui/material';

const GamesPage = () => {
  const games = [
    { id: 1, name: 'Memory Game', difficulty: 'Easy' },
    { id: 2, name: 'Puzzle Challenge', difficulty: 'Medium' },
    { id: 3, name: 'Speed Racer', difficulty: 'Hard' },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Games
      </Typography>
      <Grid container spacing={3}>
        {games.map((game) => (
          <Grid item xs={12} md={4} key={game.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{game.name}</Typography>
                <Typography color="textSecondary">{game.difficulty}</Typography>
                <Button variant="contained" sx={{ mt: 2 }}>
                  Play Now
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default GamesPage;
