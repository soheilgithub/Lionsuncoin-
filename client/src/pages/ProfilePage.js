import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Avatar, Button } from '@mui/material';
import { Edit, Save, Cancel } from '@mui/icons-material';

const ProfilePage = () => {
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" sx={{ mb: 4, color: '#FFD700', fontWeight: 'bold' }}>
          👤 Profile
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Avatar sx={{ 
                  width: 120, 
                  height: 120, 
                  fontSize: '3rem',
                  bgcolor: '#FFD700',
                  mx: 'auto',
                  mb: 2
                }}>
                  🦁
                </Avatar>
                <Typography variant="h5" sx={{ color: '#FFD700', mb: 1 }}>
                  Player Name
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Level 42 • Member since 2024
                </Typography>
                <Button variant="outlined" startIcon={<Edit />} sx={{ color: '#FFD700', borderColor: '#FFD700' }}>
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Card sx={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, color: '#FFD700' }}>
                  Account Information
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Email</Typography>
                    <Typography variant="body1">player@example.com</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Username</Typography>
                    <Typography variant="body1">@playername</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Country</Typography>
                    <Typography variant="body1">United States</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Timezone</Typography>
                    <Typography variant="body1">UTC-5</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        <Typography variant="body1" color="text.secondary" sx={{ mt: 4 }}>
          Profile management features are under development. Soon you'll be able to customize your profile, 
          change settings, and manage your account preferences.
        </Typography>
      </Box>
    </Container>
  );
};

export default ProfilePage;