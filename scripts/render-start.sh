#!/bin/bash

# Render start script for Hack Alumni Community monorepo
# This script starts the appropriate service based on environment variables

set -e

echo "🚀 Starting service: $SERVICE_NAME"

# Start the appropriate service based on SERVICE_NAME
case $SERVICE_NAME in
    "hack-alumni-api")
        echo "🔌 Starting API service..."
        yarn workspace @hackcommunity/api start
        ;;
    "hack-alumni-admin-dashboard")
        echo "🔌 Starting Admin Dashboard service..."
        yarn workspace @hackcommunity/admin-dashboard start
        ;;
    "hack-alumni-member-profile")
        echo "🔌 Starting Member Profile service..."
        yarn workspace @hackcommunity/member-profile start
        ;;
    *)
        echo "❌ Unknown service: $SERVICE_NAME"
        exit 1
        ;;
esac
