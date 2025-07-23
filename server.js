const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { RateLimiterMemory } = require('rate-limiter-flexible');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "wss:", "ws:"],
    },
  },
}));

app.use(compression());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));
// Serve static assets with long-term caching for hashed filenames
app.use(
  '/assets',
  express.static(path.join(__dirname, 'public', 'assets'), {
    maxAge: '365d',
    immutable: true,
  })
);

// Rate limiting
const rateLimiter = new RateLimiterMemory({
  keyGenerator: (req) => req.ip,
  points: 100, // Number of requests
  duration: 60, // Per 60 seconds
});

app.use(async (req, res, next) => {
  try {
    await rateLimiter.consume(req.ip);
    next();
  } catch (rejRes) {
    res.status(429).json({ error: 'Too many requests' });
  }
});

// MongoDB connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lionsuncoin', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  lionsunCoins: { type: Number, default: 1000 },
  level: { type: Number, default: 1 },
  experience: { type: Number, default: 0 },
  gamesPlayed: { type: Number, default: 0 },
  achievements: [{ type: String }],
  platform: { type: String, enum: ['web', 'ios', 'android', 'ps5', 'windows', 'linux'], default: 'web' },
  walletAddress: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Game Session Schema
const gameSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  gameType: { type: String, required: true },
  score: { type: Number, default: 0 },
  coinsEarned: { type: Number, default: 0 },
  duration: { type: Number, default: 0 },
  platform: { type: String, required: true },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const GameSession = mongoose.model('GameSession', gameSessionSchema);

// JWT middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'lionsuncoin-secret', (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// API Routes
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password, platform = 'web' } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      platform
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET || 'lionsuncoin-secret',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        lionsunCoins: user.lionsunCoins,
        level: user.level,
        platform: user.platform
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET || 'lionsuncoin-secret',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        lionsunCoins: user.lionsunCoins,
        level: user.level,
        platform: user.platform,
        experience: user.experience,
        gamesPlayed: user.gamesPlayed,
        achievements: user.achievements
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/game/start', authenticateToken, async (req, res) => {
  try {
    const { gameType, platform } = req.body;
    
    const gameSession = new GameSession({
      userId: req.user.userId,
      gameType,
      platform
    });

    await gameSession.save();

    res.json({
      message: 'Game session started',
      sessionId: gameSession._id,
      gameType,
      platform
    });
  } catch (error) {
    console.error('Game start error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/game/complete', authenticateToken, async (req, res) => {
  try {
    const { sessionId, score, duration } = req.body;
    
    const gameSession = await GameSession.findById(sessionId);
    if (!gameSession || gameSession.userId.toString() !== req.user.userId) {
      return res.status(404).json({ error: 'Game session not found' });
    }

    // Calculate coins earned based on score
    const coinsEarned = Math.floor(score / 100) + 10;
    const experienceGained = Math.floor(score / 50);

    // Update game session
    gameSession.score = score;
    gameSession.duration = duration;
    gameSession.coinsEarned = coinsEarned;
    gameSession.completed = true;
    await gameSession.save();

    // Update user stats
    const user = await User.findById(req.user.userId);
    user.lionsunCoins += coinsEarned;
    user.experience += experienceGained;
    user.gamesPlayed += 1;
    
    // Level up logic
    const newLevel = Math.floor(user.experience / 1000) + 1;
    if (newLevel > user.level) {
      user.level = newLevel;
      user.lionsunCoins += newLevel * 100; // Bonus coins for leveling up
    }

    await user.save();

    res.json({
      message: 'Game completed successfully',
      coinsEarned,
      experienceGained,
      newLevel: user.level,
      totalCoins: user.lionsunCoins,
      totalExperience: user.experience
    });
  } catch (error) {
    console.error('Game complete error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/leaderboard', async (req, res) => {
  try {
    const leaderboard = await User.find()
      .select('username level experience lionsunCoins gamesPlayed')
      .sort({ experience: -1 })
      .limit(100);

    res.json(leaderboard);
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/games', (req, res) => {
  const games = [
    {
      id: 'puzzle-master',
      name: 'Puzzle Master',
      description: 'Solve challenging puzzles and earn Lionsuncoins',
      category: 'puzzle',
      platforms: ['web', 'ios', 'android', 'windows', 'linux'],
      minCoinsReward: 10,
      maxCoinsReward: 100
    },
    {
      id: 'space-defender',
      name: 'Space Defender',
      description: 'Defend the galaxy from alien invaders',
      category: 'action',
      platforms: ['web', 'ios', 'android', 'ps5', 'windows', 'linux'],
      minCoinsReward: 15,
      maxCoinsReward: 150
    },
    {
      id: 'coin-runner',
      name: 'Coin Runner',
      description: 'Collect coins while running through obstacles',
      category: 'arcade',
      platforms: ['web', 'ios', 'android', 'windows', 'linux'],
      minCoinsReward: 5,
      maxCoinsReward: 80
    },
    {
      id: 'strategy-empire',
      name: 'Strategy Empire',
      description: 'Build your empire and conquer territories',
      category: 'strategy',
      platforms: ['web', 'ps5', 'windows', 'linux'],
      minCoinsReward: 20,
      maxCoinsReward: 200
    }
  ];

  res.json(games);
});

// Socket.IO for real-time gaming
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-game', (data) => {
    const { gameType, userId } = data;
    socket.join(`game-${gameType}`);
    socket.to(`game-${gameType}`).emit('player-joined', { userId, socketId: socket.id });
  });

  socket.on('game-move', (data) => {
    socket.to(`game-${data.gameType}`).emit('opponent-move', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Serve the main application
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3000;

// Initialize database connection and start server
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Lionsuncoin Gaming Platform running on port ${PORT}`);
    console.log(`🎮 Multi-platform gaming server ready!`);
    console.log(`💰 Cryptocurrency integration active`);
  });
});

module.exports = app;