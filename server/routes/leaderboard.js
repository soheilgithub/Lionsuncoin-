const express = require('express');
const { verifyToken, users } = require('./auth');

const router = express.Router();

// Get global leaderboard
router.get('/global', (req, res) => {
  try {
    const { category = 'level', limit = 50, page = 1 } = req.query;

    const sortedUsers = [...users];

    switch (category) {
      case 'level':
        sortedUsers.sort((a, b) => b.level - a.level || b.experience - a.experience);
        break;
      case 'coins':
        sortedUsers.sort((a, b) => b.lionsuncoins - a.lionsuncoins);
        break;
      case 'games':
        sortedUsers.sort((a, b) => b.gamesPlayed - a.gamesPlayed);
        break;
      case 'wins':
        sortedUsers.sort((a, b) => b.gamesWon - a.gamesWon);
        break;
      case 'winrate':
        sortedUsers.sort((a, b) => {
          const aRate = a.gamesPlayed > 0 ? a.gamesWon / a.gamesPlayed : 0;
          const bRate = b.gamesPlayed > 0 ? b.gamesWon / b.gamesPlayed : 0;
          return bRate - aRate;
        });
        break;
      default:
        sortedUsers.sort((a, b) => b.level - a.level);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedUsers = sortedUsers.slice(startIndex, endIndex);

    const leaderboard = paginatedUsers.map((user, index) => ({
      rank: startIndex + index + 1,
      id: user.id,
      username: user.username,
      level: user.level,
      experience: user.experience,
      lionsuncoins: user.lionsuncoins,
      gamesPlayed: user.gamesPlayed,
      gamesWon: user.gamesWon,
      winRate: user.gamesPlayed > 0 ? ((user.gamesWon / user.gamesPlayed) * 100).toFixed(1) : '0.0',
      platform: user.platform,
      lastActive: user.lastLogin,
      change: Math.floor(Math.random() * 10) - 5 // Mock rank change
    }));

    res.json({
      category,
      leaderboard,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(sortedUsers.length / limit),
        totalEntries: sortedUsers.length,
        hasNext: endIndex < sortedUsers.length,
        hasPrev: page > 1
      },
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Get global leaderboard error:', error);
    res.status(500).json({
      error: 'Failed to get leaderboard',
      message: 'An error occurred while fetching the leaderboard'
    });
  }
});

// Get game-specific leaderboard
router.get('/game/:gameId', (req, res) => {
  try {
    const { gameId } = req.params;
    const { limit = 20, period = 'all' } = req.query;

    // Mock game scores - in real implementation, get from database
    const gameScores = generateMockGameScores(gameId, users);

    // Filter by time period
    let filteredScores = gameScores;
    if (period !== 'all') {
      const now = new Date();
      let periodStart;

      switch (period) {
        case 'day':
          periodStart = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case 'week':
          periodStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          periodStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          periodStart = new Date(0);
      }

      filteredScores = gameScores.filter((score) =>
        new Date(score.timestamp) >= periodStart);
    }

    // Sort by score and take top entries
    filteredScores.sort((a, b) => b.score - a.score);
    const topScores = filteredScores.slice(0, parseInt(limit));

    const leaderboard = topScores.map((score, index) => ({
      rank: index + 1,
      ...score
    }));

    res.json({
      gameId,
      period,
      leaderboard,
      totalEntries: filteredScores.length,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Get game leaderboard error:', error);
    res.status(500).json({
      error: 'Failed to get game leaderboard',
      message: 'An error occurred while fetching the game leaderboard'
    });
  }
});

// Get user's position in leaderboard
router.get('/position/:category?', verifyToken, (req, res) => {
  try {
    const { userId } = req.user;
    const { category = 'level' } = req.params;

    const user = users.find((u) => u.id === userId);
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User account not found'
      });
    }

    const sortedUsers = [...users];

    // Sort based on category
    switch (category) {
      case 'level':
        sortedUsers.sort((a, b) => b.level - a.level || b.experience - a.experience);
        break;
      case 'coins':
        sortedUsers.sort((a, b) => b.lionsuncoins - a.lionsuncoins);
        break;
      case 'games':
        sortedUsers.sort((a, b) => b.gamesPlayed - a.gamesPlayed);
        break;
      case 'wins':
        sortedUsers.sort((a, b) => b.gamesWon - a.gamesWon);
        break;
      case 'winrate':
        sortedUsers.sort((a, b) => {
          const aRate = a.gamesPlayed > 0 ? a.gamesWon / a.gamesPlayed : 0;
          const bRate = b.gamesPlayed > 0 ? b.gamesWon / b.gamesPlayed : 0;
          return bRate - aRate;
        });
        break;
      default:
        sortedUsers.sort((a, b) => b.level - a.level);
    }

    const userPosition = sortedUsers.findIndex((u) => u.id === userId) + 1;
    const totalUsers = sortedUsers.length;
    const percentile = totalUsers > 1 ? ((totalUsers - userPosition) / (totalUsers - 1) * 100).toFixed(1) : '100.0';

    // Get nearby users (5 above and 5 below)
    const userIndex = userPosition - 1;
    const startIndex = Math.max(0, userIndex - 5);
    const endIndex = Math.min(totalUsers, userIndex + 6);
    const nearbyUsers = sortedUsers.slice(startIndex, endIndex).map((u, index) => ({
      rank: startIndex + index + 1,
      id: u.id,
      username: u.username,
      level: u.level,
      lionsuncoins: u.lionsuncoins,
      gamesPlayed: u.gamesPlayed,
      gamesWon: u.gamesWon,
      winRate: u.gamesPlayed > 0 ? ((u.gamesWon / u.gamesPlayed) * 100).toFixed(1) : '0.0',
      isCurrentUser: u.id === userId
    }));

    res.json({
      category,
      position: {
        rank: userPosition,
        totalUsers,
        percentile: parseFloat(percentile),
        isTopPlayer: userPosition <= 10
      },
      nearbyUsers,
      user: {
        id: user.id,
        username: user.username,
        level: user.level,
        experience: user.experience,
        lionsuncoins: user.lionsuncoins,
        gamesPlayed: user.gamesPlayed,
        gamesWon: user.gamesWon
      }
    });
  } catch (error) {
    console.error('Get user position error:', error);
    res.status(500).json({
      error: 'Failed to get position',
      message: 'An error occurred while fetching leaderboard position'
    });
  }
});

// Get platform-specific leaderboard
router.get('/platform/:platform', (req, res) => {
  try {
    const { platform } = req.params;
    const { category = 'level', limit = 20 } = req.query;

    const validPlatforms = ['web', 'ios', 'android', 'windows', 'linux', 'ps5'];
    if (!validPlatforms.includes(platform.toLowerCase())) {
      return res.status(400).json({
        error: 'Invalid platform',
        message: `Platform must be one of: ${validPlatforms.join(', ')}`
      });
    }

    // Filter users by platform
    const platformUsers = users.filter((u) => u.platform === platform.toLowerCase());

    // Sort based on category
    switch (category) {
      case 'level':
        platformUsers.sort((a, b) => b.level - a.level || b.experience - a.experience);
        break;
      case 'coins':
        platformUsers.sort((a, b) => b.lionsuncoins - a.lionsuncoins);
        break;
      case 'games':
        platformUsers.sort((a, b) => b.gamesPlayed - a.gamesPlayed);
        break;
      case 'wins':
        platformUsers.sort((a, b) => b.gamesWon - a.gamesWon);
        break;
      default:
        platformUsers.sort((a, b) => b.level - a.level);
    }

    const topUsers = platformUsers.slice(0, parseInt(limit));

    const leaderboard = topUsers.map((user, index) => ({
      rank: index + 1,
      id: user.id,
      username: user.username,
      level: user.level,
      experience: user.experience,
      lionsuncoins: user.lionsuncoins,
      gamesPlayed: user.gamesPlayed,
      gamesWon: user.gamesWon,
      winRate: user.gamesPlayed > 0 ? ((user.gamesWon / user.gamesPlayed) * 100).toFixed(1) : '0.0',
      lastActive: user.lastLogin
    }));

    res.json({
      platform: platform.toLowerCase(),
      category,
      leaderboard,
      totalUsers: platformUsers.length,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Get platform leaderboard error:', error);
    res.status(500).json({
      error: 'Failed to get platform leaderboard',
      message: 'An error occurred while fetching the platform leaderboard'
    });
  }
});

// Helper function to generate mock game scores
function generateMockGameScores(gameId, users) {
  const scores = [];

  users.forEach((user) => {
    const numScores = Math.floor(Math.random() * 5) + 1; // 1-5 scores per user

    for (let i = 0; i < numScores; i++) {
      const daysAgo = Math.floor(Math.random() * 30); // Random date within last 30 days
      const timestamp = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

      scores.push({
        userId: user.id,
        username: user.username,
        score: Math.floor(Math.random() * 10000) + user.level * 100,
        platform: user.platform,
        timestamp: timestamp.toISOString(),
        timeElapsed: Math.floor(Math.random() * 300) + 30, // 30-330 seconds
        achievements: Math.floor(Math.random() * 3) // 0-2 achievements
      });
    }
  });

  return scores;
}

module.exports = router;
