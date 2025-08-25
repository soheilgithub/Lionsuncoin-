import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Grid, 
  Card, 
  CardContent,
  CardMedia 
} from '@mui/material';
import { 
  PlayArrow, 
  AccountBalanceWallet, 
  Leaderboard, 
  Security 
} from '@mui/icons-material';

const HomePage = () => {
  return (
    <Container maxWidth="xl">
      {/* Hero Section */}
      <Box
        sx={{
          textAlign: 'center',
          py: 8,
          background: 'linear-gradient(135deg, rgba(255,215,0,0.1) 0%, rgba(255,165,0,0.1) 100%)',
          borderRadius: 4,
          mb: 6,
          border: '1px solid rgba(255,215,0,0.3)'
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontWeight: 'bold',
            mb: 3,
            background: 'linear-gradient(45deg, #FFD700, #FFA500)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 30px rgba(255,215,0,0.5)'
          }}
        >
          🦁 LionsunCoin Gaming Platform
        </Typography>
        <Typography
          variant="h5"
          color="text.secondary"
          sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}
        >
          Revolutionize your gaming experience with cryptocurrency rewards. 
          Play, earn, and trade with the power of blockchain technology.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            component={Link}
            to="/register"
            variant="contained"
            size="large"
            startIcon={<PlayArrow />}
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
            Start Playing Now
          </Button>
          <Button
            component={Link}
            to="/login"
            variant="outlined"
            size="large"
            sx={{
              borderColor: '#FFD700',
              color: '#FFD700',
              '&:hover': {
                borderColor: '#FFA500',
                backgroundColor: 'rgba(255,215,0,0.1)'
              }
            }}
          >
            Sign In
          </Button>
        </Box>
      </Box>

      {/* Features Grid */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid item xs={12} md={6} lg={3}>
          <Card 
            sx={{ 
              height: '100%',
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 10px 30px rgba(255,215,0,0.2)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <PlayArrow sx={{ fontSize: 60, color: '#FFD700', mb: 2 }} />
              <Typography variant="h6" component="h3" sx={{ mb: 2, color: '#FFD700' }}>
                Play & Earn
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Enjoy exciting games while earning LionsunCoins. Every victory brings you closer to crypto rewards.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card 
            sx={{ 
              height: '100%',
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 10px 30px rgba(255,215,0,0.2)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <AccountBalanceWallet sx={{ fontSize: 60, color: '#FFD700', mb: 2 }} />
              <Typography variant="h6" component="h3" sx={{ mb: 2, color: '#FFD700' }}>
                Secure Wallet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage your LionsunCoins with our secure, blockchain-powered wallet system.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card 
            sx={{ 
              height: '100%',
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 10px 30px rgba(255,215,0,0.2)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Leaderboard sx={{ fontSize: 60, color: '#FFD700', mb: 2 }} />
              <Typography variant="h6" component="h3" sx={{ mb: 2, color: '#FFD700' }}>
                Global Leaderboards
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Compete with players worldwide and climb the ranks to earn exclusive rewards.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card 
            sx={{ 
              height: '100%',
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 10px 30px rgba(255,215,0,0.2)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Security sx={{ fontSize: 60, color: '#FFD700', mb: 2 }} />
              <Typography variant="h6" component="h3" sx={{ mb: 2, color: '#FFD700' }}>
                Blockchain Security
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Built on Ethereum blockchain for maximum security and transparency.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Call to Action */}
      <Box
        sx={{
          textAlign: 'center',
          py: 6,
          background: 'linear-gradient(135deg, rgba(255,215,0,0.05) 0%, rgba(255,165,0,0.05) 100%)',
          borderRadius: 4,
          border: '1px solid rgba(255,215,0,0.2)'
        }}
      >
        <Typography variant="h4" component="h2" sx={{ mb: 3, color: '#FFD700' }}>
          Ready to Start Your Gaming Journey?
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Join thousands of players already earning LionsunCoins through gaming excellence.
        </Typography>
        <Button
          component={Link}
          to="/register"
          variant="contained"
          size="large"
          sx={{
            background: 'linear-gradient(45deg, #FFD700, #FFA500)',
            px: 4,
            py: 1.5,
            '&:hover': {
              background: 'linear-gradient(45deg, #FFA500, #FFD700)',
              transform: 'scale(1.05)',
              boxShadow: '0 10px 30px rgba(255,215,0,0.4)'
            },
            transition: 'all 0.3s ease'
          }}
        >
          Create Free Account
        </Button>
      </Box>
    </Container>
  );
};

export default HomePage;