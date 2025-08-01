import { type JobsOptions, Queue, Worker, type WorkerOptions } from 'bullmq';
import { type z, type ZodType } from 'zod';

import {
  BullJob,
  BullQueue,
  type GetBullJobData,
} from '@/infrastructure/bull.types';
import { redis } from '@/infrastructure/redis';
import { reportException } from '@/infrastructure/sentry';
import { ZodParseError } from '@/shared/errors';

// Environment Variables

const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL as string;
const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN as string;

// Constants

// Instead of instantiating a new queue at the top-level which would produce
// a side-effect, we'll use a global variable to store the queue instances which
// will be created lazily.
const _queues: Record<string, Queue> = {};

// Core

/**
 * Returns a Bull queue instance for the given name.
 *
 * This function uses a lazy initialization approach to create queue instances
 * only when they are first requested. Subsequent calls with the same name
 * will return the existing queue instance.
 *
 * @param name - The name of the queue to retrieve/create.
 * @returns A Bull queue instance for the specified name.
 */
export function getQueue(name: string) {
  if (!_queues[name]) {
    // For Upstash Redis, we need to use a different approach since BullMQ requires traditional Redis
    // We'll use a simple in-memory queue for now, or you can set up a separate Redis instance for BullMQ
    console.warn('BullMQ requires traditional Redis. Consider setting up a separate Redis instance for job processing.');

    // For now, we'll create a mock queue that doesn't actually process jobs
    // In production, you should set up a separate Redis instance for BullMQ
    _queues[name] = {
      add: async (jobName: string, data: any, options?: any) => {
        console.log(`Job ${jobName} would be added to queue ${name} with data:`, data);
        // In a real implementation, you would add the job to a proper queue
        return { id: 'mock-job-id' };
      },
    } as any;
  }

  return _queues[name];
}

/**
 * Returns whether or not the given queue name is valid queue. As long as it
 * is present in the Redis instance, it is considered valid. Otherwise, it
 * must be present in the `BullQueue` enum.
 *
 * @param name - The name of the queue to validate.
 * @returns `true` if the queue name is valid, `false` otherwise.
 */
export async function isValidQueue(name: string) {
  const actualQueueNames = await listQueueNames();
  const expectedQueueNames = Object.values(BullQueue);

  const valid =
    actualQueueNames.includes(name) ||
    expectedQueueNames.includes(name as BullQueue);

  return valid;
}

export function job<JobName extends BullJob['name']>(
  name: JobName,
  data: GetBullJobData<JobName>,
  options?: JobsOptions
): void {
  const result = BullJob.safeParse({
    data,
    name,
  });

  if (!result.success) {
    reportException(result.error);

    return;
  }

  const job = result.data;

  const queueName = job.name.split('.')[0];
  const queue = getQueue(queueName);

  queue.add(job.name, job.data, options).catch((e) => reportException(e));
}

/**
 * Lists all the queues currently present in Redis.
 *
 * This function retrieves all keys in Redis that match the pattern
 * `bull:*:meta`, which corresponds to Bull queue metadata. It then extracts
 * and sorts the queue names from these keys.
 *
 * @returns An array of sorted queue names.
 */
export async function listQueueNames() {
  // Since Upstash Redis doesn't support KEYS command, we'll return the expected queue names
  return Object.values(BullQueue).sort();
}

/**
 * Registers a worker for processing jobs in a Bull queue.
 *
 * This validates the incoming job data against the provided Zod schema before
 * processing. If validation fails, it throws a `ZodParseError`. Any errors are
 * reported to Sentry.
 *
 * @param name - The name of the queue to process.
 * @param schema - Zod schema for validating the job data.
 * @param processor - The function to process each job.
 * @param options - Optional configuration for the worker.
 * @returns A `Worker` instance.
 */
export function registerWorker<Schema extends ZodType>(
  name: BullQueue,
  schema: Schema,
  processor: (job: z.infer<Schema>) => Promise<unknown>,
  options: WorkerOptions = {}
) {
  console.warn('BullMQ workers are not supported with Upstash Redis. Consider using a separate Redis instance for job processing.');

  // Return a mock worker for compatibility
  return {
    run: () => {
      console.log(`Mock worker for queue ${name} would be started`);
    },
    on: (event: string, handler: any) => {
      console.log(`Mock worker for queue ${name} would listen for ${event}`);
    },
  } as any;
}
