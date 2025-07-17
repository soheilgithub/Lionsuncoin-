const express = require('express');
const User = require('../models/User');
const { authenticateToken, optionalAuth, gameRateLimiter } = require('../middleware/auth');
const router = express.Router();

// Available games configuration
const GAMES = {
  'snake': {
    name: 'Snake',
    category: 'arcade',
    maxScore: 999999,
    coinsPerPoint: 0.1,
    achievements: [
      { name: 'First Bite', description: 'Score your first point', requirement: 1, coins: 10 },
      { name: 'Snake Charmer', description: 'Score 100 points', requirement: 100, coins: 50 },
      { name: 'Python Master', description: 'Score 500 points', requirement: 500, coins: 200 },
      { name: 'Legendary Serpent', description: 'Score 1000 points', requirement: 1000, coins: 500 }
    ]
  },
  'tetris': {
    name: 'Tetris',
    category: 'puzzle',
    maxScore: 999999,
    coinsPerPoint: 0.15,
    achievements: [
      { name: 'Block Dropper', description: 'Clear your first line', requirement: 1, coins: 10 },
      { name: 'Tetris Rookie', description: 'Score 1000 points', requirement: 1000, coins: 75 },
      { name: 'Line Clearer', description: 'Score 5000 points', requirement: 5000, coins: 300 },
      { name: 'Tetris Master', description: 'Score 10000 points', requirement: 10000, coins: 750 }
    ]
  },
  'memory': {
    name: 'Memory Match',
    category: 'puzzle',
    maxScore: 100,
    coinsPerPoint: 2,
    achievements: [
      { name: 'Sharp Mind', description: 'Complete first level', requirement: 1, coins: 15 },
      { name: 'Memory Bank', description: 'Score 50 points', requirement: 50, coins: 100 },
      { name: 'Perfect Recall', description: 'Get perfect score', requirement: 100, coins: 500 }
    ]
  },
  'platformer': {
    name: 'Lion Jump',
    category: 'action',
    maxScore: 999999,
    coinsPerPoint: 0.2,
    achievements: [
      { name: 'First Leap', description: 'Complete first jump', requirement: 1, coins: 10 },
      { name: 'High Jumper', description: 'Score 200 points', requirement: 200, coins: 80 },
      { name: 'Platform King', description: 'Score 1000 points', requirement: 1000, coins: 400 },
      { name: 'Lion Legend', description: 'Score 5000 points', requirement: 5000, coins: 1000 }
    ]
  },
  'puzzle': {
    name: 'Coin Puzzle',
    category: 'puzzle',
    maxScore: 999,
    coinsPerPoint: 1,
    achievements: [
      { name: 'Puzzle Solver', description: 'Solve first puzzle', requirement: 1, coins: 20 },
      { name: 'Brain Power', description: 'Score 100 points', requirement: 100, coins: 150 },
      { name: 'Master Puzzler', description: 'Score 500 points', requirement: 500, coins: 600 }
    ]
  }
};

// Get all available games
router.get('/', optionalAuth, (req, res) => {
  try {
    const gamesList = Object.keys(GAMES).map(gameId => ({
      id: gameId,
      ...GAMES[gameId],
      // Don't expose coins calculation to client
      coinsPerPoint: undefined
    }));

    res.json({
      games: gamesList,
      totalGames: gamesList.length
    });
  } catch (error) {
    console.error('Get games error:', error);
    res.status(500).json({
      error: 'Failed to fetch games'
    });
  }
});

// Get specific game info
router.get('/:gameId', optionalAuth, (req, res) => {
  try {
    const { gameId } = req.params;
    const game = GAMES[gameId];

    if (!game) {
      return res.status(404).json({
        error: 'Game not found'
      });
    }

    res.json({
      id: gameId,
      ...game,
      coinsPerPoint: undefined // Don't expose to client
    });
  } catch (error) {
    console.error('Get game error:', error);
    res.status(500).json({
      error: 'Failed to fetch game info'
    });
  }
});

