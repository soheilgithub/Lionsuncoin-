const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  game: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  coinsRewarded: {
    type: Number,
    default: 0
  },
  unlockedAt: {
    type: Date,
    default: Date.now
  },
  rarity: {
    type: String,
    enum: ['common', 'rare', 'epic', 'legendary'],
    default: 'common'
  }
});

const gameStatsSchema = new mongoose.Schema({
  game: {
    type: String,
    required: true
  },
  gamesPlayed: {
    type: Number,
    default: 0
  },
  gamesWon: {
    type: Number,
    default: 0
  },
  highScore: {
    type: Number,
    default: 0
  },
  totalScore: {
    type: Number,
    default: 0
  },
  totalTime: {
    type: Number,
    default: 0
  },
  coinsEarned: {
    type: Number,
    default: 0
  },
  achievements: [achievementSchema],
  lastPlayed: Date
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 20,
    match: /^[a-zA-Z0-9_]+$/
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  coins: {
    type: Number,
    default: 1000,
    min: 0
  },
  level: {
    type: Number,
    default: 1,
    min: 1
  },
  experience: {
    type: Number,
    default: 0,
    min: 0
  },
  platform: {
    type: String,
    enum: ['web', 'ios', 'android', 'windows', 'macos', 'linux', 'ps5'],
    default: 'web'
  },
  avatar: {
    type: String,
    default: null
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'dark'
    },
    soundEnabled: {
      type: Boolean,
      default: true
    },
    musicEnabled: {
      type: Boolean,
      default: true
    },
    notifications: {
      type: Boolean,
      default: true
    },
    language: {
      type: String,
      default: 'en'
    }
  },
  stats: {
    totalGamesPlayed: {
      type: Number,
      default: 0
    },
    totalGamesWon: {
      type: Number,
      default: 0
    },
    totalPlayTime: {
      type: Number,
      default: 0
    },
    totalCoinsEarned: {
      type: Number,
      default: 0
    },
    totalCoinsSpent: {
      type: Number,
      default: 0
    },
    currentStreak: {
      type: Number,
      default: 0
    },
    longestStreak: {
      type: Number,
      default: 0
    },
    favoriteGame: String,
    gameStats: [gameStatsSchema]
  },
  achievements: [achievementSchema],
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  friendRequests: [{
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    sentAt: {
      type: Date,
      default: Date.now
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  premiumExpires: Date,
  lastLogin: {
    type: Date,
    default: Date.now
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Calculate level based on experience
userSchema.virtual('calculatedLevel').get(function() {
  return Math.floor(this.experience / 1000) + 1;
});

// Calculate experience needed for next level
userSchema.virtual('experienceToNextLevel').get(function() {
  const currentLevelExp = (this.level - 1) * 1000;
  const nextLevelExp = this.level * 1000;
  return nextLevelExp - this.experience;
});

// Calculate win rate
userSchema.virtual('winRate').get(function() {
  if (this.stats.totalGamesPlayed === 0) return 0;
  return (this.stats.totalGamesWon / this.stats.totalGamesPlayed * 100).toFixed(2);
});

// Add experience and check for level up
userSchema.methods.addExperience = function(exp) {
  this.experience += exp;
  const newLevel = Math.floor(this.experience / 1000) + 1;
  
  if (newLevel > this.level) {
    const levelDiff = newLevel - this.level;
    this.level = newLevel;
    
    // Award coins for leveling up
    this.coins += levelDiff * 100;
    
    return {
      leveledUp: true,
      newLevel: this.level,
      coinsAwarded: levelDiff * 100
    };
  }
  
  return { leveledUp: false };
};

// Add coins with validation
userSchema.methods.addCoins = function(amount) {
  if (amount > 0) {
    this.coins += amount;
    this.stats.totalCoinsEarned += amount;
  }
  return this.coins;
};

// Spend coins with validation
userSchema.methods.spendCoins = function(amount) {
  if (amount <= 0) return false;
  if (this.coins < amount) return false;
  
  this.coins -= amount;
  this.stats.totalCoinsSpent += amount;
  return true;
};

// Add achievement
userSchema.methods.addAchievement = function(achievementData) {
  // Check if achievement already exists
  const existing = this.achievements.find(
    ach => ach.game === achievementData.game && ach.name === achievementData.name
  );
  
  if (!existing) {
    this.achievements.push(achievementData);
    
    // Award coins if specified
    if (achievementData.coinsRewarded > 0) {
      this.addCoins(achievementData.coinsRewarded);
    }
    
    return true;
  }
  
  return false;
};

// Update game stats
userSchema.methods.updateGameStats = function(gameType, gameData) {
  let gameStats = this.stats.gameStats.find(gs => gs.game === gameType);
  
  if (!gameStats) {
    gameStats = {
      game: gameType,
      gamesPlayed: 0,
      gamesWon: 0,
      highScore: 0,
      totalScore: 0,
      totalTime: 0,
      coinsEarned: 0,
      achievements: [],
      lastPlayed: new Date()
    };
    this.stats.gameStats.push(gameStats);
  }
  
  // Update stats
  gameStats.gamesPlayed += 1;
  this.stats.totalGamesPlayed += 1;
  
  if (gameData.won) {
    gameStats.gamesWon += 1;
    this.stats.totalGamesWon += 1;
  }
  
  if (gameData.score > gameStats.highScore) {
    gameStats.highScore = gameData.score;
  }
  
  gameStats.totalScore += gameData.score || 0;
  gameStats.totalTime += gameData.playTime || 0;
  gameStats.lastPlayed = new Date();
  
  this.stats.totalPlayTime += gameData.playTime || 0;
  
  // Update favorite game
  const favoriteGameStats = this.stats.gameStats.reduce((prev, current) => 
    (prev.gamesPlayed > current.gamesPlayed) ? prev : current
  );
  this.stats.favoriteGame = favoriteGameStats.game;
};

// Create indexes for performance
userSchema.index({ username: 1 });
userSchema.index({ email: 1 });
userSchema.index({ level: -1 });
userSchema.index({ coins: -1 });
userSchema.index({ 'stats.totalGamesPlayed': -1 });
userSchema.index({ lastActivity: -1 });

module.exports = mongoose.model('User', userSchema);