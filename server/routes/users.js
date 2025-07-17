const express = require('express');
const { verifyToken, users } = require('./auth');
const router = express.Router();

// Get user profile
router.get('/profile/:userId?', verifyToken, (req, res) => {
  try {
    const requestedUserId = req.params.userId ? parseInt(req.params.userId) : req.user.userId;
    const currentUserId = req.user.userId;
    
    const user = users.find(u => u.id === requestedUserId);
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User profile not found'
      });
    }
    
    // Public profile data
    const publicProfile = {
      id: user.id,
      username: user.username,
      level: user.level,
      experience: user.experience,
      gamesPlayed: user.gamesPlayed,
      gamesWon: user.gamesWon,
      winRate: user.gamesPlayed > 0 ? ((user.gamesWon / user.gamesPlayed) * 100).toFixed(1) : '0.0',
      joinDate: user.createdAt,
      lastActive: user.lastLogin,
      achievements: getUserAchievements(user.id),
      platform: user.platform,
      isOnline: isUserOnline(user.id)
    };
    
    // Add private data if viewing own profile
    if (requestedUserId === currentUserId) {
      publicProfile.email = user.email;
      publicProfile.lionsuncoins = user.lionsuncoins;
    }
    
    res.json({
      profile: publicProfile,
      isOwnProfile: requestedUserId === currentUserId
    });
    
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      error: 'Failed to get profile',
      message: 'An error occurred while fetching user profile'
    });
  }
});

// Update user profile
router.put('/profile', verifyToken, (req, res) => {
  try {
    const userId = req.user.userId;
    const { username, email, platform } = req.body;
    
    const user = users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User account not found'
      });
    }
    
    // Check if new username is already taken (if provided)
    if (username && username !== user.username) {
      const existingUser = users.find(u => u.username === username && u.id !== userId);
      if (existingUser) {
        return res.status(409).json({
          error: 'Username taken',
          message: 'This username is already taken'
        });
      }
      user.username = username;
    }
    
    // Check if new email is already taken (if provided)
    if (email && email !== user.email) {
      const existingUser = users.find(u => u.email === email && u.id !== userId);
      if (existingUser) {
        return res.status(409).json({
          error: 'Email taken',
          message: 'This email is already registered'
        });
      }
      user.email = email;
    }
    
    // Update platform if provided
    if (platform) {
      const validPlatforms = ['web', 'ios', 'android', 'windows', 'linux', 'ps5'];
      if (validPlatforms.includes(platform.toLowerCase())) {
        user.platform = platform.toLowerCase();
      }
    }
    
    res.json({
      message: 'Profile updated successfully',
      profile: {
        id: user.id,
        username: user.username,
        email: user.email,
        platform: user.platform,
        level: user.level,
        experience: user.experience
      }
    });
    
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      error: 'Failed to update profile',
      message: 'An error occurred while updating profile'
    });
  }
});

// Get user achievements
router.get('/achievements/:userId?', verifyToken, (req, res) => {
  try {
    const userId = req.params.userId ? parseInt(req.params.userId) : req.user.userId;
    
    const user = users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User not found'
      });
    }
    
    const achievements = getUserAchievements(userId);
    const totalAchievements = getAllAchievements().length;
    const unlockedCount = achievements.filter(a => a.unlocked).length;
    
    res.json({
      achievements,
      stats: {
        total: totalAchievements,
        unlocked: unlockedCount,
        completionRate: ((unlockedCount / totalAchievements) * 100).toFixed(1)
      }
    });
    
  } catch (error) {
    console.error('Get achievements error:', error);
    res.status(500).json({
      error: 'Failed to get achievements',
      message: 'An error occurred while fetching achievements'
    });
  }
});

