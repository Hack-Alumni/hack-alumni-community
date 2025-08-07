#!/bin/bash

# Render build script for Hack Alumni Community monorepo
# This script handles the build process for all services

set -e

echo "🚀 Starting Render build process..."

# Install dependencies
echo "📦 Installing dependencies..."
yarn install --frozen-lockfile

# Build all packages
echo "🔨 Building packages..."
yarn build

# Build specific services based on environment
if [ "$SERVICE_NAME" = "hack-alumni-api" ]; then
    echo "🔨 Building API service..."
    yarn workspace @hackcommunity/api build
elif [ "$SERVICE_NAME" = "hack-alumni-admin-dashboard" ]; then
    echo "🔨 Building Admin Dashboard service..."
    yarn workspace @hackcommunity/admin-dashboard build
elif [ "$SERVICE_NAME" = "hack-alumni-member-profile" ]; then
    echo "🔨 Building Member Profile service..."
    yarn workspace @hackcommunity/member-profile build
else
    echo "🔨 Building all services..."
    yarn workspace @hackcommunity/api build
    yarn workspace @hackcommunity/admin-dashboard build
    yarn workspace @hackcommunity/member-profile build
fi

echo "✅ Build process completed successfully!"
