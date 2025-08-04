#!/bin/bash

# Vercel build script
echo "Starting Vercel build..."

# Install dependencies
yarn install

# Build all apps
yarn workspace @hackcommunity/member-profile build
yarn workspace @hackcommunity/admin-dashboard build
cd apps/api && yarn build && cd ../..

# Create public directory for Vercel
mkdir -p public

echo "Build completed successfully!"
