const express = require('express');
const User = require('../models/User');
const { authenticateToken, gameRateLimiter } = require('../middleware/auth');
const router = express.Router();

// Get user's coin balance and transaction history
router.get('/balance', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('coins stats');
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    res.json({
      coins: user.coins,
      totalEarned: user.stats.totalCoinsEarned,
      totalSpent: user.stats.totalCoinsSpent,
      netGain: user.stats.totalCoinsEarned - user.stats.totalCoinsSpent
    });
  } catch (error) {
    console.error('Get balance error:', error);
    res.status(500).json({
      error: 'Failed to fetch coin balance'
    });
  }
});

// Purchase coins with real money (mock implementation)
router.post('/purchase', authenticateToken, async (req, res) => {
  try {
    const { package: coinPackage, paymentMethod } = req.body;
    
    // Coin packages
    const packages = {
      starter: { coins: 1000, price: 4.99 },
      gamer: { coins: 2500, price: 9.99 },
      pro: { coins: 5500, price: 19.99 },
      elite: { coins: 12000, price: 39.99 },
      legend: { coins: 25000, price: 79.99 }
    };

    if (!packages[coinPackage]) {
      return res.status(400).json({
        error: 'Invalid coin package'
      });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    // Mock payment processing (in real app, integrate with Stripe/PayPal)
    const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Add coins to user account
    const package = packages[coinPackage];
    user.addCoins(package.coins);
    await user.save();

    res.json({
      success: true,
      transactionId,
      package: coinPackage,
      coinsAdded: package.coins,
      totalCoins: user.coins,
      message: `Successfully purchased ${package.coins} Lionsuncoins!`
    });

  } catch (error) {
    console.error('Purchase coins error:', error);
    res.status(500).json({
      error: 'Failed to process coin purchase'
    });
  }
});

// Get available coin packages
router.get('/packages', (req, res) => {
  try {
    const packages = {
      starter: {
        id: 'starter',
        name: 'Starter Pack',
        coins: 1000,
        price: 4.99,
        bonus: 0,
        popular: false
      },
      gamer: {
        id: 'gamer',
        name: 'Gamer Pack',
        coins: 2500,
        price: 9.99,
        bonus: 100,
        popular: false
      },
      pro: {
        id: 'pro',
        name: 'Pro Pack',
        coins: 5500,
        price: 19.99,
        bonus: 500,
        popular: true
      },
      elite: {
        id: 'elite',
        name: 'Elite Pack',
        coins: 12000,
        price: 39.99,
        bonus: 2000,
        popular: false
      },
      legend: {
        id: 'legend',
        name: 'Legend Pack',
        coins: 25000,
        price: 79.99,
        bonus: 5000,
        popular: false
      }
    };

    res.json({
      packages: Object.values(packages),
      currency: 'USD'
    });
  } catch (error) {
    console.error('Get packages error:', error);
    res.status(500).json({
      error: 'Failed to fetch coin packages'
    });
  }
});

// Daily bonus claim
router.post('/daily-bonus', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    const today = new Date();
    const lastBonusDate = user.lastBonusDate || new Date(0);
    const daysSinceLastBonus = Math.floor((today - lastBonusDate) / (1000 * 60 * 60 * 24));

    if (daysSinceLastBonus < 1) {
      return res.status(400).json({
        error: 'Daily bonus already claimed',
        nextBonus: new Date(lastBonusDate.getTime() + 24 * 60 * 60 * 1000)
      });
    }

    // Calculate bonus amount based on streak
    let streakMultiplier = 1;
    if (daysSinceLastBonus === 1) {
      user.dailyStreaks = (user.dailyStreaks || 0) + 1;
    } else {
      user.dailyStreaks = 1; // Reset streak
    }

    // Bonus increases with streak (max 7 days)
    streakMultiplier = Math.min(user.dailyStreaks, 7);
    const bonusAmount = 100 * streakMultiplier;

    user.addCoins(bonusAmount);
    user.lastBonusDate = today;
    await user.save();

    res.json({
      success: true,
      bonusAmount,
      streak: user.dailyStreaks,
      totalCoins: user.coins,
      nextBonus: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      message: `Daily bonus claimed! ${bonusAmount} coins added.`
    });

  } catch (error) {
    console.error('Daily bonus error:', error);
    res.status(500).json({
      error: 'Failed to claim daily bonus'
    });
  }
});

