import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Avatar } from '@mui/material';

const LeaderboardPage = () => {
  const players = [
    { rank: 1, name: 'Player1', score: 15000, coins: 5000, avatar: '🦁' },
    { rank: 2, name: 'Player2', score: 12000, coins: 4000, avatar: '🐯' },
    { rank: 3, name: 'Player3', score: 10000, coins: 3500, avatar: '🐨' },
    { rank: 4, name: 'Player4', score: 8500, coins: 3000, avatar: '🐼' },
    { rank: 5, name: 'Player5', score: 7000, coins: 2500, avatar: '🦊' }
  ];

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" sx={{ mb: 4, color: '#FFD700', fontWeight: 'bold' }}>
          🏆 Leaderboard
        </Typography>
        
        <Grid container spacing={3}>
          {players.map((player) => (
            <Grid item xs={12} key={player.rank}>
              <Card sx={{ 
                background: player.rank <= 3 ? 'rgba(255,215,0,0.1)' : 'rgba(255,255,255,0.05)', 
                backdropFilter: 'blur(10px)',
                border: player.rank <= 3 ? '1px solid rgba(255,215,0,0.3)' : '1px solid rgba(255,255,255,0.1)'
              }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="h4" sx={{ 
                    color: player.rank <= 3 ? '#FFD700' : 'text.secondary',
                    fontWeight: 'bold',
                    minWidth: 60
                  }}>
                    #{player.rank}
                  </Typography>
                  
                  <Avatar sx={{ 
                    width: 50, 
                    height: 50, 
                    fontSize: '1.5rem',
                    bgcolor: player.rank <= 3 ? '#FFD700' : '#FFA500'
                  }}>
                    {player.avatar}
                  </Avatar>
                  
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ color: player.rank <= 3 ? '#FFD700' : 'white' }}>
                      {player.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Score: {player.score.toLocaleString()}
                    </Typography>
                  </Box>
                  
                  <Typography variant="h6" color="#FFA500">
                    {player.coins} LC
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        
        <Typography variant="body1" color="text.secondary" sx={{ mt: 4 }}>
          Global leaderboards are updated in real-time. Keep playing to climb the ranks and earn more LionsunCoins!
        </Typography>
      </Box>
    </Container>
  );
};

export default LeaderboardPage;