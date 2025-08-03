# Vercel Deployment Guide

This guide explains how to deploy the Hack Alumni Community application to
Vercel.

## Prerequisites

- Vercel account
- Supabase project
- Upstash Redis instance
- Upstash QStash instance (for real-time jobs)
- Database (PostgreSQL)
- Various API keys and tokens

## Database Architecture

**Important**: This application uses Supabase as the database provider. Here's
how the database configuration works:

### Database Configuration

- **Supabase provides PostgreSQL**: Supabase is a PostgreSQL-as-a-Service
  platform
- **DATABASE_URL**: Direct PostgreSQL connection string to Supabase's PostgreSQL
  instance
- **SUPABASE_URL**: Supabase project URL for Auth, Edge Functions, and other
  Supabase-specific features
- **Both point to the same database** but serve different purposes

### Example Configuration

```bash
# Direct PostgreSQL connection to Supabase
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres

# Supabase project URL (for Auth, Edge Functions, etc.)
SUPABASE_URL=https://[PROJECT-REF].supabase.co
SUPABASE_ANON_KEY=[YOUR-SUPABASE-ANON-KEY]
```

### Where to Get These Values

1. **DATABASE_URL**: Supabase Dashboard → Settings → Database → Connection
   string (URI)
2. **SUPABASE_URL**: Supabase Dashboard → Settings → API → Project URL
3. **SUPABASE_ANON_KEY**: Supabase Dashboard → Settings → API → anon public

## Environment Variables

### Required Environment Variables

```bash
# Database (Supabase PostgreSQL)
DATABASE_URL=your_supabase_postgresql_connection_string

# Supabase (for scheduled jobs)
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Upstash QStash (for real-time jobs)
UPSTASH_QSTASH_TOKEN=your_qstash_token
UPSTASH_QSTASH_CURRENT_SIGNING_KEY=your_qstash_signing_key
UPSTASH_QSTASH_NEXT_SIGNING_KEY=your_qstash_next_signing_key

# Redis Configuration (Upstash Redis)
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token

# Authentication
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# JWT and Session
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret

# API Configuration
API_URL=your_api_url
ENVIRONMENT=production

# External Services
SENTRY_DSN=your_sentry_dsn
MIXPANEL_TOKEN=your_mixpanel_token

# Job Processing (Optional)
START_JOB_PROCESSORS=true

# AWS/R2 Storage
R2_ACCESS_KEY_ID=your_r2_access_key
R2_SECRET_ACCESS_KEY=your_r2_secret_key
R2_ACCOUNT_ID=your_r2_account_id
R2_BUCKET_NAME=your_r2_bucket_name

# Slack Integration
SLACK_BOT_TOKEN=your_slack_bot_token
SLACK_SIGNING_SECRET=your_slack_signing_secret

# Email (Postmark for production)
POSTMARK_API_TOKEN=your_postmark_api_token
```

### Optional Environment Variables

```bash
# Development only
SMTP_HOST=your_smtp_host
SMTP_USERNAME=your_smtp_username
SMTP_PASSWORD=your_smtp_password

# External APIs (optional)
AIRTABLE_API_KEY=your_airtable_api_key
AIRTABLE_FAMILY_BASE_ID=your_airtable_base_id
AIRTABLE_MEMBERS_TABLE_ID=your_airtable_table_id
ANTHROPIC_API_KEY=your_anthropic_api_key
OPENAI_API_KEY=your_openai_api_key
COHERE_API_KEY=your_cohere_api_key
PINECONE_API_KEY=your_pinecone_api_key
MAILCHIMP_API_KEY=your_mailchimp_api_key
MAILCHIMP_AUDIENCE_ID=your_mailchimp_audience_id
MAILCHIMP_SERVER_PREFIX=your_mailchimp_server_prefix
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

## Deployment Steps

### 1. Connect to Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Link your project: `vercel link`

### 2. Set Environment Variables

Set all required environment variables in your Vercel project dashboard or via
CLI:

```bash
# Database (Supabase PostgreSQL)
vercel env add DATABASE_URL "postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Supabase Configuration
vercel env add SUPABASE_URL "https://[PROJECT-REF].supabase.co"
vercel env add SUPABASE_ANON_KEY "your_supabase_anon_key"

# Upstash QStash Configuration
vercel env add UPSTASH_QSTASH_TOKEN "your_qstash_token"
vercel env add UPSTASH_QSTASH_CURRENT_SIGNING_KEY "your_qstash_signing_key"
vercel env add UPSTASH_QSTASH_NEXT_SIGNING_KEY "your_qstash_next_signing_key"

# Redis Configuration (Upstash Redis)
vercel env add UPSTASH_REDIS_REST_URL "https://your-redis.upstash.io"
vercel env add UPSTASH_REDIS_REST_TOKEN "your_upstash_redis_token"

