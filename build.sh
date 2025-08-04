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

# Copy built files to public directory for Vercel
cp -r apps/member-profile/build/client public/
cp -r apps/admin-dashboard/build/client public/admin/
cp -r apps/api/dist public/api/

echo "Build completed successfully!"