// Start a game session
router.post('/:gameId/start', authenticateToken, gameRateLimiter, async (req, res) => {
  try {
    const { gameId } = req.params;
    const game = GAMES[gameId];

    if (!game) {
      return res.status(404).json({
        error: 'Game not found'
      });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    // Create session ID
    const sessionId = `${gameId}_${user._id}_${Date.now()}`;

    res.json({
      sessionId,
      gameId,
      startTime: new Date().toISOString(),
      message: 'Game session started'
    });
  } catch (error) {
    console.error('Start game error:', error);
    res.status(500).json({
      error: 'Failed to start game session'
    });
  }
});

// Submit game score
router.post('/:gameId/score', authenticateToken, gameRateLimiter, async (req, res) => {
  try {
    const { gameId } = req.params;
    const { score, sessionId, playTime, won = false, moves, level } = req.body;

    const game = GAMES[gameId];
    if (!game) {
      return res.status(404).json({
        error: 'Game not found'
      });
    }

    // Validate score
    if (typeof score !== 'number' || score < 0 || score > game.maxScore) {
      return res.status(400).json({
        error: 'Invalid score'
      });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    // Calculate coins earned
    const coinsEarned = Math.floor(score * game.coinsPerPoint);
    const experienceGained = Math.floor(score * 0.1) + (won ? 50 : 10);

    // Update user stats
    user.updateGameStats(gameId, {
      score,
      playTime: playTime || 0,
      won,
      moves,
      level
    });

    // Add coins and experience
    user.addCoins(coinsEarned);
    const levelUpResult = user.addExperience(experienceGained);

    // Check for achievements
    const newAchievements = [];
    const gameStats = user.stats.gameStats.find(gs => gs.game === gameId);
    
    if (gameStats) {
      for (const achievement of game.achievements) {
        const hasAchievement = user.achievements.some(
          ach => ach.game === gameId && ach.name === achievement.name
        );

        if (!hasAchievement) {
          let earned = false;
          
          // Check achievement requirements
          if (achievement.requirement <= gameStats.highScore) {
            earned = true;
          }

          if (earned) {
            const achievementData = {
              game: gameId,
              name: achievement.name,
              description: achievement.description,
              coinsRewarded: achievement.coins,
              rarity: achievement.coins > 200 ? 'rare' : 'common'
            };

            user.addAchievement(achievementData);
            newAchievements.push(achievementData);
          }
        }
      }
    }

    await user.save();

    res.json({
      score,
      coinsEarned,
      experienceGained,
      totalCoins: user.coins,
      totalExperience: user.experience,
      level: user.level,
      levelUp: levelUpResult,
      newAchievements,
      gameStats: gameStats,
      message: 'Score submitted successfully'
    });

  } catch (error) {
    console.error('Submit score error:', error);
    res.status(500).json({
      error: 'Failed to submit score'
    });
  }
});

// Get user's game statistics
router.get('/:gameId/stats', authenticateToken, async (req, res) => {
  try {
    const { gameId } = req.params;
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    const gameStats = user.stats.gameStats.find(gs => gs.game === gameId);
    const gameAchievements = user.achievements.filter(ach => ach.game === gameId);

    res.json({
      gameId,
      stats: gameStats || {
        game: gameId,
        gamesPlayed: 0,
        gamesWon: 0,
        highScore: 0,
        totalScore: 0,
        totalTime: 0,
        coinsEarned: 0,
        lastPlayed: null
      },
      achievements: gameAchievements,
      availableAchievements: GAMES[gameId]?.achievements || []
    });
  } catch (error) {
    console.error('Get game stats error:', error);
    res.status(500).json({
      error: 'Failed to fetch game statistics'
    });
  }
});

// Get leaderboard for a specific game
router.get('/:gameId/leaderboard', optionalAuth, async (req, res) => {
  try {
    const { gameId } = req.params;
    const { limit = 10, timeframe = 'all' } = req.query;

    const game = GAMES[gameId];
    if (!game) {
      return res.status(404).json({
        error: 'Game not found'
      });
    }

    // Build aggregation pipeline
    const pipeline = [
      { $unwind: '$stats.gameStats' },
      { $match: { 'stats.gameStats.game': gameId } },
      { $sort: { 'stats.gameStats.highScore': -1 } },
      { $limit: parseInt(limit) },
      {
        $project: {
          username: 1,
          highScore: '$stats.gameStats.highScore',
          gamesPlayed: '$stats.gameStats.gamesPlayed',
          gamesWon: '$stats.gameStats.gamesWon',
          totalTime: '$stats.gameStats.totalTime',
          lastPlayed: '$stats.gameStats.lastPlayed',
          level: 1,
          platform: 1
        }
      }
    ];

    const leaderboard = await User.aggregate(pipeline);

    res.json({
      gameId,
      leaderboard: leaderboard.map((entry, index) => ({
        rank: index + 1,
        ...entry,
        winRate: entry.gamesPlayed > 0 
          ? ((entry.gamesWon / entry.gamesPlayed) * 100).toFixed(1)
          : '0.0'
      })),
      timeframe,
      total: leaderboard.length
    });

  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      error: 'Failed to fetch leaderboard'
    });
  }
});

// Get daily/weekly challenges
router.get('/challenges/current', optionalAuth, (req, res) => {
  try {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
    
    // Generate daily challenge based on day of year
    const gameIds = Object.keys(GAMES);
    const dailyGameId = gameIds[dayOfYear % gameIds.length];
    
    const challenges = {
      daily: {
        id: `daily_${dayOfYear}`,
        game: dailyGameId,
        name: `Daily ${GAMES[dailyGameId].name} Challenge`,
        description: 'Beat today\'s high score target!',
        target: 1000 + (dayOfYear * 50),
        reward: 200,
        expires: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
      },
      weekly: {
        id: `weekly_${Math.floor(dayOfYear / 7)}`,
        game: 'any',
        name: 'Weekly Gaming Marathon',
        description: 'Play 20 games this week',
        target: 20,
        reward: 1000,
        expires: new Date(today.getFullYear(), today.getMonth(), today.getDate() + (7 - today.getDay()))
      }
    };

    res.json({
      challenges,
      serverTime: today.toISOString()
    });
  } catch (error) {
    console.error('Get challenges error:', error);
    res.status(500).json({
      error: 'Failed to fetch challenges'
    });
  }
});

module.exports = router;