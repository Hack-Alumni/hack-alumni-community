# Vercel Deployment Guide

This guide explains how to deploy the Hack Alumni Community platform on Vercel as a single project.

## Overview

This project is a monorepo containing three main applications:
- **Member Profile** (`apps/member-profile`) - Main community platform
- **Admin Dashboard** (`apps/admin-dashboard`) - Administrative interface
- **API** (`apps/api`) - Backend API and background jobs

## Deployment Configuration

### 1. Vercel Configuration

The `vercel.json` file is configured to handle all three apps with proper routing:

- **Root routes** (`/`) → Member Profile app
- **Admin routes** (`/admin/*`) → Admin Dashboard app
- **API routes** (`/api/*`) → API server

### 2. Build Process

The build process is handled by the root `package.json` scripts:

```bash
yarn vercel-build  # Builds all apps
yarn build:api     # Builds the API specifically
```

### 3. Environment Variables

You'll need to set up the following environment variables in your Vercel project:

#### Redis Configuration (Upstash Redis Only)
- `UPSTASH_REDIS_REST_URL` - Upstash Redis REST API URL
- `UPSTASH_REDIS_REST_TOKEN` - Upstash Redis REST API token

**Upstash Redis Credentials (Free Tier):**
```
UPSTASH_REDIS_REST_URL=https://teaching-lamprey-6001.upstash.io
UPSTASH_REDIS_REST_TOKEN=ARdxAAIjcDEyNmE0OGM0ZDc2YjM0NTVjOWViMTY5MTE3YjQ4M2UyN3AxMA
```

#### Database
- `DATABASE_URL` - PostgreSQL connection string

#### Authentication
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- `GITHUB_CLIENT_ID` - GitHub OAuth client ID
- `GITHUB_CLIENT_SECRET` - GitHub OAuth client secret

#### External Services
- `SENTRY_DSN` - Sentry error tracking
- `MIXPANEL_TOKEN` - Mixpanel analytics
- `AWS_ACCESS_KEY_ID` - AWS S3 access
- `AWS_SECRET_ACCESS_KEY` - AWS S3 secret
- `AWS_REGION` - AWS region

#### Slack Integration
- `SLACK_BOT_TOKEN` - Slack bot token
- `SLACK_SIGNING_SECRET` - Slack signing secret

#### Email
- `SMTP_HOST` - SMTP server host
- `SMTP_USERNAME` - SMTP username
- `SMTP_PASSWORD` - SMTP password

## Deployment Steps

### 1. Connect to Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Link your project: `vercel link`

### 2. Set Environment Variables

Set all required environment variables in your Vercel project dashboard or via CLI:

```bash
# Redis Configuration (Upstash Redis Only)
vercel env add UPSTASH_REDIS_REST_URL "https://teaching-lamprey-6001.upstash.io"
vercel env add UPSTASH_REDIS_REST_TOKEN "ARdxAAIjcDEyNmE0OGM0ZDc2YjM0NTVjOWViMTY5MTE3YjQ4M2UyN3AxMA"

# Database
vercel env add DATABASE_URL

# Authentication
vercel env add GOOGLE_CLIENT_ID
vercel env add GOOGLE_CLIENT_SECRET
vercel env add GITHUB_CLIENT_ID
vercel env add GITHUB_CLIENT_SECRET

# External Services
vercel env add SENTRY_DSN
vercel env add MIXPANEL_TOKEN
vercel env add AWS_ACCESS_KEY_ID
vercel env add AWS_SECRET_ACCESS_KEY
vercel env add AWS_REGION

# Slack Integration
vercel env add SLACK_BOT_TOKEN
vercel env add SLACK_SIGNING_SECRET

# Email
vercel env add SMTP_HOST
vercel env add SMTP_USERNAME
vercel env add SMTP_PASSWORD
```

### 3. Deploy

```bash
vercel --prod
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

### Background Jobs

The API includes background job processing (BullMQ). Since we're using only Upstash Redis, which doesn't support BullMQ's requirements, background jobs are currently mocked. For production use, you may want to consider:

1. Using a separate traditional Redis instance for BullMQ
2. Using Vercel Cron Jobs for scheduled tasks
3. Using external job processing services
4. Implementing a custom job queue system

### File Uploads

For file uploads (resumes, profile pictures, etc.), the app uses AWS S3. Make sure your S3 bucket is properly configured and accessible.

### Redis Configuration

This project now uses **only Upstash Redis**:

- **Upstash Redis** (`UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`) - Used for all Redis operations including caching, session storage, and general Redis operations

**Note**: BullMQ background jobs are currently mocked since BullMQ requires traditional Redis. For full background job support, consider setting up a separate Redis instance for job processing.

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
4. Check external service configurations

## Support

For deployment issues, check:
- Vercel documentation: https://vercel.com/docs
- Vercel community: https://github.com/vercel/vercel/discussions
