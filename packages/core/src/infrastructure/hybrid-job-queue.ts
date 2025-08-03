import { createClient } from '@supabase/supabase-js';
import { Client as QStashClient } from '@upstash/qstash';
import { z } from 'zod';

import { BullJob } from './bull.types';
import { reportException } from './sentry';

// Environment Variables
const SUPABASE_URL = process.env.SUPABASE_URL as string;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY as string;
const UPSTASH_QSTASH_TOKEN = process.env.UPSTASH_QSTASH_TOKEN as string;
const UPSTASH_QSTASH_CURRENT_SIGNING_KEY = process.env
  .UPSTASH_QSTASH_CURRENT_SIGNING_KEY as string;
const UPSTASH_QSTASH_NEXT_SIGNING_KEY = process.env
  .UPSTASH_QSTASH_NEXT_SIGNING_KEY as string;

// Lazy client initialization
let supabase: any = null;
let qstash: any = null;

function getSupabaseClient() {
  if (!supabase) {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.warn(
        'Supabase credentials not available, skipping scheduled jobs'
      );

      return null;
    }

    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }

  return supabase;
}

function getQStashClient() {
  if (!qstash) {
    if (!UPSTASH_QSTASH_TOKEN) {
      console.warn('QStash token not available, skipping real-time jobs');

      return null;
    }

    qstash = new QStashClient({
      token: UPSTASH_QSTASH_TOKEN,
    });
  }

  return qstash;
}

// Job processors registry
const _jobProcessors: Record<string, any> = {};

// Job types that should be processed immediately via QStash
const REAL_TIME_JOBS = [
  'slack.message.add',
  'slack.message.change',
  'slack.message.delete',
  'notification.email.send',
  'notification.slack.send',
  'notification.sms.send',
  'slack.emoji.changed',
  'slack.reaction.added',
  'slack.reaction.removed',
  'slack.invite',
  'slack.deactivate',
  'slack.chatbot.message',
  'slack.message.answer',
  'slack.secured_the_bag.reminder',
];

// Job types that should be scheduled via Supabase
const SCHEDULED_JOBS = [
  'student.birthdate.daily',
  'student.anniversary.email',
  'student.points.recurring',
  'student.engagement.backfill',
  'student.statuses.backfill',
  'student.statuses.new',
  'airtable.record.update.bulk',
  'feed.slack.recurring',
  'event.recent.sync',
  'event.sync',
  'opportunity.check_expired',
  'peer_help.finish_reminder',
];

// Helper function to map job name to queue name
function getQueueNameFromJobName(jobName: string): string {
  const queueName = jobName.split('.')[0];

  // Map job prefixes to queue names
  const queueMap: Record<string, string> = {
    student: 'student',
    member_email: 'member_email',
    onboarding_session: 'onboarding_session',
    one_time_code: 'one_time_code',
    resume_review: 'resume_review',
    peer_help: 'peer_help',
    airtable: 'airtable',
    application: 'application',
    event: 'event',
    feed: 'feed',
    gamification: 'gamification',
    mailchimp: 'mailchimp',
    notification: 'notification',
    offer: 'offer',
    opportunity: 'opportunity',
    profile: 'profile',
    slack: 'slack',
  };

  const mappedQueue = queueMap[queueName];

  if (!mappedQueue) {
    throw new Error(`Unknown queue name: ${queueName} for job: ${jobName}`);
  }

  return mappedQueue;
}

/**
 * Determines if a job should be processed immediately (QStash) or scheduled (Supabase)
 */
function isRealTimeJob(jobName: string): boolean {
  return REAL_TIME_JOBS.includes(jobName);
}

/**
 * Enqueues a job using the appropriate system based on job type
 */
export async function enqueueJob<JobName extends BullJob['name']>(
  name: JobName,
  data: any,
  options?: {
    priority?: number;
    maxAttempts?: number;
    delay?: number; // Delay in seconds
    forceScheduled?: boolean; // Force using Supabase even for real-time jobs
  }
) {
  const result = BullJob.safeParse({
    data,
    name,
  });

  if (!result.success) {
    reportException(result.error);

    return;
  }

  const job = result.data;
  const queueName = getQueueNameFromJobName(job.name);

  // Determine which system to use
  const useRealTime = !options?.forceScheduled && isRealTimeJob(job.name);

  if (useRealTime) {
    // Use QStash for real-time processing
    return await enqueueRealTimeJob(job, options);
  } else {
    // Use Supabase for scheduled processing
    return await enqueueScheduledJob(job, queueName, options);
  }
}

/**
 * Enqueues a job for immediate processing via QStash
 */
