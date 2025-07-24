import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'rgba(26, 26, 58, 0.95)',
  backdropFilter: 'blur(10px)',
  borderBottom: '2px solid rgba(255, 215, 0, 0.3)',
  boxShadow: '0 4px 20px rgba(255, 215, 0, 0.2)',
}));

const LogoText = styled(Typography)(({ theme }) => ({
  background: 'linear-gradient(45deg, #FFD700, #FFA500)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 'bold',
  fontSize: '24px',
}));

const Navbar = () => {
  return (
    <StyledAppBar position="static">
      <Toolbar>
        <LogoText variant="h6" component="div" sx={{ flexGrow: 1 }}>
          🌞 Lionsun Coin
        </LogoText>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button color="inherit" sx={{ color: '#FFD700' }}>
            Home
          </Button>
          <Button color="inherit" sx={{ color: '#FFD700' }}>
            About
          </Button>
          <Button color="inherit" sx={{ color: '#FFD700' }}>
            Contact
          </Button>
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Navbar;