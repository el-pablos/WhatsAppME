#!/bin/bash

# WhatsApp Bot Startup Script for Pterodactyl
# This script ensures proper startup and error handling

echo "🚀 Starting WhatsApp Me Bot..."
echo "📅 $(date)"
echo "🔧 Node.js Version: $(node --version)"
echo "📦 NPM Version: $(npm --version)"

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p data/backup
mkdir -p logs
mkdir -p session

# Set proper permissions
echo "🔒 Setting permissions..."
chmod 755 data/
chmod 755 logs/
chmod 755 session/

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found!"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install --production
    
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies!"
        exit 1
    fi
fi

# Check if main files exist
echo "🔍 Checking required files..."
required_files=("index.js" "config/config.js" "data/users.json" "data/quiz.json")

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ Required file missing: $file"
        exit 1
    fi
done

echo "✅ All required files found"

# Create log file with timestamp
log_file="logs/bot_$(date +%Y%m%d_%H%M%S).log"
echo "📝 Log file: $log_file"

# Function to handle cleanup on exit
cleanup() {
    echo "🛑 Shutting down bot..."
    echo "📅 Shutdown time: $(date)" >> "$log_file"
    exit 0
}

# Set trap for cleanup
trap cleanup SIGINT SIGTERM

# Start the bot with logging
echo "🤖 Starting bot process..."
echo "📅 Start time: $(date)" >> "$log_file"

# Start bot and redirect output to log file
node index.js 2>&1 | tee -a "$log_file"

# If we reach here, the bot has stopped
echo "⚠️ Bot process ended"
echo "📅 End time: $(date)" >> "$log_file"