async function enqueueRealTimeJob(job: any, options?: any) {
  const qstashClient = getQStashClient();

  if (!qstashClient) {
    console.warn(`Skipping real-time job ${job.name} - QStash not available`);

    return;
  }

  try {
    const qstashOptions: any = {
      url: `${process.env.API_URL}/api/jobs/process-immediate`,
      body: {
        name: job.name,
        data: job.data,
      },
    };

    // Add delay if specified
    if (options?.delay) {
      qstashOptions.notBefore = new Date(Date.now() + options.delay * 1000);
    }

    const result = await qstashClient.publishJSON(qstashOptions);

    console.log(
      `Real-time job ${job.name} enqueued via QStash:`,
      result.messageId
    );

    return result;
  } catch (error) {
    console.error('Failed to enqueue real-time job:', error);
    reportException(error);
    throw error;
  }
}

/**
 * Enqueues a job for scheduled processing via Supabase
 */
async function enqueueScheduledJob(job: any, queueName: string, options?: any) {
  const supabaseClient = getSupabaseClient();

  if (!supabaseClient) {
    console.warn(`Skipping scheduled job ${job.name} - Supabase not available`);

    return;
  }

  // Calculate scheduled time if delay is provided
  const scheduledAt = options?.delay
    ? new Date(Date.now() + options.delay * 1000)
    : new Date();

  const { error } = await supabaseClient.from('jobs').insert({
    name: job.name,
    data: job.data,
    queue_name: queueName,
    priority: options?.priority || 0,
    max_attempts: options?.maxAttempts || 3,
    scheduled_at: scheduledAt,
  });

  if (error) {
    console.error('Failed to enqueue scheduled job:', error);
    reportException(error);
    throw new Error(`Failed to enqueue scheduled job: ${error.message}`);
  }

  console.log(`Scheduled job ${job.name} enqueued via Supabase`);
}

/**
 * Processes immediate jobs (called by QStash webhook)
 */
export async function processImmediateJob(jobData: {
  name: string;
  data: any;
}) {
  const { name, data } = jobData;
  const queueName = getQueueNameFromJobName(name);

  try {
    // Get the processor for this queue
    const processor = _jobProcessors[queueName];

    if (!processor) {
      throw new Error(`No processor found for queue: ${queueName}`);
    }

    // Process the job
    const result = await processor({ name, data });

    console.log(`Immediate job ${name} processed successfully`);

    return result;
  } catch (error) {
    console.error(`Immediate job ${name} failed:`, error);
    reportException(error);
    throw error;
  }
}

/**
 * Triggers scheduled job processing via Supabase Edge Function
 */
export async function triggerScheduledJobProcessing() {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/process-jobs`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to trigger scheduled job processing: ${response.statusText}`
      );
    }

    const result = await response.json();

    console.log('Scheduled job processing triggered:', result);

    return result;
  } catch (error) {
    console.error('Failed to trigger scheduled job processing:', error);
    reportException(error);
    throw error;
  }
}

/**
 * Triggers job cleanup via Supabase Edge Function
 */
export async function triggerJobCleanup() {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/cleanup-jobs`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to trigger job cleanup: ${response.statusText}`);
    }

    const result = await response.json();

    console.log('Job cleanup triggered:', result);

    return result;
  } catch (error) {
    console.error('Failed to trigger job cleanup:', error);
    reportException(error);
    throw error;
  }
}

/**
 * Registers a job processor for a queue
 */
export function registerJobProcessor(
  queueName: string,
  processor: (job: { name: string; data: any }) => Promise<unknown>
) {
  console.log(`Registering job processor for queue: ${queueName}`);
  _jobProcessors[queueName] = processor;
}

/**
 * Lists all jobs with optional filters
 */
export async function listJobs(options?: {
  status?: 'pending' | 'processing' | 'completed' | 'failed';
  queueName?: string;
  limit?: number;
}) {
  let query = supabase.from('jobs').select('*');

  if (options?.status) {
    query = query.eq('status', options.status);
  }

  if (options?.queueName) {
    query = query.eq('queue_name', options.queueName);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to list jobs: ${error.message}`);
  }

  return data;
}

/**
 * Gets job statistics
 */
export async function getJobStats() {
  const { data, error } = await supabase.rpc('get_job_stats');

  if (error) {
    throw new Error(`Failed to get job stats: ${error.message}`);
  }

  return data;
}

// Legacy functions for compatibility
export async function processNextJob() {
  return triggerScheduledJobProcessing();
}

export async function cleanupOldJobs(daysToKeep: number = 7) {
  const cutoffDate = new Date();

  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

  const { error } = await supabase
    .from('jobs')
    .delete()
    .in('status', ['completed', 'failed'])
    .lt('created_at', cutoffDate.toISOString());

  if (error) {
    console.error('Failed to cleanup old jobs:', error);
  }
}