# Authentication
vercel env add GOOGLE_CLIENT_ID "your_google_client_id"
vercel env add GOOGLE_CLIENT_SECRET "your_google_client_secret"
vercel env add GITHUB_CLIENT_ID "your_github_client_id"
vercel env add GITHUB_CLIENT_SECRET "your_github_client_secret"

# JWT and Session
vercel env add JWT_SECRET "your_jwt_secret"
vercel env add SESSION_SECRET "your_session_secret"

# API Configuration
vercel env add API_URL "https://your-project.vercel.app"
vercel env add ENVIRONMENT "production"

# External Services
vercel env add SENTRY_DSN "your_sentry_dsn"
vercel env add MIXPANEL_TOKEN "your_mixpanel_token"

# AWS/R2 Storage
vercel env add R2_ACCESS_KEY_ID "your_r2_access_key"
vercel env add R2_SECRET_ACCESS_KEY "your_r2_secret_key"
vercel env add R2_ACCOUNT_ID "your_r2_account_id"
vercel env add R2_BUCKET_NAME "your_r2_bucket_name"

# Slack Integration
vercel env add SLACK_BOT_TOKEN "your_slack_bot_token"
vercel env add SLACK_SIGNING_SECRET "your_slack_signing_secret"

# Email
vercel env add POSTMARK_API_TOKEN "your_postmark_api_token"
```

### 3. Deploy

```bash
vercel --prod
```

### 4. Run Database Migrations

```bash
vercel env pull .env
yarn db:migrate
```

## Development

For local development, you can still use the original Docker setup:

```bash
# Start database and Redis
yarn dx:up

# Run migrations
yarn db:migrate

# Seed database
yarn db:seed

# Start all apps
yarn dev:apps
```

## Important Notes

### Database Migrations

Database migrations need to be run manually after deployment:

```bash
vercel env pull .env
yarn db:migrate
```

### Supabase Setup

1. **Create Supabase Project**: Create a new project at https://supabase.com
2. **Get Database Credentials**:
   - Go to Settings → Database → Connection string (URI) for DATABASE_URL
   - Go to Settings → API for SUPABASE_URL and SUPABASE_ANON_KEY
3. **Run Jobs Table Migration**: Execute the SQL in
   `supabase/migrations/20241201000000_create_jobs_table.sql`

### Upstash QStash Setup

1. **Create QStash Project**: Go to https://console.upstash.com/qstash
2. **Get Credentials**: Copy your token and signing keys
3. **Configure Webhook**: Set the webhook URL to
   `https://your-app.vercel.app/api/jobs/process-immediate`

### Hybrid Background Jobs

The application uses a hybrid job queue system:

#### **Real-time Jobs (QStash)**

- Slack message processing
- Immediate email notifications
- Real-time Slack reactions
- Chatbot responses
- Immediate notifications

#### **Scheduled Jobs (Supabase)**

- Birthday emails
- Weekly reports
- Database cleanup
- Bulk Airtable updates
- Recurring tasks

#### **Job Processing Endpoints**

- `/api/jobs/process-immediate` - Processes real-time jobs from QStash
- `/api/jobs/process` - Triggers scheduled job processing
- `/api/cron/cleanup-old-jobs` - Cleans up old jobs

#### **Scheduling**

- **Real-time jobs**: Processed immediately via QStash
- **Scheduled jobs**: Processed via Supabase cron (every minute)
- **Cleanup**: Daily cleanup via Supabase cron

### File Uploads

For file uploads (resumes, profile pictures, etc.), the app uses AWS S3/R2. Make
sure your S3 bucket is properly configured and accessible.

### Redis Configuration

This project uses **Upstash Redis** for caching and session storage:

- **Upstash Redis** (`UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`) -
  Used for caching, session storage, and general Redis operations

## Troubleshooting

### Build Issues

If you encounter build issues:

1. Check that all dependencies are properly installed
2. Ensure TypeScript compilation is successful
3. Verify that all environment variables are set

### Runtime Issues

For runtime issues:

1. Check Vercel function logs
2. Verify database connectivity
3. Ensure Upstash Redis is accessible
4. Check Supabase connectivity
5. Verify QStash webhook configuration
6. Verify external service configurations

### Job Processing Issues

If background jobs aren't processing:

1. **Real-time jobs**: Check QStash dashboard and webhook configuration
2. **Scheduled jobs**: Check Supabase jobs table and cron configuration
3. **Verify endpoints**: Test `/api/jobs/process-immediate` and
   `/api/jobs/process`
4. **Check logs**: Monitor both QStash and Supabase function logs

## Support

For deployment issues, check:

- Vercel documentation: https://vercel.com/docs
- Vercel community: https://github.com/vercel/vercel/discussions
- Supabase documentation: https://supabase.com/docs
- Upstash QStash documentation: https://docs.upstash.com/qstash
