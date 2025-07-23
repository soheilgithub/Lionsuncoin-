import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const Footer = () => {
  return (
    <Box component="footer" sx={{ mt: 'auto', py: 3, bgcolor: 'grey.900', color: 'white' }}>
      <Container maxWidth="lg">
        <Typography variant="body2" align="center">
          © 2024 Lionsuncoin Gaming Platform. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
