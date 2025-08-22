#!/bin/bash

# 🚀 Environment Setup Script for Hack Alumni Community
# This script helps you set up your .env file with all required variables

set -e

echo "🚀 Hack Alumni Community Environment Setup"
echo "=========================================="

# Check if .env already exists
if [ -f ".env" ]; then
    echo "⚠️  .env file already exists. Backing up to .env.backup"
    cp .env .env.backup
fi

echo ""
echo "📋 Setting up environment variables..."
echo ""

# Create .env file
cat > .env << EOF
# 🚀 Hack Alumni Community Environment Variables
# Generated on $(date)

# =============================================================================
# CORE CONFIGURATION
# =============================================================================
ENVIRONMENT=development
API_URL=http://localhost:3001
STUDENT_PROFILE_URL=http://localhost:3000

# =============================================================================
# DATABASE (SUPABASE) - REQUIRED
# =============================================================================
# Get these from: Supabase Dashboard → Settings → Database → Connection string (URI)
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres

# Get these from: Supabase Dashboard → Settings → API
SUPABASE_URL=https://[PROJECT-REF].supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# =============================================================================
# REDIS (UPSTASH) - REQUIRED
# =============================================================================
# Get these from: Upstash Console → Redis → Your Database
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token

# Legacy Redis URL (if needed)
REDIS_URL=redis://localhost:6379

# =============================================================================
# BACKGROUND JOBS (QSTASH) - REQUIRED
# =============================================================================
# Get these from: Upstash Console → QStash → Your Database
UPSTASH_QSTASH_TOKEN=your_qstash_token
UPSTASH_QSTASH_CURRENT_SIGNING_KEY=your_qstash_current_signing_key
UPSTASH_QSTASH_NEXT_SIGNING_KEY=your_qstash_next_signing_key

# Cron job security
CRON_SECRET=your_cron_secret_key

# =============================================================================
# AUTHENTICATION & SECURITY - REQUIRED
# =============================================================================
# Generate with: openssl rand -base64 32
JWT_SECRET=your_jwt_secret_key
SESSION_SECRET=your_session_secret_key

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# GitHub OAuth
GITHUB_OAUTH_CLIENT_ID=your_github_client_id
GITHUB_OAUTH_CLIENT_SECRET=your_github_client_secret

# =============================================================================
# SLACK INTEGRATION
# =============================================================================
# Get these from: Slack API → Your App → Basic Information
SLACK_BOT_TOKEN=xoxb-your_slack_bot_token
SLACK_CLIENT_ID=your_slack_client_id
SLACK_CLIENT_SECRET=your_slack_client_secret
SLACK_SIGNING_SECRET=your_slack_signing_secret
SLACK_ADMIN_TOKEN=xoxb-your_slack_admin_token

# Slack Channel IDs (right-click channel → Copy channel ID)
SLACK_FEED_CHANNEL_ID=C1234567890
SLACK_ANNOUNCEMENTS_CHANNEL_ID=C1234567890
SLACK_BIRTHDAYS_CHANNEL_ID=C1234567890
SLACK_INTRODUCTIONS_CHANNEL_ID=C1234567890
SLACK_TEAM_ID=T1234567890

# Slack Custom Fields
SLACK_BIRTHDATE_FIELD_ID=your_birthdate_field_id

# Internal Slack (if different workspace)
INTERNAL_SLACK_BOT_TOKEN=xoxb-your_internal_slack_bot_token
INTERNAL_SLACK_NOTIFICATIONS_CHANNEL_ID=C1234567890

# =============================================================================
# FILE STORAGE (CLOUDFLARE R2)
# =============================================================================
# Get these from: Cloudflare Dashboard → R2 → Manage R2 API tokens
R2_ACCESS_KEY_ID=your_r2_access_key_id
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
R2_ACCOUNT_ID=your_cloudflare_account_id
R2_BUCKET_NAME=your_r2_bucket_name

# =============================================================================
# EMAIL SERVICES
# =============================================================================
# Production: Postmark
POSTMARK_API_TOKEN=your_postmark_api_token

# Development: SMTP (optional)
SMTP_HOST=smtp.gmail.com
SMTP_USERNAME=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# =============================================================================
# AI/ML SERVICES
# =============================================================================
# OpenAI
OPENAI_API_KEY=sk-your_openai_api_key

