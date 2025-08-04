# QStash Setup & Monitoring Guide

## 🚀 Quick Setup

### 1. Create QStash Project

1. Go to [Upstash Console](https://console.upstash.com)
2. Create a new QStash database
3. Copy your token and signing keys

### 2. Add Environment Variables

```bash
# Add to your .env file
UPSTASH_QSTASH_TOKEN="your_qstash_token"
UPSTASH_QSTASH_CURRENT_SIGNING_KEY="your_signing_key"
UPSTASH_QSTASH_NEXT_SIGNING_KEY="your_next_signing_key"
```

### 3. Setup Schedules

```bash
# Update API_URL with your actual Vercel domain
# Edit .env file and change API_URL to your real domain
# Example: API_URL=https://your-project.vercel.app

# Setup QStash schedules
yarn qstash:setup
```

## 📋 What Gets Created

### Schedule 1: Every 5 Minutes Processing

- **Cron**: `*/5 * * * *`
- **Job**: `scheduled.job.process`
- **Purpose**: Processes scheduled jobs from the database
- **Endpoint**: `/api/jobs/process-immediate`

### Schedule 2: Daily Cleanup

- **Cron**: `0 2 * * *` (2 AM daily)
- **Job**: `cleanup.old.jobs`
- **Purpose**: Cleans up old completed jobs
- **Endpoint**: `/api/jobs/process-immediate`

## 🔍 Monitoring Your Schedules

### Method 1: Command Line

```bash
# List all schedules
curl -H "Authorization: Bearer $UPSTASH_QSTASH_TOKEN" https://qstash.upstash.io/v2/schedules | jq .

# Check specific schedule
curl -H "Authorization: Bearer $UPSTASH_QSTASH_TOKEN" https://qstash.upstash.io/v2/schedules/SCHEDULE_ID

# Check message history
curl -H "Authorization: Bearer $UPSTASH_QSTASH_TOKEN" https://qstash.upstash.io/v2/messages
```

### Method 2: Upstash Console (Recommended)

Visit: **https://console.upstash.com/qstash**

Features:

- ✅ View all schedules
- ✅ See execution history
- ✅ Check message status
- ✅ Pause/resume schedules
- ✅ View logs and errors
- ✅ Real-time monitoring

## 🔧 Troubleshooting

### Common Issues

1. **"Invalid token" error**
   - Check that `UPSTASH_QSTASH_TOKEN` is set correctly
   - Verify the token in your Upstash console

2. **Schedules not running**
   - Check that your API endpoint is accessible
   - Verify the webhook signature verification
   - Check your API logs for errors

3. **Jobs not being processed**
   - Ensure your database has scheduled jobs
   - Check that the job processing logic is working
   - Verify the API endpoint returns 200 status

### Debug Commands

```bash
# Test your API endpoint
curl -X POST https://your-api.vercel.app/api/jobs/process-immediate \
  -H "Content-Type: application/json" \
  -d '{"name":"test","data":{}}'

# Check QStash webhook signature
# (This is handled automatically by the API)
```

## 📊 Understanding the Response

When you list schedules, you'll see:

```json
{
  "scheduleId": "scd_5RLBWxdLydTNr99CiaTBCRb6UtrU",
  "cron": "* * * * *",
  "destination": "https://your-api.vercel.app/api/jobs/process-immediate",
  "lastScheduleTime": 1754288640041,
  "nextScheduleTime": 1754288700000,
  "lastScheduleStates": {
    "msg_26hZCxZCuWyyTWPmSVBrNB882AMa7DriCTjoV3p8QUWiQCnosbnAi2qjm5MEwr1": "IN_PROGRESS"
  },
  "isPaused": false
}
```

**Key fields:**

- `scheduleId`: Unique identifier for the schedule
- `cron`: The schedule pattern
- `destination`: Where the job is sent
- `lastScheduleTime`: When it last ran
- `nextScheduleTime`: When it will run next
- `lastScheduleStates`: Status of recent executions
- `isPaused`: Whether the schedule is paused

## 🔄 Updating Schedules

If you need to update your API URL:

1. **Delete old schedules** (via Upstash Console)
2. **Update your API_URL** in `.env`
3. **Re-run setup**:
   ```bash
   yarn qstash:setup
   ```

## 🎯 Best Practices

1. **Monitor regularly**: Check the Upstash Console weekly
2. **Set up alerts**: Configure notifications for failed jobs
3. **Test endpoints**: Verify your API endpoints work before setting up
   schedules
4. **Keep tokens secure**: Never commit tokens to version control
5. **Document changes**: Update this guide when making changes

## 📞 Support

- **Upstash Documentation**: https://docs.upstash.com/qstash
- **Upstash Console**: https://console.upstash.com/qstash
- **API Reference**: https://docs.upstash.com/qstash/api
