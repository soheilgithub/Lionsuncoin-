import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper
} from '@mui/material';

const DashboardPage = () => {
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 'bold',
            mb: 4,
            background: 'linear-gradient(45deg, #FFD700, #FFA500)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          🦁 Dashboard
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <Card sx={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
              <CardContent>
                <Typography variant="h4" color="#FFD700">1,250</Typography>
                <Typography variant="body2" color="text.secondary">LionsunCoins</Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6} lg={3}>
            <Card sx={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
              <CardContent>
                <Typography variant="h4" color="#FFD700">42</Typography>
                <Typography variant="body2" color="text.secondary">Games Played</Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6} lg={3}>
            <Card sx={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
              <CardContent>
                <Typography variant="h4" color="#FFD700">15</Typography>
                <Typography variant="body2" color="text.secondary">Achievements</Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6} lg={3}>
            <Card sx={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
              <CardContent>
                <Typography variant="h4" color="#FFD700">#127</Typography>
                <Typography variant="body2" color="text.secondary">Global Rank</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        <Paper sx={{ mt: 4, p: 3, background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
          <Typography variant="h5" sx={{ mb: 2, color: '#FFD700' }}>
            Welcome to your LionsunCoin Gaming Dashboard!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            This is where you'll see your gaming statistics, earned coins, achievements, and more.
            The dashboard is currently under development and will be fully functional soon.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default DashboardPage;