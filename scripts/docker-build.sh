#!/bin/bash

# Docker build script for Hack Alumni Community monorepo
# This script helps build and test the Docker containers

set -e

echo "🐳 Starting Docker build process..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Build the base image
echo "🔨 Building base Docker image..."
docker build -t hack-alumni-community:latest .

echo "✅ Docker image built successfully!"
echo ""
echo "🚀 To run the services locally:"
echo "   docker-compose up"
echo ""
echo "🚀 To run a specific service:"
echo "   docker-compose up api"
echo "   docker-compose up admin-dashboard"
echo "   docker-compose up member-profile"
echo ""
echo "🚀 To build and push to a registry:"
echo "   docker tag hack-alumni-community:latest your-registry/hack-alumni-community:latest"
echo "   docker push your-registry/hack-alumni-community:latest" 