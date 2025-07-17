const jwt = require('jsonwebtoken');
const { RateLimiterMemory } = require('rate-limiter-flexible');

// Rate limiter configuration
const rateLimiter = new RateLimiterMemory({
  keyPrefix: 'auth_attempts',
  points: 5, // Number of requests
  duration: 60, // per 60 seconds
  blockDuration: 300, // Block for 5 minutes
});

// Rate limiting middleware
const rateLimiterMiddleware = async (req, res, next) => {
  try {
    const key = req.ip;
    await rateLimiter.consume(key);
    next();
  } catch (rejRes) {
    const remainingPoints = rejRes.remainingHits || 0;
    const msBeforeNext = rejRes.msBeforeNext || 300000;
    
    res.set({
      'Retry-After': Math.round(msBeforeNext / 1000) || 300,
      'X-RateLimit-Limit': 5,
      'X-RateLimit-Remaining': remainingPoints,
      'X-RateLimit-Reset': new Date(Date.now() + msBeforeNext).toISOString(),
    });
    
    return res.status(429).json({
      error: 'Too many requests',
      message: 'Too many authentication attempts. Please try again later.',
      retryAfter: Math.round(msBeforeNext / 1000)
    });
  }
};

// JWT Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      error: 'Access denied',
      message: 'No authentication token provided'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'lionsuncoin-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expired',
        message: 'Your session has expired. Please log in again.'
      });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'Authentication token is invalid'
      });
    } else {
      return res.status(500).json({
        error: 'Token verification failed',
        message: 'An error occurred during authentication'
      });
    }
  }
};

// Optional authentication (for routes that work with or without auth)
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'lionsuncoin-secret-key');
    req.user = decoded;
  } catch (error) {
    req.user = null;
  }
  
  next();
};

// Admin authentication middleware
const authenticateAdmin = (req, res, next) => {
  authenticateToken(req, res, () => {
    if (!req.user.isAdmin) {
      return res.status(403).json({
        error: 'Access forbidden',
        message: 'Admin privileges required'
      });
    }
    next();
  });
};

// Premium user authentication middleware
const authenticatePremium = (req, res, next) => {
  authenticateToken(req, res, () => {
    if (!req.user.isPremium) {
      return res.status(403).json({
        error: 'Premium access required',
        message: 'This feature is only available to premium users'
      });
    }
    next();
  });
};

// Generate JWT token
const generateToken = (payload, options = {}) => {
  const defaultOptions = {
    expiresIn: '7d',
    issuer: 'lionsuncoin-gaming',
    audience: 'lionsuncoin-users'
  };
  
  return jwt.sign(
    payload,
    process.env.JWT_SECRET || 'lionsuncoin-secret-key',
    { ...defaultOptions, ...options }
  );
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'lionsuncoin-secret-key');
  } catch (error) {
    throw error;
  }
};

// Decode JWT token without verification (for expired token info)
const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
};

// Game session rate limiter (for gaming endpoints)
const gameRateLimiter = new RateLimiterMemory({
  keyPrefix: 'game_actions',
  points: 100, // 100 game actions
  duration: 60, // per minute
  blockDuration: 60, // Block for 1 minute
});

const gameRateLimiterMiddleware = async (req, res, next) => {
  try {
    const key = req.user ? req.user.userId : req.ip;
    await gameRateLimiter.consume(key);
    next();
  } catch (rejRes) {
    const msBeforeNext = rejRes.msBeforeNext || 60000;
    
    res.set({
      'Retry-After': Math.round(msBeforeNext / 1000) || 60,
      'X-RateLimit-Limit': 100,
      'X-RateLimit-Remaining': rejRes.remainingHits || 0,
    });
    
    return res.status(429).json({
      error: 'Rate limit exceeded',
      message: 'Too many game actions. Please slow down.',
      retryAfter: Math.round(msBeforeNext / 1000)
    });
  }
};

// API key middleware (for external integrations)
const authenticateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json({
      error: 'API key required',
      message: 'X-API-Key header is required'
    });
  }
  
  // Validate API key (in production, store these securely)
  const validApiKeys = (process.env.API_KEYS || '').split(',');
  
  if (!validApiKeys.includes(apiKey)) {
    return res.status(401).json({
      error: 'Invalid API key',
      message: 'The provided API key is not valid'
    });
  }
  
  next();
};

module.exports = {
  authenticateToken,
  optionalAuth,
  authenticateAdmin,
  authenticatePremium,
  rateLimiter: rateLimiterMiddleware,
  gameRateLimiter: gameRateLimiterMiddleware,
  authenticateApiKey,
  generateToken,
  verifyToken,
  decodeToken
};