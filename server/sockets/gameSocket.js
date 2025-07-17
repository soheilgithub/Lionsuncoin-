const jwt = require('jsonwebtoken');
const { users } = require('../routes/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'lionsuncoin_secret_key_2024';

// Active game sessions and player connections
const activeSessions = new Map();
const connectedPlayers = new Map();
const gameRooms = new Map();

function gameSocket(io) {
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }
      
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = users.find(u => u.id === decoded.userId);
      
      if (!user) {
        return next(new Error('User not found'));
      }
      
      socket.userId = decoded.userId;
      socket.username = decoded.username;
      socket.platform = decoded.platform;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });
  
  io.on('connection', (socket) => {
    console.log(`🎮 Player connected: ${socket.username} (${socket.platform})`);
    
    // Add player to connected players
    connectedPlayers.set(socket.userId, {
      socketId: socket.id,
      username: socket.username,
      platform: socket.platform,
      connectedAt: new Date().toISOString(),
      currentGame: null,
      status: 'online'
    });
    
    // Notify others of player online status
    socket.broadcast.emit('player_online', {
      userId: socket.userId,
      username: socket.username,
      platform: socket.platform
    });
    
    // Send current online players to new connection
    socket.emit('online_players', Array.from(connectedPlayers.values()));
    
    // Handle joining a game session
    socket.on('join_game', (data) => {
      try {
        const { gameId, sessionId, gameMode } = data;
        
        // Leave any previous game room
        if (socket.currentRoom) {
          socket.leave(socket.currentRoom);
        }
        
        const roomName = `game_${gameId}_${gameMode || 'single'}`;
        socket.join(roomName);
        socket.currentRoom = roomName;
        socket.currentGame = gameId;
        
        // Update player status
        const player = connectedPlayers.get(socket.userId);
        if (player) {
          player.currentGame = gameId;
          player.status = 'playing';
        }
        
        // Initialize game room if needed
        if (!gameRooms.has(roomName)) {
          gameRooms.set(roomName, {
            gameId,
            gameMode: gameMode || 'single',
            players: [],
            maxPlayers: gameMode === 'multiplayer' ? 4 : 1,
            status: 'waiting',
            createdAt: new Date().toISOString()
          });
        }
        
        const gameRoom = gameRooms.get(roomName);
        
        // Add player to room if not already present
        if (!gameRoom.players.find(p => p.userId === socket.userId)) {
          gameRoom.players.push({
            userId: socket.userId,
            username: socket.username,
            platform: socket.platform,
            socketId: socket.id,
            joinedAt: new Date().toISOString(),
            score: 0,
            status: 'ready'
          });
        }
        
        socket.emit('game_joined', {
          roomName,
          gameRoom,
          playerCount: gameRoom.players.length
        });
        
        // Notify room about new player
        socket.to(roomName).emit('player_joined', {
          userId: socket.userId,
          username: socket.username,
          platform: socket.platform,
          playerCount: gameRoom.players.length
        });
        
        // Start multiplayer game if room is full
        if (gameMode === 'multiplayer' && gameRoom.players.length >= 2) {
          gameRoom.status = 'starting';
          io.to(roomName).emit('game_starting', {
            countdown: 5,
            players: gameRoom.players
          });
          
          // Start game after countdown
          setTimeout(() => {
            gameRoom.status = 'active';
            io.to(roomName).emit('game_started', {
              gameRoom,
              startTime: new Date().toISOString()
            });
          }, 5000);
        }
        
      } catch (error) {
        console.error('Join game error:', error);
        socket.emit('error', { message: 'Failed to join game' });
      }
    });
    
    // Handle real-time game updates
    socket.on('game_update', (data) => {
      try {
        const { score, position, powerups, lives, timeElapsed } = data;
        
        if (socket.currentRoom) {
          const gameRoom = gameRooms.get(socket.currentRoom);
          if (gameRoom) {
            // Update player data in room
            const player = gameRoom.players.find(p => p.userId === socket.userId);
            if (player) {
              player.score = score || player.score;
              player.position = position;
              player.powerups = powerups;
              player.lives = lives;
              player.timeElapsed = timeElapsed;
              player.lastUpdate = new Date().toISOString();
            }
            
            // Broadcast update to other players in room
            socket.to(socket.currentRoom).emit('player_update', {
              userId: socket.userId,
              username: socket.username,
              score,
              position,
              powerups,
              lives,
              timeElapsed
            });
          }
        }
      } catch (error) {
        console.error('Game update error:', error);
      }
    });
    
    // Handle game completion
    socket.on('game_completed', (data) => {
      try {
        const { score, timeElapsed, achievements, gameResult } = data;
        
        if (socket.currentRoom) {
          const gameRoom = gameRooms.get(socket.currentRoom);
          if (gameRoom) {
            // Update player final data
            const player = gameRoom.players.find(p => p.userId === socket.userId);
            if (player) {
              player.finalScore = score;
              player.finalTime = timeElapsed;
              player.achievements = achievements;
              player.gameResult = gameResult;
              player.status = 'completed';
              player.completedAt = new Date().toISOString();
            }
            
            // Notify other players
            socket.to(socket.currentRoom).emit('player_completed', {
              userId: socket.userId,
              username: socket.username,
              score,
              timeElapsed,
              achievements,
              gameResult
            });
            
            // Check if all players completed (for multiplayer)
            const allCompleted = gameRoom.players.every(p => p.status === 'completed');
            if (allCompleted && gameRoom.gameMode === 'multiplayer') {
              // Calculate final rankings
              const rankings = gameRoom.players
                .sort((a, b) => b.finalScore - a.finalScore)
                .map((player, index) => ({
                  rank: index + 1,
                  userId: player.userId,
                  username: player.username,
                  score: player.finalScore,
                  timeElapsed: player.finalTime,
                  achievements: player.achievements
                }));
              
              // Send final results to all players
              io.to(socket.currentRoom).emit('game_results', {
                rankings,
                winner: rankings[0],
                completedAt: new Date().toISOString()
              });
              
              // Clean up room after delay
              setTimeout(() => {
                gameRooms.delete(socket.currentRoom);
              }, 30000); // 30 seconds
            }
          }
        }
        
        // Update player status
        const player = connectedPlayers.get(socket.userId);
        if (player) {
          player.currentGame = null;
          player.status = 'online';
        }
        
      } catch (error) {
        console.error('Game completed error:', error);
      }
    });
    
    // Handle chat messages in game rooms
    socket.on('game_chat', (data) => {
      try {
        const { message, type } = data;
        
        if (socket.currentRoom && message && message.trim()) {
          const chatMessage = {
            userId: socket.userId,
            username: socket.username,
            message: message.trim(),
            type: type || 'chat',
            timestamp: new Date().toISOString()
          };
          
          // Send to all players in room
          io.to(socket.currentRoom).emit('chat_message', chatMessage);
        }
      } catch (error) {
        console.error('Game chat error:', error);
      }
    });
    
    // Handle power-up events
    socket.on('powerup_used', (data) => {
      try {
        const { powerupType, position, effect } = data;
        
        if (socket.currentRoom) {
          socket.to(socket.currentRoom).emit('powerup_activated', {
            userId: socket.userId,
            username: socket.username,
            powerupType,
            position,
            effect,
            timestamp: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error('Powerup error:', error);
      }
    });
    
    // Handle leaving game
    socket.on('leave_game', () => {
      try {
        if (socket.currentRoom) {
          const gameRoom = gameRooms.get(socket.currentRoom);
          if (gameRoom) {
            // Remove player from room
            gameRoom.players = gameRoom.players.filter(p => p.userId !== socket.userId);
            
            // Notify other players
            socket.to(socket.currentRoom).emit('player_left', {
              userId: socket.userId,
              username: socket.username,
              playerCount: gameRoom.players.length
            });
            
            // Clean up empty rooms
            if (gameRoom.players.length === 0) {
              gameRooms.delete(socket.currentRoom);
            }
          }
          
          socket.leave(socket.currentRoom);
          socket.currentRoom = null;
          socket.currentGame = null;
        }
        
        // Update player status
        const player = connectedPlayers.get(socket.userId);
        if (player) {
          player.currentGame = null;
          player.status = 'online';
        }
        
      } catch (error) {
        console.error('Leave game error:', error);
      }
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`🎮 Player disconnected: ${socket.username}`);
      
      // Clean up player from active games
      if (socket.currentRoom) {
        const gameRoom = gameRooms.get(socket.currentRoom);
        if (gameRoom) {
          gameRoom.players = gameRoom.players.filter(p => p.userId !== socket.userId);
          
          socket.to(socket.currentRoom).emit('player_disconnected', {
            userId: socket.userId,
            username: socket.username,
            playerCount: gameRoom.players.length
          });
          
          if (gameRoom.players.length === 0) {
            gameRooms.delete(socket.currentRoom);
          }
        }
      }
      
      // Remove from connected players
      connectedPlayers.delete(socket.userId);
      
      // Notify others of player offline status
      socket.broadcast.emit('player_offline', {
        userId: socket.userId,
        username: socket.username
      });
    });
  });
  
  // Periodic cleanup of inactive sessions
  setInterval(() => {
    const now = Date.now();
    const timeout = 30 * 60 * 1000; // 30 minutes
    
    for (const [sessionId, session] of activeSessions.entries()) {
      if (now - new Date(session.lastActivity).getTime() > timeout) {
        activeSessions.delete(sessionId);
      }
    }
  }, 5 * 60 * 1000); // Check every 5 minutes
}

module.exports = gameSocket;