// Search users
router.get('/search', verifyToken, (req, res) => {
  try {
    const { query, page = 1, limit = 20 } = req.query;
    
    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        error: 'Invalid search query',
        message: 'Search query must be at least 2 characters long'
      });
    }
    
    const searchTerm = query.toLowerCase().trim();
    const filteredUsers = users.filter(user => 
      user.username.toLowerCase().includes(searchTerm)
    );
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
    
    const searchResults = paginatedUsers.map(user => ({
      id: user.id,
      username: user.username,
      level: user.level,
      gamesPlayed: user.gamesPlayed,
      gamesWon: user.gamesWon,
      platform: user.platform,
      lastActive: user.lastLogin,
      isOnline: isUserOnline(user.id)
    }));
    
    res.json({
      results: searchResults,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredUsers.length / limit),
        totalResults: filteredUsers.length,
        hasNext: endIndex < filteredUsers.length,
        hasPrev: page > 1
      }
    });
    
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({
      error: 'Search failed',
      message: 'An error occurred while searching users'
    });
  }
});

// Get top players
router.get('/top', (req, res) => {
  try {
    const { category = 'level', limit = 10 } = req.query;
    
    let sortedUsers = [...users];
    
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
    
    const topPlayers = sortedUsers.slice(0, parseInt(limit)).map((user, index) => ({
      rank: index + 1,
      id: user.id,
      username: user.username,
      level: user.level,
      experience: user.experience,
      lionsuncoins: user.lionsuncoins,
      gamesPlayed: user.gamesPlayed,
      gamesWon: user.gamesWon,
      winRate: user.gamesPlayed > 0 ? ((user.gamesWon / user.gamesPlayed) * 100).toFixed(1) : '0.0',
      platform: user.platform,
      lastActive: user.lastLogin
    }));
    
    res.json({
      category,
      topPlayers,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Get top players error:', error);
    res.status(500).json({
      error: 'Failed to get top players',
      message: 'An error occurred while fetching top players'
    });
  }
});

// Helper functions
function getUserAchievements(userId) {
  const user = users.find(u => u.id === userId);
  if (!user) return [];
  
  const allAchievements = getAllAchievements();
  
  return allAchievements.map(achievement => {
    const progress = calculateAchievementProgress(user, achievement);
    const unlocked = progress >= achievement.target;
    
    return {
      ...achievement,
      progress,
      unlocked,
      unlockedDate: unlocked ? user.createdAt : null // Mock unlock date
    };
  });
}

function getAllAchievements() {
  return [
    {
      id: 'first_game',
      name: 'First Steps',
      description: 'Play your first game',
      icon: '🎮',
      target: 1,
      type: 'games_played',
      reward: 100
    },
    {
      id: 'game_veteran',
      name: 'Game Veteran',
      description: 'Play 100 games',
      icon: '🏆',
      target: 100,
      type: 'games_played',
      reward: 1000
    },
    {
      id: 'first_win',
      name: 'Victory!',
      description: 'Win your first game',
      icon: '🥇',
      target: 1,
      type: 'games_won',
      reward: 200
    },
    {
      id: 'winning_streak',
      name: 'Champion',
      description: 'Win 50 games',
      icon: '👑',
      target: 50,
      type: 'games_won',
      reward: 2500
    },
    {
      id: 'level_10',
      name: 'Rising Star',
      description: 'Reach level 10',
      icon: '⭐',
      target: 10,
      type: 'level',
      reward: 500
    },
    {
      id: 'coin_collector',
      name: 'Coin Collector',
      description: 'Accumulate 10,000 Lionsuncoins',
      icon: '🪙',
      target: 10000,
      type: 'lionsuncoins',
      reward: 1000
    }
  ];
}

function calculateAchievementProgress(user, achievement) {
  switch (achievement.type) {
    case 'games_played':
      return user.gamesPlayed;
    case 'games_won':
      return user.gamesWon;
    case 'level':
      return user.level;
    case 'lionsuncoins':
      return user.lionsuncoins;
    default:
      return 0;
  }
}

function isUserOnline(userId) {
  // Mock online status - in real implementation, track active connections
  return Math.random() > 0.5; // Random online status for demo
}

module.exports = router;