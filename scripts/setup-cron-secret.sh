#!/bin/bash

# Setup CRON_SECRET for Vercel Cron Jobs
# This script generates a secure CRON_SECRET and helps you add it to Vercel

set -e

echo "🔐 Setting up CRON_SECRET for Vercel Cron Jobs..."

# Generate a secure CRON_SECRET
CRON_SECRET=$(openssl rand -base64 32)

echo "✅ Generated CRON_SECRET: $CRON_SECRET"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Add CRON_SECRET to your Vercel project:"
echo "   - Go to your Vercel dashboard"
echo "   - Navigate to your project"
echo "   - Go to Settings > Environment Variables"
echo "   - Add CRON_SECRET with value: $CRON_SECRET"
echo ""
echo "2. Add CRON_SECRET to your local .env file:"
echo "   CRON_SECRET=$CRON_SECRET"
echo ""
echo "3. Deploy to Vercel:"
echo "   vercel --prod"
echo ""
echo "🔒 Security Note:"
echo "- The CRON_SECRET prevents unauthorized access to your cron endpoints"
echo "- Only Vercel will have this secret and will include it in Authorization headers"
echo "- Your cron jobs will automatically include this secret"
echo ""
echo "📊 Your Cron Jobs:"
echo "- /api/jobs/process (every minute)"
echo "- /api/cron/cleanup-old-jobs (daily at 2 AM)"
echo ""
echo "🎉 Once deployed, your hybrid job queue will be fully secure and operational!"
