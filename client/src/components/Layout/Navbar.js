import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountBalanceWallet,
  Games,
  Leaderboard,
  Person
} from '@mui/icons-material';

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = React.useState(null);

  // Mock authentication state - replace with actual auth logic
  const isAuthenticated = false;
  const user = null;

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMobileMenuAnchor(null);
  };

  const handleLogout = () => {
    // Add logout logic here
    handleMenuClose();
    navigate('/');
  };

  const menuId = 'primary-account-menu';
  const mobileMenuId = 'primary-account-menu-mobile';

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        background: 'rgba(15, 15, 35, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 215, 0, 0.2)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Logo and Brand */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{
                fontWeight: 'bold',
                color: '#FFD700',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                '&:hover': {
                  color: '#FFA500'
                }
              }}
            >
              🦁 LionsunCoin
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                component={RouterLink}
                to="/games"
                color="inherit"
                startIcon={<Games />}
                sx={{
                  '&:hover': {
                    color: '#FFD700',
                    backgroundColor: 'rgba(255, 215, 0, 0.1)'
                  }
                }}
              >
                Games
              </Button>
              <Button
                component={RouterLink}
                to="/leaderboard"
                color="inherit"
                startIcon={<Leaderboard />}
                sx={{
                  '&:hover': {
                    color: '#FFD700',
                    backgroundColor: 'rgba(255, 215, 0, 0.1)'
                  }
                }}
              >
                Leaderboard
              </Button>
              {isAuthenticated && (
                <Button
                  component={RouterLink}
                  to="/wallet"
                  color="inherit"
                  startIcon={<AccountBalanceWallet />}
                  sx={{
                    '&:hover': {
                      color: '#FFD700',
                      backgroundColor: 'rgba(255, 215, 0, 0.1)'
                    }
                  }}
                >
                  Wallet
                </Button>
              )}
            </Box>
          )}

          {/* Authentication Buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isAuthenticated ? (
              <>
                <IconButton
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  sx={{ color: '#FFD700' }}
                >
                  <Avatar sx={{ width: 32, height: 32, bgcolor: '#FFA500' }}>
                    <Person />
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  id={menuId}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  sx={{
                    '& .MuiPaper-root': {
                      background: 'rgba(15, 15, 35, 0.95)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 215, 0, 0.2)',
                      color: 'white'
                    }
                  }}
                >
                  <MenuItem 
                    component={RouterLink} 
                    to="/profile"
                    onClick={handleMenuClose}
                  >
                    Profile
                  </MenuItem>
                  <MenuItem 
                    component={RouterLink} 
                    to="/dashboard"
                    onClick={handleMenuClose}
                  >
                    Dashboard
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  component={RouterLink}
                  to="/login"
                  color="inherit"
                  sx={{
                    '&:hover': {
                      color: '#FFD700',
                      backgroundColor: 'rgba(255, 215, 0, 0.1)'
                    }
                  }}
                >
                  Login
                </Button>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  sx={{
                    background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                    color: 'white',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #FFA500, #FFD700)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)'
                    }
                  }}
                >
                  Sign Up
                </Button>
              </>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton
                edge="end"
                color="inherit"
                aria-label="menu"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                sx={{ ml: 1 }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>

        {/* Mobile Menu */}
        <Menu
          anchorEl={mobileMenuAnchor}
          id={mobileMenuId}
          keepMounted
          open={Boolean(mobileMenuAnchor)}
          onClose={handleMenuClose}
          sx={{
            '& .MuiPaper-root': {
              background: 'rgba(15, 15, 35, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 215, 0, 0.2)',
              color: 'white',
              minWidth: 200
            }
          }}
        >
          <MenuItem 
            component={RouterLink} 
            to="/games"
            onClick={handleMenuClose}
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <Games /> Games
          </MenuItem>
          <MenuItem 
            component={RouterLink} 
            to="/leaderboard"
            onClick={handleMenuClose}
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <Leaderboard /> Leaderboard
          </MenuItem>
          {isAuthenticated && (
            <MenuItem 
              component={RouterLink} 
              to="/wallet"
              onClick={handleMenuClose}
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <AccountBalanceWallet /> Wallet
            </MenuItem>
          )}
        </Menu>
      </Container>
    </AppBar>
  );
};

export default Navbar;