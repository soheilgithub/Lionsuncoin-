#!/bin/bash

echo "🚀 Starting LionsunCoin Gaming Platform..."

# Kill any existing processes
echo "🔄 Cleaning up existing processes..."
pkill -f "node server/app.js" 2>/dev/null
pkill -f "react-scripts start" 2>/dev/null
pkill -f "concurrently" 2>/dev/null

# Wait a moment for processes to stop
sleep 2

# Start server in background
echo "🖥️  Starting server on port 3001..."
node server/app.js &
SERVER_PID=$!

# Wait for server to start
sleep 3

# Check if server is running
if curl -s http://localhost:3001/api/health > /dev/null; then
    echo "✅ Server is running on http://localhost:3001"
else
    echo "❌ Server failed to start"
    exit 1
fi

# Start client in background
echo "🌐 Starting client on port 3000..."
cd client && npm start &
CLIENT_PID=$!

# Wait for client to start
sleep 5

# Check if client is running
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Client is running on http://localhost:3000"
else
    echo "❌ Client failed to start"
    exit 1
fi

echo ""
echo "🎮 LionsunCoin Gaming Platform is now running!"
echo "📱 Client: http://localhost:3000"
echo "🖥️  Server: http://localhost:3001"
echo "📊 Health Check: http://localhost:3001/api/health"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user to stop
wait