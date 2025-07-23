import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  LinearProgress,
  Chip,
  Button
} from '@mui/material';
import { useGameControls } from '../../hooks/useGamepad';

const ControllerDemo = () => {
  const { 
    connectedControllers, 
    playerInput, 
    isSupported,
    vibrate 
  } = useGameControls();

  const [gameState, setGameState] = useState({
    player: { x: 250, y: 250 },
    camera: { x: 0, y: 0 },
    score: 0,
    targets: [],
    effects: []
  });

  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  // Initialize targets
  useEffect(() => {
    const targets = [];
    for (let i = 0; i < 5; i++) {
      targets.push({
        id: i,
        x: Math.random() * 400 + 50,
        y: Math.random() * 400 + 50,
        color: `hsl(${Math.random() * 360}, 70%, 50%)`,
        size: 20
      });
    }
    setGameState(prev => ({ ...prev, targets }));
  }, []);

  // Game loop
  useEffect(() => {
    const gameLoop = () => {
      if (!canvasRef.current) return;

      // Update player position based on controller input
      setGameState(prev => {
        const newState = { ...prev };
        
        // Movement
        const speed = 5;
        newState.player.x += playerInput.movement.x * speed;
        newState.player.y += playerInput.movement.y * speed;
        
        // Boundary checking
        newState.player.x = Math.max(10, Math.min(490, newState.player.x));
        newState.player.y = Math.max(10, Math.min(490, newState.player.y));
        
        // Camera movement (visual effect)
        newState.camera.x += playerInput.camera.x * 2;
        newState.camera.y += playerInput.camera.y * 2;
        
        // Attack action - check collisions with targets
        if (playerInput.actions.attack) {
          newState.targets = newState.targets.filter(target => {
            const distance = Math.sqrt(
              Math.pow(target.x - newState.player.x, 2) + 
              Math.pow(target.y - newState.player.y, 2)
            );
            
            if (distance < 40) {
              newState.score += 10;
              // Add explosion effect
              newState.effects.push({
                id: Date.now(),
                x: target.x,
                y: target.y,
                life: 30
              });
              
              // Vibrate controller on hit
              connectedControllers.forEach(controller => {
                vibrate(controller.id, { intensity: 0.5, duration: 100 });
              });
              
              return false; // Remove target
            }
            return true;
          });
        }
        
        // Update effects
        newState.effects = newState.effects
          .map(effect => ({ ...effect, life: effect.life - 1 }))
          .filter(effect => effect.life > 0);
        
        return newState;
      });

      // Render
      render();
      animationRef.current = requestAnimationFrame(gameLoop);
    };

    if (isSupported) {
      animationRef.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [playerInput, isSupported, connectedControllers, vibrate]);

  const render = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;

    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, width, height);

    // Apply camera shake effect
    ctx.save();
    ctx.translate(gameState.camera.x * 0.1, gameState.camera.y * 0.1);

    // Draw grid
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    for (let i = 0; i <= width; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    for (let i = 0; i <= height; i += 50) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }

    // Draw targets
    gameState.targets.forEach(target => {
      ctx.fillStyle = target.color;
      ctx.beginPath();
      ctx.arc(target.x, target.y, target.size, 0, Math.PI * 2);
      ctx.fill();
      
      // Target pulse effect
      ctx.strokeStyle = target.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(target.x, target.y, target.size + Math.sin(Date.now() * 0.01) * 5, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Draw explosion effects
    gameState.effects.forEach(effect => {
      const alpha = effect.life / 30;
      ctx.fillStyle = `rgba(255, 255, 0, ${alpha})`;
      ctx.beginPath();
      ctx.arc(effect.x, effect.y, 30 - effect.life, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw player
    const playerSize = 15;
    
    // Player glow based on actions
    if (playerInput.actions.attack) {
      ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
      ctx.beginPath();
      ctx.arc(gameState.player.x, gameState.player.y, playerSize + 10, 0, Math.PI * 2);
      ctx.fill();
    }
    
    if (playerInput.actions.defend) {
      ctx.strokeStyle = 'rgba(0, 0, 255, 0.8)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(gameState.player.x, gameState.player.y, playerSize + 15, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Main player
    ctx.fillStyle = '#00ff00';
    ctx.beginPath();
    ctx.arc(gameState.player.x, gameState.player.y, playerSize, 0, Math.PI * 2);
    ctx.fill();

    // Player direction indicator (based on movement)
    if (playerInput.movement.x !== 0 || playerInput.movement.y !== 0) {
      const angle = Math.atan2(playerInput.movement.y, playerInput.movement.x);
      ctx.strokeStyle = '#00ff00';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(gameState.player.x, gameState.player.y);
      ctx.lineTo(
        gameState.player.x + Math.cos(angle) * 25,
        gameState.player.y + Math.sin(angle) * 25
      );
      ctx.stroke();
    }

    ctx.restore();
  };

  const resetGame = () => {
    const targets = [];
    for (let i = 0; i < 5; i++) {
      targets.push({
        id: i,
        x: Math.random() * 400 + 50,
        y: Math.random() * 400 + 50,
        color: `hsl(${Math.random() * 360}, 70%, 50%)`,
        size: 20
      });
    }
    setGameState({
      player: { x: 250, y: 250 },
      camera: { x: 0, y: 0 },
      score: 0,
      targets,
      effects: []
    });
  };

  if (!isSupported) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          Controller Demo Unavailable
        </Typography>
        <Typography>
          Your browser doesn't support gamepad input.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        🎮 Cross-Platform Controller Demo
      </Typography>
      
      <Grid container spacing={3}>
        {/* Game Canvas */}
        <Grid item xs={12} md={8}>
          <Box sx={{ position: 'relative', border: '2px solid #333', borderRadius: 1 }}>
            <canvas 
              ref={canvasRef}
              width={500}
              height={500}
              style={{ display: 'block', background: '#1a1a1a' }}
            />
            
            {connectedControllers.length === 0 && (
              <Box 
                sx={{ 
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  flexDirection: 'column',
                  gap: 2
                }}
              >
                <Typography variant="h6">
                  Connect a controller to play!
                </Typography>
                <Typography variant="body2">
                  Supports PS5, Xbox, Switch Pro, and PSP controllers
                </Typography>
              </Box>
            )}
          </Box>
        </Grid>

        {/* Controls and Status */}
        <Grid item xs={12} md={4}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Score: {gameState.score}
            </Typography>
            <Typography variant="body2" gutterBottom>
              Targets: {gameState.targets.length}
            </Typography>
            <Button variant="contained" onClick={resetGame} fullWidth>
              Reset Game
            </Button>
          </Box>

          {/* Input Status */}
          <Paper sx={{ p: 2, mb: 2, bgcolor: 'grey.100' }}>
            <Typography variant="subtitle1" gutterBottom>
              Input Status
            </Typography>
            
            <Box sx={{ mb: 1 }}>
              <Typography variant="caption">Movement:</Typography>
              <LinearProgress 
                variant="determinate" 
                value={Math.abs(playerInput.movement.x) * 100} 
                sx={{ mb: 0.5 }}
              />
              <LinearProgress 
                variant="determinate" 
                value={Math.abs(playerInput.movement.y) * 100} 
              />
            </Box>

            <Box sx={{ mb: 1 }}>
              <Typography variant="caption">Camera:</Typography>
              <LinearProgress 
                variant="determinate" 
                value={Math.abs(playerInput.camera.x) * 100} 
                sx={{ mb: 0.5 }}
              />
              <LinearProgress 
                variant="determinate" 
                value={Math.abs(playerInput.camera.y) * 100} 
              />
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {Object.entries(playerInput.actions).map(([action, pressed]) => (
                <Chip 
                  key={action}
                  label={action}
                  color={pressed ? 'primary' : 'default'}
                  size="small"
                  variant={pressed ? 'filled' : 'outlined'}
                />
              ))}
            </Box>
          </Paper>

          {/* Instructions */}
          <Paper sx={{ p: 2, bgcolor: 'info.light' }}>
            <Typography variant="subtitle1" gutterBottom>
              How to Play
            </Typography>
            <Typography variant="body2" component="div">
              • <strong>Left Stick:</strong> Move green player<br/>
              • <strong>Right Stick:</strong> Camera shake<br/>
              • <strong>Attack Button:</strong> Destroy targets nearby<br/>
              • <strong>Defend Button:</strong> Show shield<br/>
              • Hit all targets to win!
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ControllerDemo;