# 🚀 Complete First-Time Deployment Checklist

## 📋 **PRE-DEPLOYMENT CHECKLIST**

### **1. Account Setup**

- [ ] **Vercel Account**: Create at https://vercel.com
- [ ] **Supabase Account**: Create at https://supabase.com
- [ ] **Upstash Account**: Create at https://upstash.com
- [ ] **Cloudflare R2 Account** (for file storage): Create at
      https://dash.cloudflare.com
- [ ] **Postmark Account** (for emails): Create at https://postmarkapp.com

### **2. External Service Setup**

- [ ] **Google OAuth**: Create project at https://console.cloud.google.com
- [ ] **GitHub OAuth**: Create app at https://github.com/settings/developers
- [ ] **Slack App**: Create at https://api.slack.com/apps
- [ ] **Sentry Account** (error tracking): Create at https://sentry.io

### **3. Database & Infrastructure**

- [ ] **Supabase Project**: Create and get URL + anon key
- [ ] **Upstash Redis**: Create instance and get REST URL + token
- [ ] **Upstash QStash**: Create project and get token + signing keys
- [ ] **Cloudflare R2**: Create bucket and get credentials

### **4. Environment Variables Preparation**

- [ ] **Database URL**: PostgreSQL connection string from Supabase
- [ ] **JWT Secret**: Generate secure random string
- [ ] **Session Secret**: Generate secure random string
- [ ] **API URL**: Your Vercel deployment URL (after first deploy)

---

## 🗄️ **DATABASE ARCHITECTURE EXPLANATION**

### **Why Both DATABASE_URL and SUPABASE_URL?**

This application uses Supabase as the database provider, which offers
PostgreSQL-as-a-Service. Here's how it works:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Your App      │    │   Supabase      │    │   PostgreSQL    │
│                 │    │                 │    │   Database      │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │                 │
│ │ DATABASE_URL│◄┼────┼►│ Auth API    │ │    │                 │
│ │ (Direct DB) │ │    │ │ Edge Funcs  │ │    │                 │
│ └─────────────┘ │    │ │ Storage     │ │    │                 │
│                 │    │ └─────────────┘ │    │                 │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │                 │
│ │SUPABASE_URL │◄┼────┼►│ Same DB     │◄┼────┼►│ Tables & Data │
│ │(Supabase API)│ │    │ │ (PostgreSQL)│ │    │ │               │
│ └─────────────┘ │    │ └─────────────┘ │    │ └───────────────┘
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **DATABASE_URL**

- **Purpose**: Direct PostgreSQL connection for database operations
- **Used for**: Queries, migrations, type generation, ORM operations
- **Format**:
  `postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`
- **Get from**: Supabase Dashboard → Settings → Database → Connection string
  (URI)

### **SUPABASE_URL**

- **Purpose**: Supabase API access for Auth, Edge Functions, etc.
- **Used for**: Authentication, Edge Functions, Supabase-specific features
- **Format**: `https://[PROJECT-REF].supabase.co`
- **Get from**: Supabase Dashboard → Settings → API → Project URL

### **Both Point to the Same Database**

- **DATABASE_URL**: Direct PostgreSQL access
- **SUPABASE_URL**: Supabase API access
- **Same data**: Both access the same PostgreSQL database

---

## 🛠️ **DEPLOYMENT METHODS**

### **Method 1: Vercel CLI Deployment**

#### **Step 1: Install and Setup Vercel CLI**

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Link your project (run from project root)
vercel link
```

#### **Step 2: Set Environment Variables via CLI**

```bash
# Database (Supabase PostgreSQL)
vercel env add DATABASE_URL "postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Supabase
vercel env add SUPABASE_URL "https://[PROJECT-REF].supabase.co"
vercel env add SUPABASE_ANON_KEY "your_supabase_anon_key"

# Upstash QStash
vercel env add UPSTASH_QSTASH_TOKEN "your_qstash_token"
vercel env add UPSTASH_QSTASH_CURRENT_SIGNING_KEY "your_qstash_signing_key"
vercel env add UPSTASH_QSTASH_NEXT_SIGNING_KEY "your_qstash_next_signing_key"

# Upstash Redis
vercel env add UPSTASH_REDIS_REST_URL "https://your-redis.upstash.io"
vercel env add UPSTASH_REDIS_REST_TOKEN "your_upstash_redis_token"

