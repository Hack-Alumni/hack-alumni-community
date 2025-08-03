import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

import { BullJob } from './bull.types';
import { reportException } from './sentry';

// Environment Variables
const SUPABASE_URL = process.env.SUPABASE_URL as string;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY as string;

// Lazy Supabase client initialization
let supabase: any = null;

function getSupabaseClient() {
  if (!supabase) {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.warn('Supabase credentials not available');

      return null;
    }

    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }

  return supabase;
}

// Job processors registry (same as before)
const _jobProcessors: Record<string, any> = {};

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
 * Enqueues a job to be processed by Supabase Edge Functions
 */
export async function enqueueJob<JobName extends BullJob['name']>(
  name: JobName,
  data: any,
  options?: {
    priority?: number;
    maxAttempts?: number;
    delay?: number; // Delay in seconds
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

  // Calculate scheduled time if delay is provided
  const scheduledAt = options?.delay
    ? new Date(Date.now() + options.delay * 1000)
    : new Date();

  const supabaseClient = getSupabaseClient();

  if (!supabaseClient) {
    console.warn(`Skipping job ${job.name} - Supabase not available`);

    return;
  }

  const { error } = await supabaseClient.from('jobs').insert({
    name: job.name,
    data: job.data,
    queue_name: queueName,
    priority: options?.priority || 0,
    max_attempts: options?.maxAttempts || 3,
    scheduled_at: scheduledAt,
  });

  if (error) {
    console.error('Failed to enqueue job:', error);
    reportException(error);
    throw new Error(`Failed to enqueue job: ${error.message}`);
  }

  console.log(`Job ${job.name} enqueued to queue ${queueName}`);
}

/**
 * Triggers job processing via Supabase Edge Function
 */
export async function triggerJobProcessing() {
  try {
    // Call the Supabase Edge Function to process jobs
    const response = await fetch(`${SUPABASE_URL}/functions/v1/process-jobs`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to trigger job processing: ${response.statusText}`
      );
    }

    const result = await response.json();

    console.log('Job processing triggered:', result);

    return result;
  } catch (error) {
    console.error('Failed to trigger job processing:', error);
    reportException(error);
    throw error;
  }
}

/**
 * Triggers job cleanup via Supabase Edge Function
 */
export async function triggerJobCleanup() {
  try {
    // Call the Supabase Edge Function to cleanup old jobs
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
 * Registers a job processor for a queue (for compatibility)
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
  const supabaseClient = getSupabaseClient();

  if (!supabaseClient) {
    console.warn('Cannot list jobs - Supabase not available');

    return [];
  }

  let query = supabaseClient.from('jobs').select('*');

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
 * Cleans up old completed/failed jobs
 */
export async function cleanupOldJobs(daysToKeep: number = 7) {
  const cutoffDate = new Date();

  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

  const supabaseClient = getSupabaseClient();

  if (!supabaseClient) {
    console.warn('Cannot cleanup jobs - Supabase not available');

    return;
  }

  const { error } = await supabaseClient
    .from('jobs')
    .delete()
    .in('status', ['completed', 'failed'])
    .lt('created_at', cutoffDate.toISOString());

  if (error) {
    console.error('Failed to cleanup old jobs:', error);
  }
}

// Legacy function for compatibility
export async function processNextJob() {
  return triggerJobProcessing();
}
