#!/bin/bash

# Pterodactyl Startup Script for WhatsApp Me Bot
echo "🚀 Starting WhatsApp Me Bot on Pterodactyl..."

# Check Node.js version
echo "📋 Node.js version: $(node --version)"
echo "📋 NPM version: $(npm --version)"

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p data/backup
mkdir -p logs
mkdir -p session

# Set permissions
chmod 755 data/
chmod 755 logs/
chmod 755 session/

# Install dependencies if needed
if [ ! -d "node_modules" ] || [ ! -f "node_modules/.package-lock.json" ]; then
    echo "📦 Installing dependencies..."
    npm install --production --no-audit --no-fund
else
    echo "✅ Dependencies already installed"
fi

# Validate setup
echo "🔍 Validating setup..."
if [ -f "test-setup.js" ]; then
    node test-setup.js
fi

# Start the bot
echo "🤖 Starting WhatsApp Me Bot..."
node index.js
