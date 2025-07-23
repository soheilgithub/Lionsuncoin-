import React from 'react';
import { 
  Box, 
  Typography, 
  Chip, 
  Paper, 
  Grid, 
  IconButton,
  Tooltip 
} from '@mui/material';
import { 
  SportsEsports, 
  Gamepad, 
  VideogameAsset,
  PhoneAndroid,
  Vibration
} from '@mui/icons-material';
import { useGamepad } from '../../hooks/useGamepad';

const ControllerStatus = ({ onControllerTest }) => {
  const { 
    connectedControllers, 
    isSupported, 
    vibrate,
    setLightbar 
  } = useGamepad();

  const getControllerIcon = (type) => {
    switch (type) {
      case 'DualSense':
        return <SportsEsports sx={{ color: '#0070f3' }} />;
      case 'Xbox':
        return <Gamepad sx={{ color: '#107c10' }} />;
      case 'SwitchPro':
        return <VideogameAsset sx={{ color: '#e60012' }} />;
      case 'PSP':
        return <PhoneAndroid sx={{ color: '#ff6600' }} />;
      default:
        return <SportsEsports />;
    }
  };

  const getControllerColor = (type) => {
    switch (type) {
      case 'DualSense':
        return 'primary';
      case 'Xbox':
        return 'success';
      case 'SwitchPro':
        return 'error';
      case 'PSP':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getControllerName = (type) => {
    switch (type) {
      case 'DualSense':
        return 'PlayStation 5';
      case 'Xbox':
        return 'Xbox Series';
      case 'SwitchPro':
        return 'Switch Pro';
      case 'PSP':
        return 'PSP';
      default:
        return 'Generic';
    }
  };

  const testVibration = (controllerId, type) => {
    const patterns = {
      DualSense: { intensity: 0.8, duration: 200 },
      Xbox: { strong: 0.7, weak: 0.5, duration: 200 },
      SwitchPro: { intensity: 0.6, duration: 150 },
      PSP: { duration: 100 }
    };

    vibrate(controllerId, patterns[type] || patterns.Xbox);
    
    // PS5 lightbar demo
    if (type === 'DualSense') {
      setLightbar(controllerId, '#00ff00');
      setTimeout(() => setLightbar(controllerId, '#0000ff'), 500);
    }
  };

  if (!isSupported) {
    return (
      <Paper sx={{ p: 2, bgcolor: 'error.light', color: 'error.contrastText' }}>
        <Typography variant="h6" gutterBottom>
          🎮 Controller Support Not Available
        </Typography>
        <Typography variant="body2">
          Your browser doesn't support the Gamepad API. Please use a modern browser like Chrome, Firefox, or Edge.
        </Typography>
      </Paper>
    );
  }

  if (connectedControllers.length === 0) {
    return (
      <Paper sx={{ p: 2, bgcolor: 'warning.light', color: 'warning.contrastText' }}>
        <Typography variant="h6" gutterBottom>
          🎮 No Controllers Connected
        </Typography>
        <Typography variant="body2" gutterBottom>
          Connect your controller to enhance your gaming experience:
        </Typography>
        <Grid container spacing={1} sx={{ mt: 1 }}>
          <Grid item>
            <Chip 
              icon={<SportsEsports />} 
              label="PlayStation 5" 
              size="small"
              color="primary"
            />
          </Grid>
          <Grid item>
            <Chip 
              icon={<Gamepad />} 
              label="Xbox Series" 
              size="small"
              color="success"
            />
          </Grid>
          <Grid item>
            <Chip 
              icon={<VideogameAsset />} 
              label="Switch Pro" 
              size="small"
              color="error"
            />
          </Grid>
          <Grid item>
            <Chip 
              icon={<PhoneAndroid />} 
              label="PSP" 
              size="small"
              color="warning"
            />
          </Grid>
        </Grid>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2, bgcolor: 'success.light', color: 'success.contrastText' }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        🎮 Controllers Connected ({connectedControllers.length})
      </Typography>
      
      <Grid container spacing={2}>
        {connectedControllers.map((controller) => (
          <Grid item xs={12} sm={6} md={4} key={controller.id}>
            <Box 
              sx={{ 
                p: 2, 
                bgcolor: 'background.paper',
                borderRadius: 1,
                color: 'text.primary',
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}
            >
              {getControllerIcon(controller.type)}
              
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {getControllerName(controller.type)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Player {controller.id + 1}
                </Typography>
                <Chip 
                  label={controller.type} 
                  size="small" 
                  color={getControllerColor(controller.type)}
                  sx={{ mt: 0.5 }}
                />
              </Box>
              
              <Tooltip title="Test Vibration">
                <IconButton 
                  size="small"
                  onClick={() => testVibration(controller.id, controller.type)}
                  sx={{ color: 'primary.main' }}
                >
                  <Vibration />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 2, p: 1, bgcolor: 'rgba(0,0,0,0.1)', borderRadius: 1 }}>
        <Typography variant="caption" display="block">
          💡 <strong>Controls:</strong>
        </Typography>
        <Typography variant="caption" display="block">
          • PS5: ✕ Jump, ▢ Attack, ○ Defend, △ Special
        </Typography>
        <Typography variant="caption" display="block">
          • Xbox: A Jump, X Attack, B Defend, Y Special  
        </Typography>
        <Typography variant="caption" display="block">
          • Switch: B Jump, Y Attack, A Defend, X Special
        </Typography>
        <Typography variant="caption" display="block">
          • PSP: ✕ Jump, ▢ Attack, ○ Defend, △ Special
        </Typography>
      </Box>
    </Paper>
  );
};

export default ControllerStatus;