import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent } from '@mui/material';
import { AccountBalanceWallet, Send, Receipt } from '@mui/icons-material';

const WalletPage = () => {
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" sx={{ mb: 4, color: '#FFD700', fontWeight: 'bold' }}>
          💰 Wallet
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
              <CardContent>
                <Typography variant="h4" color="#FFD700">1,250 LC</Typography>
                <Typography variant="body2" color="text.secondary">Available Balance</Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
              <CardContent>
                <Typography variant="h4" color="#FFD700">5,000 LC</Typography>
                <Typography variant="body2" color="text.secondary">Total Earned</Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
              <CardContent>
                <Typography variant="h4" color="#FFD700">42</Typography>
                <Typography variant="body2" color="text.secondary">Transactions</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        <Typography variant="body1" color="text.secondary" sx={{ mt: 4 }}>
          Wallet functionality is under development. Soon you'll be able to send, receive, and manage your LionsunCoins.
        </Typography>
      </Box>
    </Container>
  );
};

export default WalletPage;