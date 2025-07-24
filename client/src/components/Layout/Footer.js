import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledFooter = styled(Box)(({ theme }) => ({
  background: 'rgba(26, 26, 58, 0.95)',
  backdropFilter: 'blur(10px)',
  borderTop: '2px solid rgba(255, 215, 0, 0.3)',
  padding: '20px 0',
  marginTop: 'auto',
}));

const Footer = () => {
  return (
    <StyledFooter>
      <Container maxWidth="lg">
        <Typography
          variant="body2"
          textAlign="center"
          sx={{ color: '#FFD700' }}
        >
          © 2024 Lionsun Coin. All rights reserved. 🌞
        </Typography>
      </Container>
    </StyledFooter>
  );
};

export default Footer;