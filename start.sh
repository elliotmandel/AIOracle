#!/bin/bash

# AI Oracle Startup Script
echo "🔮 Starting AI Oracle Application..."

# Check if .env exists
if [ ! -f backend/.env ]; then
    echo "❌ Error: backend/.env file not found!"
    echo "Please copy backend/.env.example to backend/.env and add your Claude API key"
    exit 1
fi

# Check if Claude API key is set
if ! grep -q "CLAUDE_API_KEY=sk-" backend/.env; then
    echo "⚠️  Warning: Claude API key may not be properly set in backend/.env"
    echo "Make sure your CLAUDE_API_KEY starts with 'sk-' or 'claude-'"
fi

# Start backend
echo "🚀 Starting backend server..."
cd backend
npm install > /dev/null 2>&1
npm run dev &
BACKEND_PID=$!

# Wait for backend to start
echo "⏳ Waiting for backend to initialize..."
sleep 3

# Start frontend
echo "🎨 Starting frontend..."
cd ../frontend
npm install > /dev/null 2>&1
npm start &
FRONTEND_PID=$!

echo ""
echo "✨ AI Oracle is awakening..."
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend:  http://localhost:3002"
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to cleanup processes
cleanup() {
    echo ""
    echo "🌙 Oracle is going to sleep..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup INT TERM

# Wait for both processes
wait