# Authentication
vercel env add GOOGLE_CLIENT_ID "your_google_client_id"
vercel env add GOOGLE_CLIENT_SECRET "your_google_client_secret"
vercel env add GITHUB_CLIENT_ID "your_github_client_id"
vercel env add GITHUB_CLIENT_SECRET "your_github_client_secret"

# Security
vercel env add JWT_SECRET "your_jwt_secret"
vercel env add SESSION_SECRET "your_session_secret"

# API Configuration
vercel env add API_URL "https://your-project.vercel.app"
vercel env add ENVIRONMENT "production"

# External Services
vercel env add SENTRY_DSN "your_sentry_dsn"


# File Storage (Cloudflare R2)
vercel env add R2_ACCESS_KEY_ID "your_r2_access_key"
vercel env add R2_SECRET_ACCESS_KEY "your_r2_secret_key"
vercel env add R2_ACCOUNT_ID "your_r2_account_id"
vercel env add R2_BUCKET_NAME "your_r2_bucket_name"

# Slack Integration
vercel env add SLACK_BOT_TOKEN "your_slack_bot_token"
vercel env add SLACK_SIGNING_SECRET "your_slack_signing_secret"

# Email (Postmark)
vercel env add POSTMARK_API_TOKEN "your_postmark_api_token"
```

#### **Step 3: Deploy**

```bash
# Deploy to production
vercel --prod
```

#### **Step 4: Run Database Migrations**

```bash
# Pull environment variables locally
vercel env pull .env

# Run migrations
yarn db:migrate
```

---

### **Method 2: Vercel UI Deployment**

#### **Step 1: Connect Repository**

1. Go to https://vercel.com/dashboard
2. Click "New Project"
3. Import your GitHub repository
4. Select the repository

#### **Step 2: Configure Project Settings**

1. **Framework Preset**: Select "Other"
2. **Root Directory**: Leave as `/` (root)
3. **Build Command**: `yarn vercel-build`
4. **Install Command**: `yarn install`
5. **Output Directory**: Leave empty (handled by framework)

#### **Step 3: Set Environment Variables**

1. Go to Project Settings → Environment Variables
2. Add all required environment variables (see list above)
3. Set environment to "Production" for all variables

#### **Step 4: Deploy**

1. Click "Deploy"
2. Wait for build to complete
3. Note your deployment URL

#### **Step 5: Run Database Migrations**

```bash
# Clone your repository locally
git clone <your-repo-url>
cd <your-repo-name>

# Pull environment variables
vercel env pull .env

# Run migrations
yarn db:migrate
```

---

## 🔧 **POST-DEPLOYMENT SETUP**

### **1. Supabase Setup**

```bash
# Run the Supabase setup script
chmod +x scripts/supabase-setup.sh
./scripts/supabase-setup.sh
```

### **2. Configure Supabase Cron Jobs**

1. Go to your Supabase Dashboard
2. Navigate to Database → Functions
3. Create a new cron job:
   - **Name**: `process-jobs`
   - **Schedule**: `* * * * *` (every minute)
   - **Function**: `process-jobs`
   - **HTTP Method**: POST

### **3. Configure QStash Webhook**

1. Go to Upstash QStash Dashboard
2. Set webhook URL to: `https://your-app.vercel.app/api/jobs/process-immediate`

### **4. Test Your Deployment**

```bash
# Test the API endpoints
curl https://your-app.vercel.app/api/health
curl https://your-app.vercel.app/admin
curl https://your-app.vercel.app/
```

---

## 📊 **COMPLETE ENVIRONMENT VARIABLES LIST**

### **Required Variables**