// Spend coins on in-game items/features
router.post('/spend', authenticateToken, async (req, res) => {
  try {
    const { item, amount, gameId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        error: 'Invalid amount'
      });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    // Check if user has enough coins
    if (user.coins < amount) {
      return res.status(400).json({
        error: 'Insufficient coins',
        required: amount,
        available: user.coins
      });
    }

    // Validate spending items
    const validItems = {
      'power-up': { name: 'Power-up', minCost: 50 },
      'extra-life': { name: 'Extra Life', minCost: 100 },
      'time-boost': { name: 'Time Boost', minCost: 75 },
      'score-multiplier': { name: 'Score Multiplier', minCost: 200 },
      'premium-skin': { name: 'Premium Skin', minCost: 500 },
      'custom-avatar': { name: 'Custom Avatar', minCost: 300 }
    };

    if (!validItems[item]) {
      return res.status(400).json({
        error: 'Invalid item'
      });
    }

    if (amount < validItems[item].minCost) {
      return res.status(400).json({
        error: 'Amount too low for this item',
        minimum: validItems[item].minCost
      });
    }

    // Process spending
    const success = user.spendCoins(amount);
    if (!success) {
      return res.status(400).json({
        error: 'Failed to spend coins'
      });
    }

    // Add purchased item to user's inventory (simplified)
    if (!user.inventory) {
      user.inventory = {};
    }
    user.inventory[item] = (user.inventory[item] || 0) + 1;

    await user.save();

    res.json({
      success: true,
      item: validItems[item].name,
      coinsSpent: amount,
      remainingCoins: user.coins,
      inventory: user.inventory,
      message: `${validItems[item].name} purchased successfully!`
    });

  } catch (error) {
    console.error('Spend coins error:', error);
    res.status(500).json({
      error: 'Failed to spend coins'
    });
  }
});

// Gift coins to another user
router.post('/gift', authenticateToken, gameRateLimiter, async (req, res) => {
  try {
    const { recipientUsername, amount, message } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        error: 'Invalid gift amount'
      });
    }

    if (amount > 1000) {
      return res.status(400).json({
        error: 'Maximum gift amount is 1000 coins'
      });
    }

    const sender = await User.findById(req.user.userId);
    if (!sender) {
      return res.status(404).json({
        error: 'Sender not found'
      });
    }

    const recipient = await User.findOne({ username: recipientUsername });
    if (!recipient) {
      return res.status(404).json({
        error: 'Recipient user not found'
      });
    }

    if (sender._id.equals(recipient._id)) {
      return res.status(400).json({
        error: 'Cannot gift coins to yourself'
      });
    }

    // Check if sender has enough coins
    if (sender.coins < amount) {
      return res.status(400).json({
        error: 'Insufficient coins to send gift',
        required: amount,
        available: sender.coins
      });
    }

    // Process gift transaction
    sender.spendCoins(amount);
    recipient.addCoins(amount);

    await Promise.all([sender.save(), recipient.save()]);

    res.json({
      success: true,
      recipient: recipientUsername,
      amount,
      message: message || 'Enjoy your gift!',
      senderRemainingCoins: sender.coins,
      transactionId: `gift_${Date.now()}`
    });

  } catch (error) {
    console.error('Gift coins error:', error);
    res.status(500).json({
      error: 'Failed to send coin gift'
    });
  }
});

// Get coin earning opportunities
router.get('/earn', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    const today = new Date();
    const lastBonusDate = user.lastBonusDate || new Date(0);
    const canClaimDaily = Math.floor((today - lastBonusDate) / (1000 * 60 * 60 * 24)) >= 1;

    const opportunities = {
      dailyBonus: {
        available: canClaimDaily,
        amount: 100 * Math.min((user.dailyStreaks || 0) + 1, 7),
        description: 'Claim your daily coin bonus'
      },
      achievements: {
        available: true,
        description: 'Complete achievements to earn coins'
      },
      games: {
        available: true,
        description: 'Play games to earn coins based on performance'
      },
      referrals: {
        available: true,
        amount: 500,
        description: 'Invite friends and earn 500 coins per referral'
      },
      tournaments: {
        available: true,
        description: 'Participate in tournaments for big coin prizes'
      }
    };

    res.json({
      opportunities,
      currentCoins: user.coins
    });

  } catch (error) {
    console.error('Get earn opportunities error:', error);
    res.status(500).json({
      error: 'Failed to fetch earning opportunities'
    });
  }
});

// Get coin statistics and leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const topUsers = await User.find({ isActive: true })
      .select('username coins level platform stats.totalCoinsEarned')
      .sort({ coins: -1 })
      .limit(parseInt(limit));

    const leaderboard = topUsers.map((user, index) => ({
      rank: index + 1,
      username: user.username,
      coins: user.coins,
      level: user.level,
      platform: user.platform,
      totalEarned: user.stats.totalCoinsEarned
    }));

    res.json({
      leaderboard,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Get coin leaderboard error:', error);
    res.status(500).json({
      error: 'Failed to fetch coin leaderboard'
    });
  }
});

module.exports = router;