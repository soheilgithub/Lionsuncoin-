import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';

// Types
interface GameState {
  isPlaying: boolean;
  currentGame: Game | null;
  score: number;
  level: number;
  lives: number;
  coins: number;
  timeRemaining: number;
  isPaused: boolean;
  isGameOver: boolean;
  achievements: Achievement[];
}

interface Game {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  maxPlayers: number;
  minPlayers: number;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  rewardMultiplier: number;
  baseReward: number;
  averagePlayTime: number;
  rating: number;
  totalPlays: number;
  isMultiplayer: boolean;
  isPremium: boolean;
  requirements: {
    minLevel: number;
    minCoins?: number;
  };
  features: string[];
  screenshots: string[];
  controls: {
    keyboard?: string[];
    mouse?: boolean;
    touch?: boolean;
    gamepad?: boolean;
  };
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  reward: number;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
}

interface MultiplayerRoom {
  id: string;
  name: string;
  gameId: string;
  host: string;
  players: Player[];
  maxPlayers: number;
  isPrivate: boolean;
  status: 'waiting' | 'playing' | 'finished';
  settings: Record<string, any>;
}

interface Player {
  id: string;
  username: string;
  avatar?: string;
  level: number;
  isReady: boolean;
  score?: number;
  position?: number;
}

interface Leaderboard {
  gameId: string;
  period: 'daily' | 'weekly' | 'monthly' | 'allTime';
  entries: LeaderboardEntry[];
}

interface LeaderboardEntry {
  rank: number;
  player: {
    id: string;
    username: string;
    avatar?: string;
    level: number;
  };
  score: number;
  coinsEarned: number;
  playTime: number;
  achievements: number;
}

interface GameContextType {
  // Game State
  gameState: GameState;
  availableGames: Game[];
  currentRoom: MultiplayerRoom | null;
  leaderboards: Record<string, Leaderboard>;
  isConnected: boolean;
  
  // Game Actions
  startGame: (gameId: string, settings?: Record<string, any>) => Promise<boolean>;
  pauseGame: () => void;
  resumeGame: () => void;
  endGame: (score?: number) => Promise<boolean>;
  resetGame: () => void;
  
  // Multiplayer Actions
  createRoom: (gameId: string, roomSettings: Partial<MultiplayerRoom>) => Promise<string | null>;
  joinRoom: (roomId: string) => Promise<boolean>;
  leaveRoom: () => void;
  setPlayerReady: (ready: boolean) => void;
  invitePlayer: (playerId: string) => Promise<boolean>;
  
  // Data Actions
  loadGames: () => Promise<void>;
  loadLeaderboard: (gameId: string, period: 'daily' | 'weekly' | 'monthly' | 'allTime') => Promise<void>;
  submitScore: (gameId: string, score: number, metadata?: Record<string, any>) => Promise<boolean>;
  unlockAchievement: (achievementId: string) => Promise<boolean>;
  
  // Game Settings
  updateGameSettings: (settings: Record<string, any>) => void;
  getGameSettings: () => Record<string, any>;
}

interface GameProviderProps {
  children: ReactNode;
}

// Create context
const GameContext = createContext<GameContextType | undefined>(undefined);

// Default game state
const defaultGameState: GameState = {
  isPlaying: false,
  currentGame: null,
  score: 0,
  level: 1,
  lives: 3,
  coins: 0,
  timeRemaining: 0,
  isPaused: false,
  isGameOver: false,
  achievements: []
};

