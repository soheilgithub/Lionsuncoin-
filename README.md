# 🦁 Lionsuncoin Gaming Platform

A comprehensive cross-platform gaming platform with cryptocurrency integration, supporting iOS, PS5, Android, browser, Windows, and Linux platforms.

## 🚀 Features

### 🎮 Gaming
- **Cross-Platform Support**: Web, iOS, Android, Windows, Linux, PS5
- **Multiple Game Types**: Arcade, Adventure, Puzzle, Multiplayer, Casino
- **Real-time Multiplayer**: Socket.IO powered gaming sessions
- **Achievement System**: Unlock achievements and earn rewards
- **Leaderboards**: Global and game-specific rankings

### 💰 Cryptocurrency Integration
- **Lionsuncoin (🦁)**: Native gaming cryptocurrency
- **Wallet Management**: Secure digital wallet system
- **Coin Transactions**: Transfer coins between players
- **Exchange Rates**: Real-time exchange rate support
- **Purchase System**: Buy coins with multiple payment methods

### 🔐 Security & Authentication
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Rate Limiting**: Protection against API abuse
- **CORS Configuration**: Secure cross-origin requests
- **Helmet Security**: Security headers and CSP

### 🎨 Modern UI/UX
- **Material-UI Components**: Modern, responsive design
- **Dark Theme**: Gaming-optimized dark interface
- **Animations**: Smooth transitions and effects
- **Responsive Design**: Mobile-first approach
- **Custom Fonts**: Orbitron and Rajdhani for gaming aesthetics

## 🛠 Technology Stack

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **Socket.IO**: Real-time communication
- **JWT**: Authentication
- **bcryptjs**: Password hashing
- **Helmet**: Security middleware
- **CORS**: Cross-origin resource sharing
- **Compression**: Response compression

### Frontend
- **React 18**: Modern React with hooks
- **Redux Toolkit**: State management
- **Material-UI**: Component library
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **Socket.IO Client**: Real-time features
- **Framer Motion**: Animations
- **React Hot Toast**: Notifications

### Development Tools
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Nodemon**: Development server
- **Concurrently**: Run multiple scripts
- **Jest**: Testing framework

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- Git

### Clone Repository
```bash
git clone https://github.com/soheilgithub/Lionsuncoin-.git
cd Lionsuncoin-
```

### Install Dependencies
```bash
# Install server dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit environment variables
nano .env
```

### Start Development Servers
```bash
# Start both server and client
npm run dev

# Or start separately
npm run server  # Backend on port 5000
npm run client  # Frontend on port 3000
```

## 🎯 Quick Start

### 1. Register Account
- Visit `http://localhost:3000`
- Click "Register" to create new account
- Choose your platform (web, mobile, console)

### 2. Get Starting Coins
- New users receive 1000 Lionsuncoins
- Explore the wallet to see your balance

### 3. Play Games
- Visit the Games section
- Choose from available games
- Place bets and earn rewards

### 4. Compete
- Check leaderboards for rankings
- Compete with other players
- Unlock achievements

## 🎮 Available Games

### Lionsun Coin Runner 🏃
- **Type**: Arcade
- **Platforms**: Web, iOS, Android, Windows, Linux
- **Min Bet**: 10 coins
- **Description**: Collect Lionsuncoins while running through challenging levels

### Treasure Hunt Adventure 🗺️
- **Type**: Adventure
- **Platforms**: All platforms including PS5
- **Min Bet**: 25 coins
- **Description**: Find hidden treasures and earn massive rewards

### Puzzle Master Challenge 🧩
- **Type**: Puzzle
- **Platforms**: Web, iOS, Android, Windows, Linux
- **Min Bet**: 5 coins
- **Description**: Solve complex puzzles to unlock treasures

### Battle Arena Royale ⚔️
- **Type**: Multiplayer
- **Platforms**: All platforms including PS5
- **Min Bet**: 50 coins
- **Description**: Compete against other players in epic battles

### Lion Slots Casino 🎰
- **Type**: Casino
- **Platforms**: Web, iOS, Android, Windows, Linux
- **Min Bet**: 1 coin
- **Description**: Spin the reels and win big jackpots

## 💰 Lionsuncoin Economy

### Starting Balance
- New users: 1000 🦁
- Level up bonus: Level × 100 🦁

### Earning Coins
- **Game Rewards**: Based on score and performance
- **Achievements**: Unlock achievements for bonus coins
- **Level Up**: Automatic bonus when leveling up
- **Daily Bonuses**: Login rewards (planned feature)

