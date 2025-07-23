import React from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, Button } from '@mui/material';
import { motion } from 'framer-motion';
import ControllerStatus from '../components/UI/ControllerStatus';
import ControllerDemo from '../components/Games/ControllerDemo';

const HomePage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box textAlign="center" mb={6}>
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome to Lionsuncoin Gaming
          </Typography>
          <Typography variant="h5" color="textSecondary" mb={4}>
            Play games, earn cryptocurrency rewards
          </Typography>
          <Button variant="contained" size="large" color="primary">
            Start Playing
          </Button>
        </Box>

        {/* Controller Status */}
        <Box mb={4}>
          <ControllerStatus />
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  🎮 Cross-Platform Gaming
                </Typography>
                <Typography variant="body2">
                  Play with PS5, Xbox, Nintendo Switch, and PSP controllers.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  💰 Crypto Rewards
                </Typography>
                <Typography variant="body2">
                  Earn Lionsuncoin and other cryptocurrencies by playing.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  🏆 Leaderboards
                </Typography>
                <Typography variant="body2">
                  Compete with players worldwide and climb the rankings.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Controller Demo */}
        <Box mt={6}>
          <ControllerDemo />
        </Box>
      </motion.div>
    </Container>
  );
};

export default HomePage;