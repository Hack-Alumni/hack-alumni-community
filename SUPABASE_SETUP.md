# 🔑 Supabase Setup Guide for Hack Alumni Community

This guide walks you through setting up Supabase and getting all the required credentials for your `.env` file.

## 🚀 Quick Start

1. **Create Supabase Project** → Get Database URL and API Keys
2. **Set up Database Schema** → Run migrations
3. **Configure Authentication** → Set up OAuth providers
4. **Test Connection** → Verify everything works

---

## 📋 Step 1: Create Supabase Project

### 1.1 Go to Supabase Dashboard
- Visit [https://supabase.com/dashboard](https://supabase.com/dashboard)
- Sign in with GitHub, Google, or create an account

### 1.2 Create New Project
- Click **"New Project"**
- Choose your organization
- Enter project details:
  - **Name**: `hack-alumni-community` (or your preferred name)
  - **Database Password**: Create a strong password (save this!)
  - **Region**: Choose closest to your users
  - **Pricing Plan**: Start with Free tier

### 1.3 Wait for Setup
- Project creation takes 2-5 minutes
- You'll receive an email when ready

---

## 🔑 Step 2: Get Database Credentials

### 2.1 Database Connection String
1. Go to **Settings** → **Database**
2. Scroll to **Connection string** section
3. Copy the **URI** connection string
4. It looks like: `postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

### 2.2 API Credentials
1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://[PROJECT-REF].supabase.co`
   - **anon public**: Your public API key
   - **service_role secret**: Your service role key (keep this secret!)

---

## 🗄️ Step 3: Database Schema Setup

### 3.1 Run Database Migrations
```bash
# Make sure your .env file has DATABASE_URL set
yarn db:migrate
```

### 3.2 Verify Database Connection
```bash
# Check if tables were created
yarn db:studio
```

---

## 🔐 Step 4: Authentication Setup

### 4.1 Enable OAuth Providers
1. Go to **Authentication** → **Providers**
2. **Google OAuth**:
   - Enable Google provider
   - Add your Google OAuth credentials (see Google setup guide)
   - Redirect URL: `https://[PROJECT-REF].supabase.co/auth/v1/callback`

3. **GitHub OAuth**:
   - Enable GitHub provider
   - Add your GitHub OAuth credentials (see GitHub setup guide)
   - Redirect URL: `https://[PROJECT-REF].supabase.co/auth/v1/callback`

### 4.2 Configure Email Templates
1. Go to **Authentication** → **Email Templates**
2. Customize welcome, confirmation, and reset emails
3. Test email delivery

---

## 📊 Step 5: Database Policies (RLS)

### 5.1 Enable Row Level Security
```sql
-- Enable RLS on all tables
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
-- ... repeat for other tables
```

### 5.2 Create Policies
```sql
-- Example: Members can only see their own data
CREATE POLICY "Users can view own profile" ON public.members
    FOR SELECT USING (auth.uid() = id);

-- Example: Public read access to companies
CREATE POLICY "Anyone can view companies" ON public.companies
    FOR SELECT USING (true);
```

---

## 🧪 Step 6: Test Your Setup

### 6.1 Test Database Connection
```bash
# Test if migrations work
yarn db:migrate

# Check database status
yarn db:studio
```

### 6.2 Test API Endpoints
```bash
# Start your development server
yarn dev:apps

# Test health endpoint
curl http://localhost:3000/health
```

---

## 📝 Environment Variables to Set

Add these to your `.env` file:

```bash
# Supabase Database
DATABASE_URL=postgresql://postgres:[YOUR_PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
SUPABASE_URL=https://[PROJECT-REF].supabase.co
SUPABASE_ANON_KEY=[YOUR_ANON_KEY]
SUPABASE_SERVICE_ROLE_KEY=[YOUR_SERVICE_ROLE_KEY]
```

**Replace:**
- `[YOUR_PASSWORD]` with the database password you created
- `[PROJECT-REF]` with your project reference (found in the URL)
- `[YOUR_ANON_KEY]` with the anon public key
- `[YOUR_SERVICE_ROLE_KEY]` with the service role secret

---

## 🔒 Security Best Practices

### 6.1 Never Commit Secrets
- ✅ `.env` is in `.gitignore`
- ❌ Never commit API keys to version control
- ✅ Use environment variables in production

### 6.2 Key Management
- **anon key**: Safe for client-side (browser)
- **service_role key**: Only use server-side, never expose to client
- **database password**: Keep secure, rotate regularly

### 6.3 Production Security
- Enable SSL connections
- Use strong passwords
- Monitor access logs
- Set up alerts for unusual activity

---

## 🚨 Troubleshooting

### Common Issues

#### 1. Connection Refused
```bash
# Check if DATABASE_URL is correct
echo $DATABASE_URL

# Verify project is active in Supabase dashboard
# Check if you're in the right region
```

#### 2. Authentication Errors
```bash
# Verify API keys are correct
# Check if OAuth providers are enabled
# Ensure redirect URLs match exactly
```

#### 3. Migration Failures
```bash
# Check database permissions
# Verify DATABASE_URL format
# Check if tables already exist
```

### Get Help
- **Supabase Docs**: [https://supabase.com/docs](https://supabase.com/docs)
- **Supabase Community**: [https://github.com/supabase/supabase/discussions](https://github.com/supabase/supabase/discussions)
- **Project Issues**: Check your project's GitHub issues

---

## 📚 Next Steps

After setting up Supabase:

1. **Set up Upstash Redis** (see Upstash guide)
2. **Configure OAuth providers** (Google, GitHub)
3. **Set up file storage** (Cloudflare R2)
4. **Configure email services** (Postmark)
5. **Test your application** with `yarn dev:apps`

---

## ✅ Checklist

- [ ] Created Supabase project
- [ ] Got database connection string
- [ ] Got API keys (anon + service_role)
- [ ] Set DATABASE_URL in .env
- [ ] Set SUPABASE_URL in .env
- [ ] Set SUPABASE_ANON_KEY in .env
- [ ] Set SUPABASE_SERVICE_ROLE_KEY in .env
- [ ] Ran database migrations
- [ ] Tested database connection
- [ ] Enabled OAuth providers
- [ ] Tested authentication flow

**You're ready to run the application!** 🎉
