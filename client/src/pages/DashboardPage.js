import React from 'react';
import { Container, Typography, Grid, Card, CardContent } from '@mui/material';

const DashboardPage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Your Stats</Typography>
              <Typography>Games Played: 0</Typography>
              <Typography>Total Earnings: 0 LSC</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Recent Activity</Typography>
              <Typography>No recent activity</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage;
