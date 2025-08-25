#!/bin/bash

echo "🔍 LionsunCoin Gaming Platform Status"
echo "======================================"

# Check server status
echo -n "🖥️  Server (Port 3001): "
if curl -s http://localhost:3001/api/health > /dev/null; then
    echo "✅ RUNNING"
    SERVER_INFO=$(curl -s http://localhost:3001/api/health)
    echo "   📊 Status: $(echo $SERVER_INFO | grep -o '"status":"[^"]*"' | cut -d'"' -f4)"
    echo "   ⏰ Uptime: $(echo $SERVER_INFO | grep -o '"uptime":[0-9.]*' | cut -d':' -f2 | cut -d',' -f1) seconds"
else
    echo "❌ NOT RUNNING"
fi

# Check client status
echo -n "🌐 Client (Port 3000): "
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ RUNNING"
else
    echo "❌ NOT RUNNING"
fi

# Check MongoDB connection
echo -n "🗄️  MongoDB: "
if curl -s http://localhost:3001/api/health | grep -q "OK"; then
    echo "✅ CONNECTED"
else
    echo "❌ CONNECTION ISSUE"
fi

echo ""
echo "📱 Access URLs:"
echo "   Client: http://localhost:3000"
echo "   Server: http://localhost:3001"
echo "   Health: http://localhost:3001/api/health"

# Show running processes
echo ""
echo "🔄 Running Processes:"
ps aux | grep -E "(node server/app.js|react-scripts start)" | grep -v grep | while read line; do
    PID=$(echo $line | awk '{print $2}')
    CMD=$(echo $line | awk '{for(i=11;i<=NF;i++) printf "%s ", $i; print ""}')
    echo "   PID $PID: $CMD"
done