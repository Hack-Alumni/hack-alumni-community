# Render.com Deployment Guide

This guide covers deploying the Hack Alumni Community app on Render.com instead of Vercel.

## Overview

The application consists of three main services:
1. **Member Profile App** - Frontend Remix application
2. **API Service** - Express.js backend API
3. **Cron Worker** - Background job processor

## Prerequisites

- Render.com account
- Supabase project (for database)
- Upstash Redis instance
- Environment variables configured

## Deployment Steps

### 1. Connect Your Repository

1. Go to [Render.com](https://render.com) and sign in
2. Click "New +" and select "Blueprint"
3. Connect your GitHub repository
4. Render will automatically detect the `render.yaml` configuration

### 2. Environment Variables

Set the following environment variables in each service:

#### Required Environment Variables

```bash
# Database
DATABASE_URL=your_supabase_database_url

# Redis (Upstash)
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token

# Supabase
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# QStash (for background jobs)
QSTASH_TOKEN=your_qstash_token
QSTASH_CURRENT_SIGNING_KEY=your_qstash_current_key
QSTASH_NEXT_SIGNING_KEY=your_qstash_next_key

# Sentry (optional)
SENTRY_DSN=your_sentry_dsn
SENTRY_ENVIRONMENT=production
```

### 3. Service Configuration

#### Member Profile App
- **Type**: Web Service
- **Build Command**: `yarn install && yarn build:render`
- **Start Command**: `yarn start:render`
- **Health Check Path**: `/health`

#### API Service
- **Type**: Web Service
- **Build Command**: `yarn install && yarn build:api:render`
- **Start Command**: `yarn start:api:render`
- **Health Check Path**: `/health`

#### Cron Worker
- **Type**: Background Worker
- **Build Command**: `yarn install && yarn build:api:render`
- **Start Command**: `yarn start:cron:render`

### 4. Custom Domains (Optional)

1. In each service, go to "Settings" → "Custom Domains"
2. Add your domain (e.g., `app.yourdomain.com`)
3. Configure DNS records as instructed by Render

### 5. Environment-Specific Configuration

The `render.yaml` file automatically sets:
- `NODE_ENV=production`
- `SENTRY_ENVIRONMENT=production`

## Build Process

### Member Profile App
1. Installs dependencies with `yarn install`
2. Builds the Remix app with `yarn build:render`
3. Starts the production server with `yarn start:render`

### API Service
1. Installs dependencies with `yarn install`
2. Builds the TypeScript API with `yarn build:api:render`
3. Starts the Express server with `yarn start:api:render`

### Cron Worker
1. Installs dependencies with `yarn install`
2. Builds the TypeScript API with `yarn build:api:render`
3. Starts the cron job processor with `yarn start:cron:render`

## Health Checks

Both the Member Profile App and API Service have health check endpoints at `/health` that return:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Monitoring

- **Logs**: Available in the Render dashboard for each service
- **Metrics**: CPU, memory, and request metrics in the dashboard
- **Alerts**: Configure alerts for service failures

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check build logs for dependency issues
   - Ensure all environment variables are set
   - Verify Node.js version compatibility

2. **Runtime Errors**
   - Check application logs
   - Verify database and Redis connections
   - Ensure all required environment variables are present

3. **Health Check Failures**
   - Verify the `/health` route is accessible
   - Check if the service is starting correctly
   - Review startup logs for errors

### Debug Commands

```bash
# Check service status
curl https://your-service.onrender.com/health

# View build logs
# Available in Render dashboard

# Check environment variables
# Available in service settings
```

## Migration from Vercel

1. **Remove Vercel Configuration**
   - Delete `vercel.json`
   - Remove Vercel-specific scripts from `package.json`

2. **Update Build Commands**
   - Use `yarn build:render` instead of `yarn build:vercel`
   - Use `yarn start:render` instead of `yarn start:vercel`

3. **Environment Variables**
   - Copy environment variables from Vercel to Render
   - Update any Vercel-specific variables

## Cost Optimization

- **Starter Plan**: Suitable for development and small production workloads
- **Auto-scaling**: Services automatically scale based on traffic
- **Sleep Mode**: Free tier services sleep after 15 minutes of inactivity

## Security

- **Environment Variables**: Never commit sensitive data to the repository
- **HTTPS**: Automatically enabled for all Render services
- **Access Control**: Use Render's team and role management features

## Support

- **Documentation**: [Render Docs](https://render.com/docs)
- **Community**: [Render Community](https://community.render.com)
- **Status**: [Render Status Page](https://status.render.com)
