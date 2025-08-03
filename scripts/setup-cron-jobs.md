# Setting Up Cron Jobs in Supabase Dashboard

Your hybrid job queue system is now set up! Here's how to configure the cron
jobs in your Supabase dashboard.

## Step 1: Access Your Supabase Dashboard

1. Go to https://supabase.com/dashboard
2. Select your project: `vdukyaokyzpybioywfaz`

## Step 2: Navigate to Database Functions

1. In the left sidebar, click on **Database**
2. Click on **Functions**
3. Click on **Cron Jobs** tab

## Step 3: Create the First Cron Job (Process Jobs)

1. Click **Create a new cron job**
2. Fill in the details:

   - **Name**: `process-jobs`
   - **Schedule**: `*/1 * * * *` (every minute)
   - **Function**: `process-jobs`
   - **HTTP Method**: `POST`
   - **Headers**: Leave empty (default)
   - **Body**: Leave empty (default)

3. Click **Create**

## Step 4: Create the Second Cron Job (Cleanup Jobs)

1. Click **Create a new cron job** again
2. Fill in the details:

   - **Name**: `cleanup-jobs`
   - **Schedule**: `0 2 * * *` (daily at 2 AM)
   - **Function**: `cleanup-jobs`
   - **HTTP Method**: `POST`
   - **Headers**: Leave empty (default)
   - **Body**: Leave empty (default)

3. Click **Create**

## Step 5: Verify the Setup

1. Go to **Database** > **Tables** > **jobs**
2. You should see the jobs table with your test job
3. The cron jobs will automatically process pending jobs every minute
4. Old completed/failed jobs will be cleaned up daily at 2 AM

## Testing the System

You can test the system by:

1. **Adding a test job**:

   ```bash
   curl -X POST "https://vdukyaokyzpybioywfaz.supabase.co/rest/v1/jobs" \
     -H "apikey: YOUR_ANON_KEY" \
     -H "Authorization: Bearer YOUR_ANON_KEY" \
     -H "Content-Type: application/json" \
     -d '{
       "name": "test.job",
       "data": {"message": "Test job"},
       "queue_name": "test"
     }'
   ```

2. **Checking job statistics**:
   ```bash
   curl -X GET "https://vdukyaokyzpybioywfaz.supabase.co/rest/v1/rpc/get_job_stats" \
     -H "apikey: YOUR_ANON_KEY" \
     -H "Authorization: Bearer YOUR_ANON_KEY"
   ```

## Job Types

### Real-time Jobs (QStash)

These jobs are processed immediately:

- `slack.message.add`
- `notification.email.send`
- `slack.emoji.changed`
- `slack.reaction.added`
- `slack.reaction.removed`
- `slack.invite`
- `slack.deactivate`
- `slack.chatbot.message`
- `slack.message.answer`
- `slack.secured_the_bag.reminder`

### Scheduled Jobs (Supabase)

These jobs are stored and processed via cron:

- `student.birthdate.daily`
- `student.anniversary.email`
- `student.points.recurring`
- `student.engagement.backfill`
- `student.statuses.backfill`
- `student.statuses.new`
- `airtable.record.update.bulk`
- `feed.slack.recurring`
- `event.recent.sync`
- `event.sync`
- `opportunity.check_expired`
- `peer_help.finish_reminder`

## Monitoring

- **Jobs Table**: Monitor all jobs in the `jobs` table
- **Function Logs**: Check Edge Function logs in the Supabase dashboard
- **Cron Job Status**: Monitor cron job execution in the Functions section

## Troubleshooting

1. **Jobs not processing**: Check if cron jobs are enabled and running
2. **Function errors**: Check Edge Function logs in the dashboard
3. **Database issues**: Verify the jobs table exists and has the correct schema

## Your Project Details

- **Project URL**: https://vdukyaokyzpybioywfaz.supabase.co
- **Anon Key**:
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkdWt5YW9reXpweWJpb3l3ZmF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwMTcxOTksImV4cCI6MjA2OTU5MzE5OX0.NgVMxO5-F8oV6tBmCQAjugVpwa_L4VRmjBNOLruh8T4
- **Dashboard**: https://supabase.com/dashboard/project/vdukyaokyzpybioywfaz
