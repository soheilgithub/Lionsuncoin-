# 🚀 Lionsuncoin Gaming Platform - Quick Start Guide

## 📋 Prerequisites

Before starting, ensure you have:
- Node.js 18+ installed
- npm 9+ installed
- MongoDB 6.0+ installed
- Git installed
- At least 4GB RAM available

## ⚡ Quick Setup (5 minutes)

### 1. Clone and Setup
```bash
# Clone the repository
git clone https://github.com/soheilgithub/Lionsuncoin-.git
cd Lionsuncoin-

# Run the setup script
chmod +x setup.sh
./setup.sh
```

### 2. Start the Development Server
```bash
# Start the development server
npm run dev
```

### 3. Access the Application
Open your browser and go to: `http://localhost:3000`

## 🔧 Manual Setup (If automated setup fails)

### 1. Install MongoDB
```bash
# Ubuntu/Debian
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# macOS
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb/brew/mongodb-community

# Windows
# Download from https://www.mongodb.com/try/download/community
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
```bash
# Copy environment file
cp .env.example .env

# Edit the .env file with your settings
nano .env
```

### 4. Start the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 🐳 Docker Setup (Alternative)

### 1. Using Docker Compose
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 2. Using Docker
```bash
# Build the image
docker build -t lionsuncoin-gaming .

# Run the container
docker run -p 3000:3000 lionsuncoin-gaming
```

## 🎮 Testing the Platform

### 1. Create a User Account
1. Open `http://localhost:3000`
2. Click "Sign Up"
3. Fill in the registration form
4. Click "Create Account"

### 2. Play a Game
1. Click on any game card
2. Click "Play Now"
3. Follow the game instructions
4. Earn Lionsuncoins!

### 3. Check Your Wallet
1. Click on "Wallet" in the navigation
2. View your coin balance
3. See transaction history

## 🔍 Troubleshooting

### Common Issues

#### 1. "Cannot connect to database"
**Solution**: Ensure MongoDB is running
```bash
# Check MongoDB status
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod
```

#### 2. "Port 3000 already in use"
**Solution**: Kill the process using port 3000
```bash
# Find the process
lsof -i :3000

# Kill the process
kill -9 <PID>
```

#### 3. "Module not found" errors
**Solution**: Reinstall dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

#### 4. "Permission denied" errors
**Solution**: Fix file permissions
```bash
sudo chown -R $USER:$USER .
chmod +x setup.sh
```

### Database Issues

#### 1. MongoDB connection failed
```bash
# Check MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log

# Restart MongoDB
sudo systemctl restart mongod
```

#### 2. Database not found
```bash
# Connect to MongoDB
mongo

# Create database
use lionsuncoin
db.createCollection("users")
```

### Server Issues

#### 1. Server won't start
```bash
# Check server logs
npm run dev 2>&1 | tee server.log

# Check for syntax errors
node -c server.js
```

#### 2. API endpoints not working
```bash
# Test API health
curl http://localhost:3000/api/health

# Check server status
ps aux | grep node
```

## 📊 Monitoring

### 1. Check Server Status
```bash
# View running processes
ps aux | grep node

# Check port usage
netstat -tlnp | grep :3000
```

### 2. View Logs
```bash
# Application logs
tail -f logs/app.log

# MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log
```

### 3. Database Status
```bash
# Connect to MongoDB
mongo

# Check database
show dbs
use lionsuncoin
show collections
```

## 🚀 Production Deployment

### 1. Environment Setup
```bash
# Set production environment
export NODE_ENV=production

# Update .env file
nano .env
```

### 2. Build Application
```bash
# Build for production
npm run build

# Start production server
npm start
```

### 3. Using PM2 (Process Manager)
```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start server.js --name lionsuncoin

# Monitor
pm2 monit
```

## 🔧 Development Tips

### 1. Hot Reload
The development server supports hot reload for:
- React components
- CSS changes
- JavaScript changes

### 2. Debugging
```bash
# Enable debug mode
DEBUG=lionsuncoin:* npm run dev

# Use browser dev tools
# Open Chrome DevTools (F12)
```

### 3. Database Management
```bash
# Access MongoDB shell
mongo

# View collections
db.users.find().pretty()

# Clear database
db.dropDatabase()
```

## 📱 Mobile Testing

### 1. Test on Mobile Device
1. Find your computer's IP address
2. Access `http://YOUR_IP:3000` on mobile
3. Test touch controls and responsiveness

### 2. PWA Testing
1. Open Chrome DevTools
2. Go to Application tab
3. Test PWA features

## 🎯 Next Steps

After successful setup:

1. **Explore the Code**: Check out the project structure
2. **Read Documentation**: Review README.md and other docs
3. **Customize Games**: Modify game logic in `/public/js/games.js`
4. **Add Features**: Extend the platform with new functionality
5. **Deploy**: Set up production deployment

## 📞 Support

If you encounter issues:

1. Check this troubleshooting guide
2. Review the project documentation
3. Check GitHub issues
4. Create a new issue with details

## 🎉 Success!

If everything is working correctly, you should see:
- ✅ Server running on port 3000
- ✅ Database connected
- ✅ Web interface accessible
- ✅ Games playable
- ✅ User registration working

Welcome to the Lionsuncoin Gaming Platform! 🦁🎮💰