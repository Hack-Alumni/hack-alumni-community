#!/usr/bin/env node

import { config } from 'dotenv';
import { Client as QStashClient } from '@upstash/qstash';

// Load environment variables from .env file
config();

// Environment variables
const UPSTASH_QSTASH_TOKEN = process.env.UPSTASH_QSTASH_TOKEN;
const API_URL = process.env.API_URL;

if (!UPSTASH_QSTASH_TOKEN) {
  console.error('❌ UPSTASH_QSTASH_TOKEN is required');
  console.error('💡 Set it in your .env file or export it in your terminal');
  process.exit(1);
}

if (!API_URL) {
  console.error('❌ API_URL is required');
  console.error('💡 Set it in your .env file or export it in your terminal');
  process.exit(1);
}

const qstash = new QStashClient({
  token: UPSTASH_QSTASH_TOKEN,
});

async function setupQStashSchedules() {
  console.log('🚀 Setting up QStash schedules...');

  try {
    // 1. Scheduled Job Processing (every 5 minutes)
    console.log(
      '📅 Creating scheduled job processing schedule (every 5 minutes)...'
    );
    await qstash.schedules.create({
      destination: `${API_URL}/api/jobs/process-immediate`,
      cron: '*/5 * * * *', // Every 5 minutes
      body: JSON.stringify({
        name: 'scheduled.job.process',
        data: { action: 'process_scheduled_jobs' },
      }),
    });
    console.log('✅ Scheduled job processing schedule created');

    // 2. Cleanup Old Jobs (daily at 2 AM)
    console.log('🧹 Creating cleanup old jobs schedule (daily at 2 AM)...');
    await qstash.schedules.create({
      destination: `${API_URL}/api/jobs/process-immediate`,
      cron: '0 2 * * *', // Daily at 2 AM
      body: JSON.stringify({
        name: 'cleanup.old.jobs',
        data: { action: 'cleanup_old_jobs' },
      }),
    });
    console.log('✅ Cleanup old jobs schedule created');

    console.log('🎉 All QStash schedules created successfully!');
    console.log('');
    console.log('📋 Summary:');
    console.log('  • Scheduled job processing: Every 5 minutes');
    console.log('  • Cleanup old jobs: Daily at 2 AM');
    console.log('');
    console.log(
      '🔗 You can view your schedules at: https://console.upstash.com/qstash'
    );
  } catch (error) {
    console.error('❌ Failed to create QStash schedules:', error);
    process.exit(1);
  }
}

setupQStashSchedules();
