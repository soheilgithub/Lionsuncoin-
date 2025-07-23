import React from 'react';
import { Container, Typography, Card, CardContent, Grid, Avatar, Box } from '@mui/material';

const ProfilePage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" flexDirection="column" alignItems="center">
                <Avatar sx={{ width: 80, height: 80, mb: 2 }}>U</Avatar>
                <Typography variant="h6">Username</Typography>
                <Typography color="textSecondary">user@example.com</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Statistics
              </Typography>
              <Typography>Games Played: 0</Typography>
              <Typography>Total Earnings: 0 LSC</Typography>
              <Typography>Best Score: 0</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProfilePage;
