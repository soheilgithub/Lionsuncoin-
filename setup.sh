#!/bin/bash

# Lionsuncoin Gaming Platform Setup Script
echo "🦁 Setting up Lionsuncoin Gaming Platform..."

# Create .env file from example
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "✅ .env file created"
else
    echo "✅ .env file already exists"
fi

# Install MongoDB (Ubuntu/Debian)
echo "🗄️ Installing MongoDB..."
sudo apt-get update
sudo apt-get install -y wget curl gnupg
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
echo "✅ MongoDB installed and started"

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo "✅ Dependencies installed"

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p logs uploads
echo "✅ Directories created"

# Set proper permissions
echo "🔐 Setting permissions..."
chmod +x setup.sh
chmod 755 logs uploads
echo "✅ Permissions set"

# Test database connection
echo "🔍 Testing database connection..."
node -e "
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/lionsuncoin')
  .then(() => {
    console.log('✅ Database connection successful');
    process.exit(0);
  })
  .catch((err) => {
    console.log('❌ Database connection failed:', err.message);
    process.exit(1);
  });
"

echo "🚀 Setup complete! You can now run:"
echo "   npm run dev    # Start development server"
echo "   npm start      # Start production server"
echo "   docker-compose up -d  # Start with Docker"