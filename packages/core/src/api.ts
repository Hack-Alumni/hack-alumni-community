import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);
import type { BullJob, GetBullJobData } from './infrastructure/bull.types';
import {
  enqueueJob,
  registerJobProcessor,
} from './infrastructure/hybrid-job-queue';
import { airtableWorker } from './modules/airtable';
import { applicationWorker } from './modules/applications/applications';
import { oneTimeCodeWorker } from './modules/authentication/one-time-code.worker';
import { offerWorker } from './modules/compensation/offers';
import { eventWorker } from './modules/events/events';
import { feedWorker } from './modules/feed';
import { gamificationWorker } from './modules/gamification/gamification';
import { mailchimpWorker } from './modules/mailchimp';
import { memberEmailWorker } from './modules/members/member-emails.worker';
import { memberWorker } from './modules/members/members.worker';
import { profileWorker } from './modules/members/profile.worker';
import { notificationWorker } from './modules/notifications/notifications.worker';
import { onboardingSessionWorker } from './modules/onboarding-sessions/onboarding-sessions.worker';
import { opportunityWorker } from './modules/opportunities';
import { peerHelpWorker } from './modules/peer-help';
import { resumeReviewWorker } from './modules/resume-reviews';
import { slackWorker } from './modules/slack/slack.worker';

// Start all hybrid job processors
export function startHybridJobProcessors() {
  console.log('Starting hybrid job processors...');

  // Register all available job processors
  const processors = [
    { name: 'airtable', worker: airtableWorker },
    { name: 'application', worker: applicationWorker },
    { name: 'one_time_code', worker: oneTimeCodeWorker },
    { name: 'offer', worker: offerWorker },
    { name: 'event', worker: eventWorker },
    { name: 'feed', worker: feedWorker },
    { name: 'gamification', worker: gamificationWorker },
    { name: 'mailchimp', worker: mailchimpWorker },
    { name: 'member_email', worker: memberEmailWorker },
    { name: 'student', worker: memberWorker },
    { name: 'profile', worker: profileWorker },
    { name: 'notification', worker: notificationWorker },
    { name: 'onboarding_session', worker: onboardingSessionWorker },
    { name: 'opportunity', worker: opportunityWorker },
    { name: 'peer_help', worker: peerHelpWorker },
    { name: 'resume_review', worker: resumeReviewWorker },
    { name: 'slack', worker: slackWorker },
  ];

  processors.forEach(({ name, worker }) => {
    if (worker && typeof worker.process === 'function') {
      try {
        registerJobProcessor(name, worker.process);
        console.log(`Registered job processor: ${name}`);
      } catch (error) {
        console.error(`Failed to register job processor: ${name}`, error);
      }
    }
  });

  console.log('All hybrid job processors registered successfully! 🚀');
}

// Replace the mock job function with hybrid job enqueuing
export function job<JobName extends BullJob['name']>(
  name: JobName,
  data: GetBullJobData<JobName>,
  options?: {
    priority?: number;
    maxAttempts?: number;
    delay?: number; // Delay in seconds
    forceScheduled?: boolean; // Force using Supabase even for real-time jobs
  }
): void {
  enqueueJob(name, data, options).catch((error) => {
    console.error(`Failed to enqueue job ${name}:`, error);
  });
}

export enum Environment {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
}

// Mock exports for other modules
export const OAuthCodeState = {
  // Mock OAuth state
} as any;

export function loginWithOAuth(params: any) {
  console.log('Mock loginWithOAuth called', params);

  return Promise.resolve({
    authToken: 'mock-token',
    email: 'mock@example.com',
  });
}

export function saveGoogleDriveCredentials(code: string) {
  console.log('Mock saveGoogleDriveCredentials called', code);

  return Promise.resolve();
}
