#!/bin/bash

# Mission Control Dashboard Startup Script

echo "🎛️  Starting Mission Control Dashboard..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
fi

# Start the server
echo "🚀 Starting server on http://localhost:3000"
npm start