// API endpoints
const API_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://api.lionsuncoin.gaming' 
  : 'http://localhost:3001';

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const { socket, isAuthenticated, user } = useAuth();
  const [gameState, setGameState] = useState<GameState>(defaultGameState);
  const [availableGames, setAvailableGames] = useState<Game[]>([]);
  const [currentRoom, setCurrentRoom] = useState<MultiplayerRoom | null>(null);
  const [leaderboards, setLeaderboards] = useState<Record<string, Leaderboard>>({});
  const [gameSettings, setGameSettings] = useState<Record<string, any>>({});

  const isConnected = !!socket?.connected;

  // Load game settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('gameSettings');
    if (savedSettings) {
      try {
        setGameSettings(JSON.parse(savedSettings));
      } catch (err) {
        console.error('Failed to parse game settings:', err);
      }
    }
  }, []);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    // Game events
    socket.on('game_started', (data: { gameId: string; settings: Record<string, any> }) => {
      setGameState(prev => ({
        ...prev,
        isPlaying: true,
        isPaused: false,
        isGameOver: false
      }));
    });

    socket.on('game_paused', () => {
      setGameState(prev => ({ ...prev, isPaused: true }));
    });

    socket.on('game_resumed', () => {
      setGameState(prev => ({ ...prev, isPaused: false }));
    });

    socket.on('game_ended', (data: { score: number; coins: number; achievements: Achievement[] }) => {
      setGameState(prev => ({
        ...prev,
        isPlaying: false,
        isPaused: false,
        isGameOver: true,
        score: data.score,
        coins: prev.coins + data.coins,
        achievements: [...prev.achievements, ...data.achievements]
      }));
    });

    socket.on('score_updated', (data: { score: number; coins: number }) => {
      setGameState(prev => ({
        ...prev,
        score: data.score,
        coins: prev.coins + data.coins
      }));
    });

    // Multiplayer events
    socket.on('room_created', (room: MultiplayerRoom) => {
      setCurrentRoom(room);
    });

    socket.on('room_joined', (room: MultiplayerRoom) => {
      setCurrentRoom(room);
    });

    socket.on('room_left', () => {
      setCurrentRoom(null);
    });

    socket.on('room_updated', (room: MultiplayerRoom) => {
      setCurrentRoom(room);
    });

    socket.on('player_joined', (player: Player) => {
      setCurrentRoom(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          players: [...prev.players, player]
        };
      });
    });

    socket.on('player_left', (playerId: string) => {
      setCurrentRoom(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          players: prev.players.filter(p => p.id !== playerId)
        };
      });
    });

    socket.on('achievement_unlocked', (achievement: Achievement) => {
      setGameState(prev => ({
        ...prev,
        achievements: [...prev.achievements, achievement]
      }));
      
      // Show achievement notification
      console.log('Achievement unlocked:', achievement.name);
    });

    return () => {
      socket.off('game_started');
      socket.off('game_paused');
      socket.off('game_resumed');
      socket.off('game_ended');
      socket.off('score_updated');
      socket.off('room_created');
      socket.off('room_joined');
      socket.off('room_left');
      socket.off('room_updated');
      socket.off('player_joined');
      socket.off('player_left');
      socket.off('achievement_unlocked');
    };
  }, [socket]);

  // Load available games
  const loadGames = async (): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE}/api/games`);
      if (response.ok) {
        const games = await response.json();
        setAvailableGames(games);
      }
    } catch (err) {
      console.error('Failed to load games:', err);
    }
  };

  // Start game
  const startGame = async (gameId: string, settings?: Record<string, any>): Promise<boolean> => {
    try {
      const game = availableGames.find(g => g.id === gameId);
      if (!game) return false;

      if (!isAuthenticated || !socket) return false;

      // Check requirements
      if (user && user.level < game.requirements.minLevel) {
        throw new Error(`Level ${game.requirements.minLevel} required`);
      }

      if (game.requirements.minCoins && user && user.coins < game.requirements.minCoins) {
        throw new Error(`${game.requirements.minCoins} coins required`);
      }

      socket.emit('start_game', { gameId, settings });
      
      setGameState(prev => ({
        ...prev,
        currentGame: game,
        isPlaying: true,
        score: 0,
        level: 1,
        lives: 3,
        coins: 0,
        isPaused: false,
        isGameOver: false
      }));

      return true;
    } catch (err) {
      console.error('Failed to start game:', err);
      return false;
    }
  };

  // Pause game
  const pauseGame = (): void => {
    if (socket && gameState.isPlaying && !gameState.isPaused) {
      socket.emit('pause_game');
    }
  };

  // Resume game
  const resumeGame = (): void => {
    if (socket && gameState.isPlaying && gameState.isPaused) {
      socket.emit('resume_game');
    }
  };

  // End game
  const endGame = async (score?: number): Promise<boolean> => {
    try {
      if (!socket || !gameState.currentGame) return false;

      const finalScore = score ?? gameState.score;
      socket.emit('end_game', { score: finalScore });

      return true;
    } catch (err) {
      console.error('Failed to end game:', err);
      return false;
    }
  };

  // Reset game
  const resetGame = (): void => {
    setGameState(defaultGameState);
  };

  // Create multiplayer room
  const createRoom = async (gameId: string, roomSettings: Partial<MultiplayerRoom>): Promise<string | null> => {
    try {
      if (!socket || !isAuthenticated) return null;

      return new Promise((resolve) => {
        socket.emit('create_room', { gameId, ...roomSettings });
        
        const handleRoomCreated = (room: MultiplayerRoom) => {
          socket.off('room_created', handleRoomCreated);
          resolve(room.id);
        };
        
        socket.on('room_created', handleRoomCreated);
        
        setTimeout(() => {
          socket.off('room_created', handleRoomCreated);
          resolve(null);
        }, 5000);
      });
    } catch (err) {
      console.error('Failed to create room:', err);
      return null;
    }
  };

  // Join multiplayer room
  const joinRoom = async (roomId: string): Promise<boolean> => {
    try {
      if (!socket || !isAuthenticated) return false;

      return new Promise((resolve) => {
        socket.emit('join_room', { roomId });
        
        const handleRoomJoined = () => {
          socket.off('room_joined', handleRoomJoined);
          socket.off('room_join_error', handleRoomJoinError);
          resolve(true);
        };
        
        const handleRoomJoinError = () => {
          socket.off('room_joined', handleRoomJoined);
          socket.off('room_join_error', handleRoomJoinError);
          resolve(false);
        };
        
        socket.on('room_joined', handleRoomJoined);
        socket.on('room_join_error', handleRoomJoinError);
        
        setTimeout(() => {
          socket.off('room_joined', handleRoomJoined);
          socket.off('room_join_error', handleRoomJoinError);
          resolve(false);
        }, 5000);
      });
    } catch (err) {
      console.error('Failed to join room:', err);
      return false;
    }
  };

  // Leave multiplayer room
  const leaveRoom = (): void => {
    if (socket && currentRoom) {
      socket.emit('leave_room');
    }
  };

  // Set player ready status
  const setPlayerReady = (ready: boolean): void => {
    if (socket && currentRoom) {
      socket.emit('set_ready', { ready });
    }
  };

  // Invite player to room
  const invitePlayer = async (playerId: string): Promise<boolean> => {
    try {
      if (!socket || !currentRoom) return false;

      socket.emit('invite_player', { playerId, roomId: currentRoom.id });
      return true;
    } catch (err) {
      console.error('Failed to invite player:', err);
      return false;
    }
  };

  // Load leaderboard
  const loadLeaderboard = async (gameId: string, period: 'daily' | 'weekly' | 'monthly' | 'allTime'): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE}/api/leaderboard/${gameId}?period=${period}`);
      if (response.ok) {
        const leaderboard = await response.json();
        setLeaderboards(prev => ({
          ...prev,
          [`${gameId}_${period}`]: leaderboard
        }));
      }
    } catch (err) {
      console.error('Failed to load leaderboard:', err);
    }
  };

  // Submit score
  const submitScore = async (gameId: string, score: number, metadata?: Record<string, any>): Promise<boolean> => {
    try {
      if (!isAuthenticated) return false;

      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE}/api/games/${gameId}/score`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ score, metadata })
      });

      return response.ok;
    } catch (err) {
      console.error('Failed to submit score:', err);
      return false;
    }
  };

  // Unlock achievement
  const unlockAchievement = async (achievementId: string): Promise<boolean> => {
    try {
      if (!isAuthenticated) return false;

      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE}/api/achievements/${achievementId}/unlock`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      return response.ok;
    } catch (err) {
      console.error('Failed to unlock achievement:', err);
      return false;
    }
  };

  // Update game settings
  const updateGameSettings = (settings: Record<string, any>): void => {
    const newSettings = { ...gameSettings, ...settings };
    setGameSettings(newSettings);
    localStorage.setItem('gameSettings', JSON.stringify(newSettings));
  };

  // Get game settings
  const getGameSettings = (): Record<string, any> => {
    return gameSettings;
  };

  // Load games on mount
  useEffect(() => {
    if (isAuthenticated) {
      loadGames();
    }
  }, [isAuthenticated]);

  const value: GameContextType = {
    gameState,
    availableGames,
    currentRoom,
    leaderboards,
    isConnected,
    startGame,
    pauseGame,
    resumeGame,
    endGame,
    resetGame,
    createRoom,
    joinRoom,
    leaveRoom,
    setPlayerReady,
    invitePlayer,
    loadGames,
    loadLeaderboard,
    submitScore,
    unlockAchievement,
    updateGameSettings,
    getGameSettings
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

// Custom hook to use game context
export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};