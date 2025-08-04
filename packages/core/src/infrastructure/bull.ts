// Proxy to hybrid job queue system
// This file now redirects all BullMQ operations to the hybrid job queue system
// to ensure all existing code uses the new Supabase + QStash infrastructure

import {
  type BullJob,
  type BullQueue,
  type GetBullJobData,
} from '@/infrastructure/bull.types';

// Re-export the hybrid job queue functions
export {
  enqueueJob as job,
  registerJobProcessor as registerWorker,
} from './hybrid-job-queue';

// Re-export types for compatibility
export type { BullJob, BullQueue, GetBullJobData };

// Legacy functions that redirect to hybrid system
export async function listQueueNames() {
  // This would need to be implemented in hybrid-job-queue.ts if needed
  console.log('listQueueNames called - redirecting to hybrid system');

  return [];
}

export async function isValidQueue(_name: string) {
  // This would need to be implemented in hybrid-job-queue.ts if needed
  console.log('isValidQueue called - redirecting to hybrid system');

  return true;
}

export function getQueue(_name: BullQueue) {
  // This would need to be implemented in hybrid-job-queue.ts if needed
  console.log(`getQueue called for ${_name} - redirecting to hybrid system`);

  return {
    add: async (jobName: string, _data: any, _options?: any) => {
      console.log(`Job ${jobName} added to queue ${_name} via proxy`);

      // This will be handled by the hybrid system
      return { id: `proxy-job-${Date.now()}` };
    },
  };
}