### Spending Coins
- **Game Bets**: Required to play games
- **Transfers**: Send coins to other players
- **Purchases**: Buy in-game items (planned feature)

### Exchange Rates
- 1 🦁 = $0.01 USD
- 1 🦁 = €0.009 EUR
- Real-time rates available in wallet

## 🏆 Achievement System

### Gaming Achievements
- **First Steps**: Play your first game (100 🦁)
- **Game Veteran**: Play 100 games (1000 🦁)
- **Victory!**: Win your first game (200 🦁)
- **Champion**: Win 50 games (2500 🦁)
- **Rising Star**: Reach level 10 (500 🦁)
- **Coin Collector**: Accumulate 10,000 coins (1000 🦁)

## 📊 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Game Endpoints
- `GET /api/games` - Get available games
- `GET /api/games/:gameId` - Get game details
- `POST /api/games/:gameId/start` - Start game session
- `POST /api/games/:gameId/score` - Submit game score

### Wallet Endpoints
- `GET /api/coins/balance` - Get coin balance
- `POST /api/coins/transfer` - Transfer coins
- `GET /api/coins/transactions` - Get transaction history
- `GET /api/coins/rates` - Get exchange rates

### Leaderboard Endpoints
- `GET /api/leaderboard/global` - Global leaderboard
- `GET /api/leaderboard/game/:gameId` - Game leaderboard
- `GET /api/leaderboard/position` - User position

## 🔧 Configuration

### Server Configuration
```javascript
// server/app.js
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
```

### Security Settings
```javascript
// Helmet configuration
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      // ... more CSP settings
    }
  }
}));
```

### Rate Limiting
```javascript
// 100 requests per 15 minutes
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
```

## 🔌 Socket.IO Events

### Game Events
- `join_game` - Join game session
- `game_update` - Real-time game updates
- `game_completed` - Game completion
- `leave_game` - Leave game session

### Player Events
- `player_online` - Player comes online
- `player_offline` - Player goes offline
- `player_joined` - Player joins game room
- `player_left` - Player leaves game room

### Chat Events
- `game_chat` - In-game chat messages
- `chat_message` - Receive chat message

## 🚀 Deployment

### Production Build
```bash
# Build client
cd client
npm run build
cd ..

# Start production server
npm start
```

### Environment Variables
```bash
NODE_ENV=production
PORT=80
JWT_SECRET=your-secure-jwt-secret
CLIENT_URL=https://yourdomain.com
```

### Docker Deployment
```dockerfile
# Dockerfile included for containerized deployment
docker build -t lionsuncoin-gaming .
docker run -p 5000:5000 lionsuncoin-gaming
```

## 🧪 Testing

### Run Tests
```bash
# Server tests
npm test

# Client tests
cd client
npm test
```

### Test Coverage
```bash
npm run test:coverage
```

## 🔍 Monitoring

### Health Check
- `GET /api/health` - Server health status
- Includes uptime, memory usage, and platform info

### Logging
- Console logging in development
- File logging in production
- Error tracking and monitoring

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Code Style
- Use ESLint configuration
- Follow React best practices
- Write meaningful commit messages
- Add tests for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Common Issues

**Q: Can't connect to server**
A: Check if server is running on port 5000 and CLIENT_URL is correct

**Q: Socket connection fails**
A: Verify CORS settings and authentication token

**Q: Games not loading**
A: Check network connection and try refreshing the page

### Contact
- GitHub Issues: [Create Issue](https://github.com/soheilgithub/Lionsuncoin-/issues)
- Email: support@lionsuncoin.com (example)

## 🌟 Roadmap

### Phase 1 (Current)
- ✅ Basic gaming platform
- ✅ Cross-platform support
- ✅ Cryptocurrency integration
- ✅ Real-time multiplayer

### Phase 2 (Planned)
- 🔄 Mobile apps (iOS/Android)
- 🔄 Console integration (PS5)
- 🔄 More game types
- 🔄 Tournament system

### Phase 3 (Future)
- 📅 NFT integration
- 📅 DeFi features
- 📅 Governance token
- 📅 Metaverse integration

## 🎉 Acknowledgments

- Material-UI team for excellent components
- Socket.IO for real-time capabilities
- React team for the amazing framework
- Gaming community for inspiration

---

**Built with ❤️ for the gaming community**

🦁 **Lionsuncoin Gaming Platform** - *Play, Earn, Compete*
 
 