```bash
# Database (Supabase PostgreSQL)
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres

# Supabase
SUPABASE_URL=https://[PROJECT-REF].supabase.co
SUPABASE_ANON_KEY=[YOUR-SUPABASE-ANON-KEY]

# Upstash QStash
UPSTASH_QSTASH_TOKEN=[YOUR-QSTASH-TOKEN]
UPSTASH_QSTASH_CURRENT_SIGNING_KEY=[YOUR-QSTASH-SIGNING-KEY]
UPSTASH_QSTASH_NEXT_SIGNING_KEY=[YOUR-QSTASH-NEXT-SIGNING-KEY]

# Upstash Redis
UPSTASH_REDIS_REST_URL=https://[YOUR-REDIS-INSTANCE].upstash.io
UPSTASH_REDIS_REST_TOKEN=[YOUR-REDIS-TOKEN]

# Authentication
GOOGLE_CLIENT_ID=[YOUR-GOOGLE-CLIENT-ID]
GOOGLE_CLIENT_SECRET=[YOUR-GOOGLE-CLIENT-SECRET]
GITHUB_CLIENT_ID=[YOUR-GITHUB-CLIENT-ID]
GITHUB_CLIENT_SECRET=[YOUR-GITHUB-CLIENT-SECRET]

# Security
JWT_SECRET=[GENERATE-SECURE-RANDOM-STRING]
SESSION_SECRET=[GENERATE-SECURE-RANDOM-STRING]

# API Configuration
API_URL=https://[YOUR-VERCEL-APP].vercel.app
ENVIRONMENT=production

# External Services
SENTRY_DSN=[YOUR-SENTRY-DSN]


# File Storage (Cloudflare R2)
R2_ACCESS_KEY_ID=[YOUR-R2-ACCESS-KEY]
R2_SECRET_ACCESS_KEY=[YOUR-R2-SECRET-KEY]
R2_ACCOUNT_ID=[YOUR-R2-ACCOUNT-ID]
R2_BUCKET_NAME=[YOUR-R2-BUCKET-NAME]

# Slack Integration
SLACK_BOT_TOKEN=[YOUR-SLACK-BOT-TOKEN]
SLACK_SIGNING_SECRET=[YOUR-SLACK-SIGNING-SECRET]

# Email (Postmark)
POSTMARK_API_TOKEN=[YOUR-POSTMARK-API-TOKEN]
```

### **Optional Variables**

```bash
# External APIs (optional)
AIRTABLE_API_KEY=[YOUR-AIRTABLE-API-KEY]
AIRTABLE_FAMILY_BASE_ID=[YOUR-AIRTABLE-BASE-ID]
AIRTABLE_MEMBERS_TABLE_ID=[YOUR-AIRTABLE-TABLE-ID]
ANTHROPIC_API_KEY=[YOUR-ANTHROPIC-API-KEY]
OPENAI_API_KEY=[YOUR-OPENAI-API-KEY]
COHERE_API_KEY=[YOUR-COHERE-API-KEY]
PINECONE_API_KEY=[YOUR-PINECONE-API-KEY]
MAILCHIMP_API_KEY=[YOUR-MAILCHIMP-API-KEY]
MAILCHIMP_AUDIENCE_ID=[YOUR-MAILCHIMP-AUDIENCE-ID]
MAILCHIMP_SERVER_PREFIX=[YOUR-MAILCHIMP-SERVER-PREFIX]
TWILIO_ACCOUNT_SID=[YOUR-TWILIO-ACCOUNT-SID]
TWILIO_AUTH_TOKEN=[YOUR-TWILIO-AUTH-TOKEN]
TWILIO_PHONE_NUMBER=[YOUR-TWILIO-PHONE-NUMBER]
```

---

## 🔍 **TROUBLESHOOTING**

### **Common Issues**

1. **Build Fails**: Check Node.js version (requires v20)
2. **Database Connection**: Verify DATABASE_URL format
3. **Environment Variables**: Ensure all required vars are set
4. **Job Processing**: Check QStash webhook configuration
5. **File Uploads**: Verify R2 bucket permissions

### **Useful Commands**

```bash
# Check deployment status
vercel ls

# View deployment logs
vercel logs

# Redeploy
vercel --prod

# Pull latest environment variables
vercel env pull .env

# Run migrations
yarn db:migrate
```

---

## 🎯 **DEPLOYMENT SUMMARY**

**Estimated Time**: 2-4 hours for first-time setup **Cost**: ~$20-50/month for
all services **Complexity**: Medium (requires multiple service integrations)

**Key Success Factors**:

1. ✅ All environment variables properly set
2. ✅ Database migrations run successfully
3. ✅ Supabase cron jobs configured
4. ✅ QStash webhook properly set
5. ✅ File storage permissions correct

This deployment setup provides a production-ready application with background
job processing, file storage, email capabilities, and real-time features.
