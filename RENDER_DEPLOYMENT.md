# Render Deployment Guide

This guide will help you deploy the Hack Alumni Community monorepo to Render.

## 🚀 Quick Start

### 1. Prerequisites

- [Render account](https://render.com)
- [Supabase account](https://supabase.com) for database
- GitHub repository with your code
- Environment variables ready

### 2. Deployment Options

You have two main options for deployment:

#### Option A: Using render.yaml (Recommended)

1. **Fork/Clone the repository** to your GitHub account
2. **Connect to Render**:
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect the `render.yaml` file

3. **Configure Environment Variables**:
   - In the Render dashboard, go to each service
   - Add the required environment variables (see `render-env.example`)

4. **Deploy**:
   - Render will automatically build and deploy all services
   - Each service will be available at its own URL

#### Option B: Manual Service Creation

1. **Create API Service**:
   - Go to Render Dashboard → "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `hack-alumni-api`
     - **Root Directory**: `.` (root)
     - **Build Command**:
       `yarn install && yarn workspace @hackcommunity/api build`
     - **Start Command**: `yarn workspace @hackcommunity/api start`
     - **Environment**: `Node`
     - **Plan**: `Starter`

2. **Create Admin Dashboard Service**:
   - Repeat the process for admin dashboard
   - Configure:
     - **Name**: `hack-alumni-admin-dashboard`
     - **Build Command**:
       `yarn install && yarn workspace @hackcommunity/admin-dashboard build`
     - **Start Command**: `yarn workspace @hackcommunity/admin-dashboard start`

3. **Create Member Profile Service**:
   - Repeat the process for member profile
   - Configure:
     - **Name**: `hack-alumni-member-profile`
     - **Build Command**:
       `yarn install && yarn workspace @hackcommunity/member-profile build`
     - **Start Command**: `yarn workspace @hackcommunity/member-profile start`

## 🔧 Configuration

### Environment Variables

Each service needs specific environment variables. See `render-env.example` for
a complete list.

#### Required for All Services:

- `NODE_ENV=production`
- `DATABASE_URL` (Supabase PostgreSQL connection string)
- `JWT_SECRET` (for authentication)
- `SENTRY_DSN` (for error tracking)

#### API Service Specific:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `AWS_S3_BUCKET`
- `POSTMARK_API_TOKEN`
- `SLACK_BOT_TOKEN`
- `SLACK_SIGNING_SECRET`
- `SLACK_APP_TOKEN`
- `QSTASH_TOKEN`
- `QSTASH_CURRENT_SIGNING_KEY`
- `QSTASH_NEXT_SIGNING_KEY`
- `REDIS_URL`

#### Frontend Services:

- `API_BASE_URL` (URL of the API service)

### Database Setup (Supabase)

1. **Create Supabase Project**:
   - Go to [Supabase Dashboard](https://app.supabase.com)
   - Click "New Project"
   - Choose your organization
   - Enter project name: `hack-alumni-community`
   - Set a secure database password
   - Choose a region close to your users
   - Click "Create new project"

2. **Get Database Connection String**:
   - In your Supabase project dashboard
   - Go to Settings → Database
   - Copy the connection string
   - Format:
     `postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres`

3. **Run Database Migrations**:
   - Use the connection string in your `DATABASE_URL` environment variable
   - Run migrations: `yarn db:migrate`

### Custom Domains

1. **Add Custom Domain**:
   - In each service's settings, go to "Custom Domains"
   - Add your domain (e.g., `api.yourdomain.com`)
   - Configure DNS records as instructed

2. **SSL Certificate**:
   - Render automatically provides SSL certificates
   - No additional configuration needed

## 🏗️ Build Process

The build process is handled by the `scripts/render-build.sh` script:

1. **Install Dependencies**: `yarn install --frozen-lockfile`
2. **Build Packages**: `yarn build`
3. **Build Specific Service**: Based on `SERVICE_NAME` environment variable

## 🚀 Start Process

The start process is handled by the `scripts/render-start.sh` script:

1. **Detect Service**: Based on `SERVICE_NAME` environment variable
2. **Start Service**: Runs the appropriate start command for the service

## 📊 Monitoring

### Logs

- View logs in the Render dashboard for each service
- Logs are automatically rotated and archived

### Health Checks

- Render automatically performs health checks
- Services are restarted if they become unhealthy

### Metrics

- Basic metrics are available in the Render dashboard
- CPU, memory, and request metrics are tracked

## 🔄 Continuous Deployment

### Automatic Deploys

- Render automatically deploys when you push to the main branch
- You can configure branch-specific deployments

### Manual Deploys

- Trigger manual deploys from the Render dashboard
- Useful for testing or rolling back changes

## 🛠️ Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check the build logs in Render dashboard
   - Ensure all dependencies are properly installed
   - Verify the build commands are correct

2. **Environment Variables**:
   - Ensure all required environment variables are set
   - Check for typos in variable names
   - Verify the values are correct

3. **Database Connection**:
   - Verify the `DATABASE_URL` is correct
   - Ensure the database is accessible from Render
   - Check if migrations need to be run

4. **Service Communication**:
   - Verify the `API_BASE_URL` is correct
   - Ensure services can communicate with each other
   - Check CORS settings if needed

### Debugging

1. **View Logs**:
   - Go to the service in Render dashboard
   - Click on "Logs" tab
   - Look for error messages

2. **Shell Access**:
   - Use Render's shell feature to debug
   - Access the running container directly

3. **Local Testing**:
   - Test the build process locally first
   - Use the same Node.js version as Render

## 📝 Notes

- Render uses Node.js 20 by default
- Services are automatically restarted on failures
- Environment variables are encrypted and secure
- Custom domains require DNS configuration
- SSL certificates are automatically provisioned

## 🆘 Support

If you encounter issues:

1. Check the [Render documentation](https://render.com/docs)
2. Review the build and runtime logs
3. Verify all configuration is correct
4. Contact Render support if needed

## 🔗 Useful Links

- [Render Dashboard](https://dashboard.render.com)
- [Render Documentation](https://render.com/docs)
- [Node.js on Render](https://render.com/docs/deploy-node-express-app)
- [PostgreSQL on Render](https://render.com/docs/deploy-postgres)
