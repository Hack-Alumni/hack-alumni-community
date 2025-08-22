#!/bin/bash

# Supabase Setup Script for Hack Alumni Community
# This script sets up the Supabase project with the hybrid job queue system

set -e

echo "🚀 Setting up Supabase for Hack Alumni Community..."

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ Error: .env file not found in the root directory"
    echo "Please create a .env file with your Supabase credentials"
    exit 1
fi

# Load environment variables
source .env

# Check required environment variables
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_ANON_KEY" ]; then
    echo "❌ Error: SUPABASE_URL and SUPABASE_ANON_KEY must be set in .env file"
    exit 1
fi

echo "✅ Environment variables loaded"

# Initialize Supabase project (if not already initialized)
if [ ! -f "supabase/config.toml" ]; then
    echo "📁 Initializing Supabase project..."
    supabase init
fi

echo "✅ Supabase project initialized"

# Link to remote Supabase project
echo "🔗 Linking to remote Supabase project..."
supabase link --project-ref $(echo $SUPABASE_URL | sed 's|https://||' | sed 's|\.supabase\.co||')

echo "✅ Linked to remote project"

# Run the jobs table migration
echo "🗄️  Running jobs table migration..."
supabase db push

echo "✅ Jobs table migration completed"

# Deploy Edge Functions
echo "🚀 Deploying Edge Functions..."

# Deploy process-jobs function
echo "📦 Deploying process-jobs function..."
supabase functions deploy process-jobs --no-verify-jwt

# Deploy cleanup-jobs function
echo "📦 Deploying cleanup-jobs function..."
supabase functions deploy cleanup-jobs --no-verify-jwt

echo "✅ Edge Functions deployed"


echo "🎉 Supabase setup completed!"
echo ""
echo "📋 Summary:"
echo "✅ Jobs table created"
echo "✅ Edge Functions deployed"
echo "✅ Project linked"
echo ""
echo "🔗 Your Supabase URL: $SUPABASE_URL"
echo "🔑 Your Supabase Anon Key: ${SUPABASE_ANON_KEY:0:20}..."
echo ""
echo "Next: Set up cron jobs in the Supabase dashboard as shown above"
