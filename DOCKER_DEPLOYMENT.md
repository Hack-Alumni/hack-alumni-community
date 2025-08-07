# Docker Deployment Guide

This guide will help you deploy the Hack Alumni Community monorepo using Docker on Render.

## 🐳 Docker Setup

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed locally
- [Docker Compose](https://docs.docker.com/compose/install/) installed locally
- [Render account](https://render.com) for deployment

### Local Development with Docker

#### 1. Build the Docker Image

```bash
# Build the base image
yarn docker:build

# Or use the script directly
./scripts/docker-build.sh
```

#### 2. Run Services Locally

```bash
# Run all services
yarn docker:up

# Run specific service
yarn docker:up api
yarn docker:up admin-dashboard
yarn docker:up member-profile

# Run in detached mode
docker-compose up -d
```

#### 3. View Logs

```bash
# View all logs
yarn docker:logs

# View specific service logs
docker-compose logs -f api
docker-compose logs -f admin-dashboard
docker-compose logs -f member-profile
```

#### 4. Stop Services

```bash
# Stop all services
yarn docker:down

# Clean up (removes volumes)
yarn docker:clean
```

## 🚀 Render Deployment with Docker

### Option 1: Using render.yaml (Recommended)

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "feat: add Docker support"
   git push origin feature/jv-setup-render-instead-of-vercel-monorepo
   ```

2. **Deploy to Render**:
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect the `render.yaml` file with Docker configuration

3. **Configure Environment Variables**:
   - Go to each service's "Environment" tab
   - Add the required environment variables (see `render-env.example`)

### Option 2: Manual Docker Service Creation

1. **Create API Service**:
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `hack-alumni-api`
     - **Environment**: `Docker`
     - **Dockerfile Path**: `./Dockerfile`
     - **Docker Context**: `.`
     - **Docker Command**: `yarn workspace @hackcommunity/api start`
     - **Root Directory**: `.` (root)

2. **Create Admin Dashboard Service**:
   - Repeat the process for admin dashboard
   - Configure:
     - **Name**: `hack-alumni-admin-dashboard`
     - **Environment**: `Docker`
     - **Dockerfile Path**: `./Dockerfile`
     - **Docker Context**: `.`
     - **Docker Command**: `yarn workspace @hackcommunity/admin-dashboard start`
     - **Root Directory**: `.` (root)

3. **Create Member Profile Service**:
   - Repeat the process for member profile
   - Configure:
     - **Name**: `hack-alumni-member-profile`
     - **Environment**: `Docker`
     - **Dockerfile Path**: `./Dockerfile`
     - **Docker Context**: `.`
     - **Docker Command**: `yarn workspace @hackcommunity/member-profile start`
     - **Root Directory**: `.` (root)

## 🔧 Docker Configuration Details

### Dockerfile Structure

The `Dockerfile` uses a multi-stage build approach:

1. **Base Stage**: Uses Node.js 20 Alpine
2. **Dependencies Stage**: Installs all dependencies
3. **Builder Stage**: Builds all packages and applications
4. **Runner Stage**: Production-ready image with built applications

### Docker Compose

The `docker-compose.yml` file defines:

- **API Service**: Runs on port 3000
- **Admin Dashboard**: Runs on port 3001
- **Member Profile**: Runs on port 3002
- **Network**: All services communicate via `hack-alumni-network`

### Environment Variables

Each service requires specific environment variables:

#### API Service
```
NODE_ENV=production
PORT=3000
DATABASE_URL=your-supabase-connection-string
JWT_SECRET=your-jwt-secret
SENTRY_DSN=your-sentry-dsn
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-s3-bucket
POSTMARK_API_TOKEN=your-postmark-token
SLACK_BOT_TOKEN=your-slack-bot-token
SLACK_SIGNING_SECRET=your-slack-signing-secret
SLACK_APP_TOKEN=your-slack-app-token
QSTASH_TOKEN=your-qstash-token
QSTASH_CURRENT_SIGNING_KEY=your-qstash-current-key
QSTASH_NEXT_SIGNING_KEY=your-qstash-next-key
REDIS_URL=your-redis-url
ENVIRONMENT=production
```

#### Admin Dashboard Service
```
NODE_ENV=production
PORT=3001
DATABASE_URL=your-supabase-connection-string
JWT_SECRET=your-jwt-secret
SENTRY_DSN=your-sentry-dsn
ENVIRONMENT=production
API_BASE_URL=https://hack-alumni-api.onrender.com
```

#### Member Profile Service
```
NODE_ENV=production
PORT=3002
DATABASE_URL=your-supabase-connection-string
JWT_SECRET=your-jwt-secret
SENTRY_DSN=your-sentry-dsn
ENVIRONMENT=production
API_BASE_URL=https://hack-alumni-api.onrender.com
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-s3-bucket
```

## 🐛 Troubleshooting

### Common Issues

1. **Build Failures**:
   ```bash
   # Check Docker logs
   docker-compose logs -f
   
   # Rebuild without cache
   docker-compose build --no-cache
   ```

2. **Port Conflicts**:
   - Ensure ports 3000, 3001, 3002 are available
   - Check if other services are using these ports

3. **Environment Variables**:
   - Verify all required environment variables are set
   - Check for typos in variable names

4. **Docker Permissions**:
   ```bash
   # Fix Docker permissions (Linux)
   sudo usermod -aG docker $USER
   ```

### Performance Optimization

1. **Multi-stage Builds**: The Dockerfile uses multi-stage builds to reduce image size
2. **Layer Caching**: Dependencies are installed in a separate layer for better caching
3. **Alpine Linux**: Uses lightweight Alpine Linux base image
4. **Non-root User**: Runs as non-root user for security

## 📊 Monitoring

### Local Monitoring

```bash
# View resource usage
docker stats

# View running containers
docker ps

# View container details
docker inspect <container-id>
```

### Render Monitoring

- View logs in Render dashboard for each service
- Monitor resource usage and performance
- Set up alerts for service failures

## 🔄 Continuous Deployment

### Automatic Deploys

- Render automatically deploys when you push to the main branch
- Docker images are rebuilt on each deployment
- Environment variables are preserved across deployments

### Manual Deploys

- Trigger manual deploys from Render dashboard
- Useful for testing or rolling back changes

## ✅ Success Checklist

- [ ] Docker installed and running locally
- [ ] Docker image builds successfully
- [ ] Services run locally with Docker Compose
- [ ] Code pushed to GitHub
- [ ] Render services created with Docker configuration
- [ ] Environment variables configured
- [ ] Services deployed successfully
- [ ] Services are accessible via URLs
- [ ] Basic functionality tested
- [ ] Monitoring set up

## 🎯 Next Steps

1. **Test locally**: Run `yarn docker:build` and `yarn docker:up`
2. **Deploy to Render**: Use the render.yaml or manual service creation
3. **Configure environment variables**: Set up all required variables
4. **Monitor deployment**: Check logs and performance
5. **Test functionality**: Verify all services work correctly

Your monorepo is now ready for Docker deployment on Render! 🚀🐳 