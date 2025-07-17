const mongoose = require('mongoose');

// Connection configuration
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lionsuncoin-gaming';
    
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      bufferMaxEntries: 0, // Disable mongoose buffering
      bufferCommands: false, // Disable mongoose buffering
      authSource: 'admin', // Auth database if using authentication
    };

    const conn = await mongoose.connect(mongoURI, options);

    console.log(`🗄️  MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);

    // Connection event handlers
    mongoose.connection.on('connected', () => {
      console.log('✅ Mongoose connected to MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  Mongoose disconnected');
    });

    // Handle application termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🔌 Mongoose connection closed through app termination');
      process.exit(0);
    });

    return conn;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    
    // Retry connection after 5 seconds
    setTimeout(() => {
      console.log('🔄 Retrying database connection...');
      connectDB();
    }, 5000);
  }
};

// Health check function
const checkDBHealth = async () => {
  try {
    const state = mongoose.connection.readyState;
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };

    return {
      status: state === 1 ? 'healthy' : 'unhealthy',
      state: states[state],
      host: mongoose.connection.host,
      name: mongoose.connection.name,
      collections: mongoose.connection.db ? 
        Object.keys(mongoose.connection.collections).length : 0
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message
    };
  }
};

// Database statistics
const getDBStats = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Database not connected');
    }

    const db = mongoose.connection.db;
    const stats = await db.stats();
    
    return {
      collections: stats.collections,
      dataSize: stats.dataSize,
      storageSize: stats.storageSize,
      indexes: stats.indexes,
      objects: stats.objects
    };
  } catch (error) {
    console.error('Error getting database stats:', error);
    return null;
  }
};

// Initialize database indexes for performance
const createIndexes = async () => {
  try {
    console.log('📇 Creating database indexes...');
    
    // User indexes
    await mongoose.connection.collection('users').createIndexes([
      { key: { username: 1 }, unique: true, name: 'username_unique' },
      { key: { email: 1 }, unique: true, name: 'email_unique' },
      { key: { coins: -1 }, name: 'coins_desc' },
      { key: { level: -1 }, name: 'level_desc' },
      { key: { 'stats.totalGamesPlayed': -1 }, name: 'total_games_desc' },
      { key: { lastActivity: -1 }, name: 'last_activity_desc' },
      { key: { createdAt: -1 }, name: 'created_at_desc' }
    ]);

    // Game session indexes (if you add game session collection)
    // await mongoose.connection.collection('gamesessions').createIndexes([
    //   { key: { userId: 1, gameId: 1 }, name: 'user_game_compound' },
    //   { key: { startTime: -1 }, name: 'start_time_desc' },
    //   { key: { status: 1 }, name: 'status_index' }
    // ]);

    console.log('✅ Database indexes created successfully');
  } catch (error) {
    console.error('❌ Error creating indexes:', error.message);
  }
};

// Drop database (for testing purposes only)
const dropDatabase = async () => {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Cannot drop database in production');
  }

  try {
    await mongoose.connection.db.dropDatabase();
    console.log('🗑️  Database dropped successfully');
  } catch (error) {
    console.error('❌ Error dropping database:', error.message);
    throw error;
  }
};

// Backup database collections
const backupCollections = async () => {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    const backup = {};

    for (const collection of collections) {
      const collectionData = await mongoose.connection.db
        .collection(collection.name)
        .find({})
        .toArray();
      backup[collection.name] = collectionData;
    }

    return backup;
  } catch (error) {
    console.error('❌ Error creating backup:', error.message);
    throw error;
  }
};

module.exports = {
  connectDB,
  checkDBHealth,
  getDBStats,
  createIndexes,
  dropDatabase,
  backupCollections
};