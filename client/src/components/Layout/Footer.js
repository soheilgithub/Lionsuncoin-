import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Link,
  Grid,
  Divider,
  IconButton
} from '@mui/material';
import {
  Twitter,
  Facebook,
  Instagram,
  LinkedIn,
  GitHub
} from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        background: 'rgba(15, 15, 35, 0.95)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(255, 215, 0, 0.2)',
        mt: 'auto',
        py: 4
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          {/* Brand Section */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  fontWeight: 'bold',
                  color: '#FFD700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 2
                }}
              >
                🦁 LionsunCoin
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 2, lineHeight: 1.6 }}
              >
                Revolutionizing gaming with cryptocurrency rewards. 
                Play, earn, and trade with the power of blockchain technology.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton
                  component="a"
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&:hover': {
                      color: '#FFD700',
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Twitter />
                </IconButton>
                <IconButton
                  component="a"
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&:hover': {
                      color: '#FFD700',
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Facebook />
                </IconButton>
                <IconButton
                  component="a"
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&:hover': {
                      color: '#FFD700',
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Instagram />
                </IconButton>
                <IconButton
                  component="a"
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&:hover': {
                      color: '#FFD700',
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <LinkedIn />
                </IconButton>
                <IconButton
                  component="a"
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&:hover': {
                      color: '#FFD700',
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <GitHub />
                </IconButton>
              </Box>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} md={2}>
            <Typography
              variant="h6"
              component="h3"
              sx={{
                color: '#FFD700',
                mb: 2,
                fontWeight: 'bold'
              }}
            >
              Platform
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link
                component={RouterLink}
                to="/games"
                color="text.secondary"
                sx={{
                  textDecoration: 'none',
                  '&:hover': {
                    color: '#FFD700'
                  },
                  transition: 'color 0.3s ease'
                }}
              >
                Games
              </Link>
              <Link
                component={RouterLink}
                to="/leaderboard"
                color="text.secondary"
                sx={{
                  textDecoration: 'none',
                  '&:hover': {
                    color: '#FFD700'
                  },
                  transition: 'color 0.3s ease'
                }}
              >
                Leaderboard
              </Link>
              <Link
                component={RouterLink}
                to="/wallet"
                color="text.secondary"
                sx={{
                  textDecoration: 'none',
                  '&:hover': {
                    color: '#FFD700'
                  },
                  transition: 'color 0.3s ease'
                }}
              >
                Wallet
              </Link>
              <Link
                component={RouterLink}
                to="/dashboard"
                color="text.secondary"
                sx={{
                  textDecoration: 'none',
                  '&:hover': {
                    color: '#FFD700'
                  },
                  transition: 'color 0.3s ease'
                }}
              >
                Dashboard
              </Link>
            </Box>
          </Grid>

          {/* Support */}
          <Grid item xs={12} md={2}>
            <Typography
              variant="h6"
              component="h3"
              sx={{
                color: '#FFD700',
                mb: 2,
                fontWeight: 'bold'
              }}
            >
              Support
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link
                href="#help"
                color="text.secondary"
                sx={{
                  textDecoration: 'none',
                  '&:hover': {
                    color: '#FFD700'
                  },
                  transition: 'color 0.3s ease'
                }}
              >
                Help Center
              </Link>
              <Link
                href="#faq"
                color="text.secondary"
                sx={{
                  textDecoration: 'none',
                  '&:hover': {
                    color: '#FFD700'
                  },
                  transition: 'color 0.3s ease'
                }}
              >
                FAQ
              </Link>
              <Link
                href="#contact"
                color="text.secondary"
                sx={{
                  textDecoration: 'none',
                  '&:hover': {
                    color: '#FFD700'
                  },
                  transition: 'color 0.3s ease'
                }}
              >
                Contact Us
              </Link>
              <Link
                href="#status"
                color="text.secondary"
                sx={{
                  textDecoration: 'none',
                  '&:hover': {
                    color: '#FFD700'
                  },
                  transition: 'color 0.3s ease'
                }}
              >
                System Status
              </Link>
            </Box>
          </Grid>

          {/* Legal */}
          <Grid item xs={12} md={2}>
            <Typography
              variant="h6"
              component="h3"
              sx={{
                color: '#FFD700',
                mb: 2,
                fontWeight: 'bold'
              }}
            >
              Legal
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link
                href="#privacy"
                color="text.secondary"
                sx={{
                  textDecoration: 'none',
                  '&:hover': {
                    color: '#FFD700'
                  },
                  transition: 'color 0.3s ease'
                }}
              >
                Privacy Policy
              </Link>
              <Link
                href="#terms"
                color="text.secondary"
                sx={{
                  textDecoration: 'none',
                  '&:hover': {
                    color: '#FFD700'
                  },
                  transition: 'color 0.3s ease'
                }}
              >
                Terms of Service
              </Link>
              <Link
                href="#cookies"
                color="text.secondary"
                sx={{
                  textDecoration: 'none',
                  '&:hover': {
                    color: '#FFD700'
                  },
                  transition: 'color 0.3s ease'
                }}
              >
                Cookie Policy
              </Link>
              <Link
                href="#license"
                color="text.secondary"
                sx={{
                  textDecoration: 'none',
                  '&:hover': {
                    color: '#FFD700'
                  },
                  transition: 'color 0.3s ease'
                }}
              >
                License
              </Link>
            </Box>
          </Grid>

          {/* Company */}
          <Grid item xs={12} md={2}>
            <Typography
              variant="h6"
              component="h3"
              sx={{
                color: '#FFD700',
                mb: 2,
                fontWeight: 'bold'
              }}
            >
              Company
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link
                href="#about"
                color="text.secondary"
                sx={{
                  textDecoration: 'none',
                  '&:hover': {
                    color: '#FFD700'
                  },
                  transition: 'color 0.3s ease'
                }}
              >
                About Us
              </Link>
              <Link
                href="#careers"
                color="text.secondary"
                sx={{
                  textDecoration: 'none',
                  '&:hover': {
                    color: '#FFD700'
                  },
                  transition: 'color 0.3s ease'
                }}
              >
                Careers
              </Link>
              <Link
                href="#press"
                color="text.secondary"
                sx={{
                  textDecoration: 'none',
                  '&:hover': {
                    color: '#FFD700'
                  },
                  transition: 'color 0.3s ease'
                }}
              >
                Press
              </Link>
              <Link
                href="#partners"
                color="text.secondary"
                sx={{
                  textDecoration: 'none',
                  '&:hover': {
                    color: '#FFD700'
                  },
                  transition: 'color 0.3s ease'
                }}
              >
                Partners
              </Link>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, borderColor: 'rgba(255, 215, 0, 0.2)' }} />

        {/* Bottom Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: { xs: 'center', md: 'left' } }}
          >
            © 2025 Soheil Kazemi Aghabagher. All rights reserved. 
            LionsunCoin (شیروخورشید) is a registered trademark.
          </Typography>
          
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: { xs: 'center', md: 'right' } }}
          >
            Made with ❤️ for the gaming community
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;