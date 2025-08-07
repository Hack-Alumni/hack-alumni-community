#!/bin/bash

# Deploy to Render script
# This script helps with the Render deployment process

set -e

echo "🚀 Preparing for Render deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the root directory."
    exit 1
fi

# Check if render.yaml exists
if [ ! -f "render.yaml" ]; then
    echo "❌ Error: render.yaml not found. Please create it first."
    exit 1
fi

# Check if scripts exist
if [ ! -f "scripts/render-build.sh" ]; then
    echo "❌ Error: scripts/render-build.sh not found."
    exit 1
fi

if [ ! -f "scripts/render-start.sh" ]; then
    echo "❌ Error: scripts/render-start.sh not found."
    exit 1
fi

# Make scripts executable
chmod +x scripts/render-build.sh
chmod +x scripts/render-start.sh

echo "✅ Scripts are executable"

# Check if all required files exist
echo "📋 Checking required files..."

required_files=(
    "render.yaml"
    "scripts/render-build.sh"
    "scripts/render-start.sh"
    "render-env.example"
    "Dockerfile"
    ".dockerignore"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing"
        exit 1
    fi
done

echo ""
echo "🎉 All files are ready for Render deployment!"
echo ""
echo "📝 Next steps:"
echo "1. Push your code to GitHub"
echo "2. Go to https://dashboard.render.com"
echo "3. Click 'New +' → 'Blueprint'"
echo "4. Connect your GitHub repository"
echo "5. Render will automatically detect render.yaml"
echo "6. Configure environment variables"
echo "7. Deploy!"
echo ""
echo "📚 For more details, see RENDER_DEPLOYMENT.md"
