#!/bin/bash

# Development Setup Script for Hack Alumni Community
# This script helps set up the development environment with Node.js v22

set -e

echo "🚀 Setting up development environment..."

# Check if nvm is available
if ! command -v nvm &> /dev/null; then
    echo "📦 Loading nvm..."
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
fi

# Check Node.js version
CURRENT_NODE_VERSION=$(node --version 2>/dev/null || echo "none")
echo "📋 Current Node.js version: $CURRENT_NODE_VERSION"

# Ensure Node.js v22 is installed and active
if [[ "$CURRENT_NODE_VERSION" != "v22"* ]]; then
    echo "🔄 Switching to Node.js v22..."
    nvm install 22
    nvm use 22
    nvm alias default 22
    echo "✅ Node.js v22 is now active"
else
    echo "✅ Node.js v22 is already active"
fi

# Kill any processes that might be using our ports
echo "🧹 Cleaning up port conflicts..."
for port in 3000 3001 3002 8080; do
    PID=$(lsof -ti:$port 2>/dev/null || echo "")
    if [ ! -z "$PID" ]; then
        echo "🔄 Killing process on port $port (PID: $PID)"
        kill -9 $PID 2>/dev/null || true
    fi
done

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    yarn install
fi

# Setup environment
echo "⚙️ Setting up environment..."
yarn env:setup

echo "✅ Development environment is ready!"
echo ""
echo "🎯 Next steps:"
echo "  1. Start Docker services: yarn dx:up"
echo "  2. Run database migrations: yarn db:migrate"
echo "  3. Start development server: yarn dev:apps"
echo ""
echo "🌐 Your apps will be available at:"
echo "  - Member Profile: http://localhost:3002"
echo "  - Admin Dashboard: http://localhost:3001"
echo "  - API Server: http://localhost:8080"
