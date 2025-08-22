# 🚀 Quick Start: Essential Environment Variables

## ⚡ Minimum Required to Run

These are the **absolute minimum** environment variables you need to get the application running:

```bash
# Core
ENVIRONMENT=development
API_URL=http://localhost:3001
STUDENT_PROFILE_URL=http://localhost:3000

# Database (Supabase) - REQUIRED
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
SUPABASE_URL=https://[PROJECT-REF].supabase.co
SUPABASE_ANON_KEY=[YOUR_ANON_KEY]
SUPABASE_SERVICE_ROLE_KEY=[YOUR_SERVICE_ROLE_KEY]

# Redis (Upstash) - REQUIRED  
UPSTASH_REDIS_REST_URL=https://[YOUR-REDIS].upstash.io
UPSTASH_REDIS_REST_TOKEN=[YOUR_REDIS_TOKEN]

# Background Jobs (QStash) - REQUIRED
UPSTASH_QSTASH_TOKEN=[YOUR_QSTASH_TOKEN]
UPSTASH_QSTASH_CURRENT_SIGNING_KEY=[YOUR_CURRENT_KEY]
UPSTASH_QSTASH_NEXT_SIGNING_KEY=[YOUR_NEXT_KEY]

# Security (Auto-generated)
JWT_SECRET=[AUTO_GENERATED]
SESSION_SECRET=[AUTO_GENERATED]
CRON_SECRET=[AUTO_GENERATED]
```

## 🔑 Get Supabase Credentials (5 minutes)

1. **Go to**: [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. **Create project** (or select existing)
3. **Get Database URL**:
   - Settings → Database → Copy Connection string (URI)
   - Replace `[PASSWORD]` with your database password
   - Replace `[PROJECT-REF]` with your project reference
4. **Get API Keys**:
   - Settings → API → Copy Project URL and anon key
   - Copy service_role secret (keep this secret!)

## 🚀 Get Upstash Credentials (5 minutes)

1. **Go to**: [https://console.upstash.com](https://console.upstash.com)
2. **Create Redis database**:
   - Copy REST URL and token
3. **Create QStash database**:
   - Copy token and signing keys

## ✏️ Edit Your .env File

1. **Open**: `.env` file in your project root
2. **Replace placeholders** with actual values
3. **Save** the file

## 🧪 Test Your Setup

```bash
# Test database connection
yarn db:migrate

# Start the application
yarn dev:apps

# Test health endpoint
curl http://localhost:3000/health
```

## 🎯 What You'll Get

- ✅ **Member Profile App**: Running on http://localhost:3000
- ✅ **API Service**: Running on http://localhost:3001  
- ✅ **Database**: Connected to Supabase
- ✅ **Redis**: Connected to Upstash
- ✅ **Background Jobs**: QStash processing

## 🚨 Common Issues

- **Database connection failed**: Check DATABASE_URL format
- **Redis connection failed**: Verify Upstash credentials
- **Migration errors**: Ensure DATABASE_URL is correct
- **Port conflicts**: Change PORT in .env if needed

## 📚 Full Documentation

- **Environment Variables**: `ENVIRONMENT_VARIABLES_GUIDE.md`
- **Supabase Setup**: `SUPABASE_SETUP.md`
- **Render Deployment**: `RENDER_DEPLOYMENT.md`

---

**Need help?** Run `./scripts/setup-env.sh` to regenerate your .env file!
