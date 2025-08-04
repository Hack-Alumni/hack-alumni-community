# 🚀 Complete Environment Variables Guide for Hack Alumni Community

This guide provides a comprehensive overview of all environment variables needed
to run the Hack Alumni Community application, including how to obtain each one
and their specific purposes.

## 📋 Table of Contents

1. [Database Configuration](#database-configuration)
2. [Authentication & Security](#authentication--security)
3. [Background Job Processing](#background-job-processing)
4. [File Storage](#file-storage)
5. [Slack Integration](#slack-integration)
6. [Email Services](#email-services)
7. [AI/ML Services](#aiml-services)
8. [External Integrations](#external-integrations)
9. [Development Settings](#development-settings)
10. [Optional Features](#optional-features)

---

## 🗄️ Database Configuration

### **DATABASE_URL**

- **Purpose**: Direct PostgreSQL connection string to Supabase database
- **Format**:
  `postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`
- **How to Get**:
  1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
  2. Select your project
  3. Go to Settings → Database
  4. Copy the "Connection string (URI)" value
- **Usage**: Used for all database operations (queries, migrations, etc.)

### **SUPABASE_URL**

- **Purpose**: Supabase project URL for Auth, Edge Functions, and other
  Supabase-specific features
- **Format**: `https://[PROJECT-REF].supabase.co`
- **How to Get**:
  1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
  2. Select your project
  3. Go to Settings → API
  4. Copy the "Project URL" value
- **Usage**: Used for Supabase Auth, Edge Functions, and client-side operations

### **SUPABASE_ANON_KEY**

- **Purpose**: Supabase anonymous key for client-side operations
- **How to Get**:
  1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
  2. Select your project
  3. Go to Settings → API
  4. Copy the "anon public" key
- **Usage**: Used for client-side database operations and Auth

---

## 🔐 Authentication & Security

### **GOOGLE_CLIENT_ID** & **GOOGLE_CLIENT_SECRET**

- **Purpose**: Google OAuth authentication for user login
- **How to Get**:
  1. Go to [Google Cloud Console](https://console.cloud.google.com)
  2. Create a new project or select existing
  3. Enable Google+ API and Google People API
  4. Go to APIs & Services → Credentials
  5. Create OAuth 2.0 Client ID
  6. Add redirect URIs: `http://localhost:8080/oauth/google` (dev) and
     `https://your-domain.vercel.app/oauth/google` (prod)
- **Usage**: Allows users to sign in with their Google accounts

### **GITHUB_CLIENT_ID** & **GITHUB_CLIENT_SECRET**

- **Purpose**: GitHub OAuth authentication for user login
- **How to Get**:
  1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
  2. Create a new OAuth App
  3. Set Homepage URL and Authorization callback URL
  4. Copy Client ID and generate Client Secret
- **Usage**: Allows users to sign in with their GitHub accounts

### **JWT_SECRET**

- **Purpose**: Secret key for JWT token signing and verification
- **How to Generate**:
  ```bash
  openssl rand -base64 32
  ```
- **Usage**: Used for secure session management and API authentication

### **SESSION_SECRET**

- **Purpose**: Secret key for session encryption
- **How to Generate**:
  ```bash
  openssl rand -base64 32
  ```
- **Usage**: Used for encrypting session data

---

## ⚡ Background Job Processing

### **UPSTASH_QSTASH_TOKEN**

- **Purpose**: Token for Upstash QStash real-time job processing
- **How to Get**:
  1. Go to [Upstash Console](https://console.upstash.com)
  2. Create a new QStash database
  3. Copy the token from the dashboard
- **Usage**: Processes real-time jobs like Slack messages, notifications

### **UPSTASH_QSTASH_CURRENT_SIGNING_KEY** & **UPSTASH_QSTASH_NEXT_SIGNING_KEY**

- **Purpose**: Signing keys for QStash webhook verification
- **How to Get**: Available in your Upstash QStash dashboard
- **Usage**: Verifies that job webhooks come from Upstash

### **UPSTASH_REDIS_REST_URL** & **UPSTASH_REDIS_REST_TOKEN**

- **Purpose**: Redis connection for caching and session storage
- **How to Get**:
  1. Go to [Upstash Console](https://console.upstash.com)
  2. Create a new Redis database
  3. Copy the REST URL and token
- **Usage**: Caching, session storage, and temporary data

### **CRON_SECRET**

- **Purpose**: Secret for securing Vercel cron job endpoints
- **How to Generate**:
  ```bash
  openssl rand -base64 32
  ```
- **Usage**: Prevents unauthorized access to cron job endpoints

---

## 📁 File Storage

### **R2_ACCESS_KEY_ID** & **R2_SECRET_ACCESS_KEY**

- **Purpose**: Cloudflare R2 credentials for file uploads
- **How to Get**:
  1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
  2. Go to R2 Object Storage
  3. Create API tokens with R2 permissions
  4. Copy Access Key ID and Secret Access Key
- **Usage**: Stores user uploads like resumes, profile pictures

### **R2_ACCOUNT_ID**

- **Purpose**: Cloudflare account ID for R2
- **How to Get**: Available in your Cloudflare dashboard sidebar
- **Usage**: Required for R2 API calls

### **R2_BUCKET_NAME**

- **Purpose**: Name of the R2 bucket for file storage
- **How to Get**: Create a bucket in your Cloudflare R2 dashboard
- **Usage**: Specifies which bucket to store files in

---

## 💬 Slack Integration

### **SLACK_BOT_TOKEN**

- **Purpose**: Bot token for Slack app interactions
- **How to Get**:
  1. Go to [Slack API](https://api.slack.com/apps)
  2. Create a new app
  3. Go to OAuth & Permissions
  4. Install app to workspace
  5. Copy Bot User OAuth Token
- **Usage**: Allows the app to send messages and interact with Slack

### **SLACK_SIGNING_SECRET**

- **Purpose**: Secret for verifying Slack webhook requests
- **How to Get**: Available in your Slack app's Basic Information page
- **Usage**: Verifies that webhooks come from Slack

### **SLACK_CLIENT_ID** & **SLACK_CLIENT_SECRET**

- **Purpose**: OAuth credentials for Slack user authentication
- **How to Get**: Available in your Slack app's Basic Information page
- **Usage**: Allows users to sign in with Slack

### **SLACK_FEED_CHANNEL_ID**

- **Purpose**: Channel ID for posting community updates
- **How to Get**: Right-click the channel in Slack and copy the channel ID
- **Usage**: Posts community announcements and updates

### **SLACK_BIRTHDAYS_CHANNEL_ID**

- **Purpose**: Channel ID for birthday notifications
- **How to Get**: Right-click the channel in Slack and copy the channel ID
- **Usage**: Posts birthday notifications

### **SLACK_ANNOUNCEMENTS_CHANNEL_ID**

- **Purpose**: Channel ID for important announcements
- **How to Get**: Right-click the channel in Slack and copy the channel ID
- **Usage**: Posts important community announcements

### **SLACK_INTRODUCTIONS_CHANNEL_ID**

- **Purpose**: Channel ID for new member introductions
- **How to Get**: Right-click the channel in Slack and copy the channel ID
- **Usage**: Posts new member introductions

### **SLACK_BIRTHDATE_FIELD_ID**

- **Purpose**: Custom field ID for birthdate in Slack profiles
- **How to Get**: Available in your Slack workspace's custom profile fields
- **Usage**: Syncs birthdate information from Slack profiles

### **SLACK_TEAM_ID**

- **Purpose**: Slack workspace/team ID
- **How to Get**: Available in your Slack workspace settings
- **Usage**: Identifies the Slack workspace

### **INTERNAL_SLACK_BOT_TOKEN**

- **Purpose**: Bot token for internal Slack workspace (if different)
- **How to Get**: Same as SLACK_BOT_TOKEN but for internal workspace
- **Usage**: Internal workspace communications

---

## 📧 Email Services

### **POSTMARK_API_TOKEN**

- **Purpose**: API token for Postmark email service (production)
- **How to Get**:
  1. Go to [Postmark](https://account.postmarkapp.com)
  2. Create an account
  3. Go to API Tokens
  4. Create a new API token
- **Usage**: Sends transactional emails in production

### **SMTP_HOST**, **SMTP_USERNAME**, **SMTP_PASSWORD**

- **Purpose**: SMTP settings for local email testing
- **How to Get**: Configure with your email provider's SMTP settings
- **Usage**: Local development email testing

---

## 🤖 AI/ML Services

### **OPENAI_API_KEY**

- **Purpose**: OpenAI API key for AI features
- **How to Get**:
  1. Go to [OpenAI Platform](https://platform.openai.com)
  2. Create an account
  3. Go to API Keys
  4. Create a new API key
- **Usage**: AI-powered features like chatbot responses

### **ANTHROPIC_API_KEY**

- **Purpose**: Anthropic API key for Claude AI
- **How to Get**:
  1. Go to [Anthropic Console](https://console.anthropic.com)
  2. Create an account
  3. Generate an API key
- **Usage**: Alternative AI provider for advanced features

### **COHERE_API_KEY**

- **Purpose**: Cohere API key for text processing
- **How to Get**:
  1. Go to [Cohere Console](https://console.cohere.ai)
  2. Create an account
  3. Generate an API key
- **Usage**: Text processing and analysis features

### **PINECONE_API_KEY**

- **Purpose**: Pinecone API key for vector search
- **How to Get**:
  1. Go to [Pinecone Console](https://app.pinecone.io)
  2. Create an account
  3. Create an index
  4. Copy the API key
- **Usage**: Vector search and similarity matching

---

## 🔗 External Integrations

### **AIRTABLE_API_KEY**

- **Purpose**: Airtable API key for data sync
- **How to Get**:
  1. Go to [Airtable](https://airtable.com)
  2. Go to Account → API
  3. Generate an API key
- **Usage**: Syncs data with external Airtable bases

### **AIRTABLE_FAMILY_BASE_ID**

- **Purpose**: Airtable base ID for family data
- **How to Get**: Available in your Airtable base URL
- **Usage**: Stores family relationship data

### **AIRTABLE_MEMBERS_TABLE_ID**

- **Purpose**: Airtable table ID for member data
- **How to Get**: Available in your Airtable table URL
- **Usage**: Stores member information

### **AIRTABLE_EVENT_REGISTRATIONS_BASE_ID**

- **Purpose**: Airtable base ID for event registrations
- **How to Get**: Available in your Airtable base URL
- **Usage**: Tracks event registrations

### **MAILCHIMP_API_KEY**

- **Purpose**: Mailchimp API key for email marketing
- **How to Get**:
  1. Go to [Mailchimp](https://mailchimp.com)
  2. Go to Account → Extras → API Keys
  3. Generate an API key
- **Usage**: Email marketing campaigns

### **MAILCHIMP_AUDIENCE_ID**

- **Purpose**: Mailchimp audience/list ID
- **How to Get**: Available in your Mailchimp audience settings
- **Usage**: Specifies which audience to send emails to

### **MAILCHIMP_SERVER_PREFIX**

- **Purpose**: Mailchimp server prefix (e.g., us1, us2)
- **How to Get**: Available in your Mailchimp account settings
- **Usage**: Required for Mailchimp API calls

### **TWILIO_ACCOUNT_SID** & **TWILIO_AUTH_TOKEN**

- **Purpose**: Twilio credentials for SMS
- **How to Get**:
  1. Go to [Twilio Console](https://console.twilio.com)
  2. Create an account
  3. Copy Account SID and Auth Token
- **Usage**: Sends SMS notifications

### **TWILIO_PHONE_NUMBER**

- **Purpose**: Twilio phone number for sending SMS
- **How to Get**: Purchase a phone number in your Twilio console
- **Usage**: The number that sends SMS messages

### **GITHUB_TOKEN**

- **Purpose**: GitHub personal access token
- **How to Get**:
  1. Go to [GitHub Settings](https://github.com/settings/tokens)
  2. Generate new token
  3. Select required scopes
- **Usage**: GitHub API integration

### **GOOGLE_MAPS_API_KEY**

- **Purpose**: Google Maps API key for location features
- **How to Get**:
  1. Go to [Google Cloud Console](https://console.cloud.google.com)
  2. Enable Maps JavaScript API
  3. Create credentials
- **Usage**: Location-based features and maps

### **CRUNCHBASE_BASIC_API_KEY**

- **Purpose**: Crunchbase API key for company data
- **How to Get**:
  1. Go to [Crunchbase](https://data.crunchbase.com)
  2. Apply for API access
  3. Get API key
- **Usage**: Company information and data

### **SHOPIFY_ACCESS_TOKEN** & **SHOPIFY_STORE_NAME**

- **Purpose**: Shopify API credentials
- **How to Get**:
  1. Go to [Shopify Partners](https://partners.shopify.com)
  2. Create a private app
  3. Generate access token
- **Usage**: E-commerce integration

### **AIRMEET_ACCESS_KEY** & **AIRMEET_SECRET_KEY**

- **Purpose**: Airmeet API credentials for events
- **How to Get**:
  1. Go to [Airmeet](https://airmeet.com)
  2. Contact support for API access
- **Usage**: Virtual event integration

---

## 🛠️ Development Settings

### **ENVIRONMENT**

- **Purpose**: Specifies the environment (development/production)
- **Values**: `development`, `production`, `test`
- **Usage**: Determines which features are enabled

### **API_URL**

- **Purpose**: URL of your API deployment
- **Format**: `https://your-app.vercel.app` (prod) or `http://localhost:8080`
  (dev)
- **Usage**: Frontend needs to know where to call the API

### **STUDENT_PROFILE_URL**

- **Purpose**: URL of the member profile app
- **Format**: `https://your-profile-app.vercel.app` (prod) or
  `http://localhost:3000` (dev)
- **Usage**: Links between different parts of the application

### **PORT**

- **Purpose**: Port number for the API server
- **Default**: `8080`
- **Usage**: Specifies which port the API runs on

### **REDIS_URL**

- **Purpose**: Redis connection URL for local development
- **Format**: `redis://localhost:6380`
- **Usage**: Local Redis connection for development

### **BROWSER_WS_ENDPOINT**

- **Purpose**: WebSocket endpoint for browser automation
- **Usage**: Used for web scraping and automation features

### **OXYLABS_USERNAME** & **OXYLABS_PASSWORD**

- **Purpose**: OxyLabs proxy credentials
- **How to Get**: Sign up at [OxyLabs](https://oxylabs.io)
- **Usage**: Web scraping with proxy support

### **OXYLABS_PROXIES**

- **Purpose**: OxyLabs proxy configuration
- **Usage**: Specifies which proxies to use for scraping

---

## 📊 Monitoring & Analytics

### **SENTRY_DSN**

- **Purpose**: Sentry DSN for error tracking
- **How to Get**:
  1. Go to [Sentry](https://sentry.io)
  2. Create a project
  3. Copy the DSN
- **Usage**: Error tracking and monitoring

---

## 🚀 Deployment Checklist

### **Required for Production:**

1. ✅ Database (Supabase)
2. ✅ Authentication (Google/GitHub OAuth)
3. ✅ File Storage (Cloudflare R2)
4. ✅ Background Jobs (Upstash QStash/Redis)
5. ✅ Email Service (Postmark)
6. ✅ Slack Integration
7. ✅ Error Tracking (Sentry)

### **Optional Features:**

1. 🔄 AI/ML Services (OpenAI, Anthropic, etc.)
2. 📊 Analytics (Sentry)
3. 📧 Marketing (Mailchimp)
4. 📱 SMS (Twilio)
5. 📊 External Data (Airtable, Crunchbase)
6. 🛒 E-commerce (Shopify)
7. 🎥 Events (Airmeet)

---

## 🎯 Summary

This guide covers all environment variables needed for the Hack Alumni Community
project. The variables are organized by functionality, making it easy to set up
only the features you need. Start with the required variables for basic
functionality, then add optional features as needed.

**Remember**: Never commit your `.env` file to version control. Always use
`.env.example` for documentation and keep your actual values secure.
