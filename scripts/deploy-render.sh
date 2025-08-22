#!/bin/bash

# Render.com Deployment Script for Hack Alumni Community
# This script helps verify the deployment configuration

set -e

echo "🚀 Render.com Deployment Verification Script"
echo "=========================================="

# Check if render.yaml exists
if [ ! -f "render.yaml" ]; then
    echo "❌ render.yaml not found. Please ensure it exists in the root directory."
    exit 1
fi

echo "✅ render.yaml found"

# Check if required scripts exist in package.json
echo "🔍 Verifying package.json scripts..."

# Check for build:render script
if grep -q "build:render" package.json; then
    echo "✅ build:render script found"
else
    echo "❌ build:render script not found in package.json"
fi

# Check for start:render script
if grep -q "start:render" package.json; then
    echo "✅ start:render script found"
else
    echo "❌ start:render script not found in package.json"
fi

# Check for start:api:render script
if grep -q "start:api:render" package.json; then
    echo "✅ start:api:render script found"
else
    echo "❌ start:api:render script not found in package.json"
fi

# Check for start:cron:render script
if grep -q "start:cron:render" package.json; then
    echo "✅ start:cron:render script found"
else
    echo "❌ start:cron:render script not found in package.json"
fi

# Check if health route exists for member-profile
if [ -f "apps/member-profile/app/routes/health.tsx" ]; then
    echo "✅ Health check route found for member-profile app"
else
    echo "❌ Health check route not found for member-profile app"
fi

# Check if health route exists for API
if grep -q "health" apps/api/src/routers/health.router.ts; then
    echo "✅ Health check route found for API"
else
    echo "❌ Health check route not found for API"
fi

echo ""
echo "📋 Next Steps:"
echo "1. Push these changes to your GitHub repository"
echo "2. Go to Render.com and create a new Blueprint"
echo "3. Connect your GitHub repository"
echo "4. Render will automatically detect the render.yaml configuration"
echo "5. Set your environment variables in each service"
echo "6. Deploy!"

echo ""
echo "📚 For detailed instructions, see RENDER_DEPLOYMENT.md"
echo ""
echo "🎯 Deployment Configuration Summary:"
echo "   - Member Profile App: Web Service with health checks"
echo "   - API Service: Web Service with health checks" 
echo "   - Cron Worker: Background Worker for scheduled jobs"
echo "   - All services use Supabase (DB) and Upstash (Redis)"

echo ""
echo "✅ Verification complete!"