# Anthropic (Claude)
ANTHROPIC_API_KEY=sk-ant-your_anthropic_api_key

# Cohere
COHERE_API_KEY=your_cohere_api_key

# Pinecone
PINECONE_API_KEY=your_pinecone_api_key

# =============================================================================
# EXTERNAL INTEGRATIONS
# =============================================================================
# Airtable
AIRTABLE_API_KEY=your_airtable_api_key
AIRTABLE_FAMILY_BASE_ID=your_family_base_id
AIRTABLE_MEMBERS_TABLE_ID=your_members_table_id
AIRTABLE_EVENT_REGISTRATIONS_BASE_ID=your_event_registrations_base_id

# Airmeet
AIRMEET_ACCESS_KEY=your_airmeet_access_key
AIRMEET_SECRET_KEY=your_airmeet_secret_key

# Twilio (SMS)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Mailchimp
MAILCHIMP_API_KEY=your_mailchimp_api_key
MAILCHIMP_AUDIENCE_ID=your_audience_id
MAILCHIMP_SERVER_PREFIX=us1

# Shopify
SHOPIFY_ACCESS_TOKEN=your_shopify_access_token
SHOPIFY_STORE_NAME=your_store_name

# Crunchbase
CRUNCHBASE_BASIC_API_KEY=your_crunchbase_api_key

# Google Maps
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Browser automation (for web scraping)
BROWSER_WS_ENDPOINT=ws://localhost:3000

# =============================================================================
# MONITORING & ANALYTICS
# =============================================================================
# Sentry
SENTRY_DSN=your_sentry_dsn

# =============================================================================
# DEVELOPMENT SETTINGS
# =============================================================================
# Port for API service
PORT=3001

# =============================================================================
# NOTES
# =============================================================================
# 1. Replace all [PLACEHOLDER] values with your actual credentials
# 2. Keep this file secure and never commit it to version control
# 3. For production, use strong, unique secrets for JWT_SECRET and SESSION_SECRET
# 4. Some services may require additional setup (see ENVIRONMENT_VARIABLES_GUIDE.md)
EOF

echo "✅ .env file created successfully!"
echo ""

# Generate secure secrets
echo "🔐 Generating secure secrets..."
JWT_SECRET=$(openssl rand -base64 32)
SESSION_SECRET=$(openssl rand -base64 32)
CRON_SECRET=$(openssl rand -base64 32)

# Update the .env file with generated secrets (macOS compatible)
sed -i '' "s|your_jwt_secret_key|$JWT_SECRET|g" .env
sed -i '' "s|your_session_secret_key|$SESSION_SECRET|g" .env
sed -i '' "s|your_cron_secret_key|$CRON_SECRET|g" .env

echo "✅ Generated secure secrets for JWT_SECRET, SESSION_SECRET, and CRON_SECRET"
echo ""

echo "📋 Next Steps:"
echo "=============="
echo ""
echo "1. 🔑 Get Supabase credentials:"
echo "   - Go to https://supabase.com/dashboard"
echo "   - Select your project (or create one)"
echo "   - Go to Settings → Database → Copy Connection string (URI)"
echo "   - Go to Settings → API → Copy Project URL and anon key"
echo ""
echo "2. 🚀 Get Upstash credentials:"
echo "   - Go to https://console.upstash.com"
echo "   - Create Redis database → Copy REST URL and token"
echo "   - Create QStash database → Copy token and signing keys"
echo ""
echo "3. ✏️  Edit .env file:"
echo "   - Replace [PASSWORD] with your Supabase database password"
echo "   - Replace [PROJECT-REF] with your Supabase project reference"
echo "   - Add your Upstash Redis and QStash credentials"
echo ""
echo "4. 🧪 Test the setup:"
echo "   - Run: yarn dev:setup"
echo "   - Run: yarn db:migrate"
echo "   - Run: yarn dev:apps"
echo ""
echo "📚 For detailed instructions, see ENVIRONMENT_VARIABLES_GUIDE.md"
echo ""
echo "⚠️  IMPORTANT: Never commit your .env file to version control!"
echo "✅ Setup complete! Edit .env with your actual credentials."
