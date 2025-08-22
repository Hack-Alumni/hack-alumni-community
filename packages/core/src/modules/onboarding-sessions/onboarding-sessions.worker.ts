import { match } from 'ts-pattern';

import { registerWorker } from '@/infrastructure/bull';
import { onOnboardingSessionAttended } from './events/onboarding-session-attended';

export const onboardingSessionWorker = registerWorker(
  'onboarding_session',
  async (job) => {
    return match(job)
      .with({ name: 'onboarding_session.attended' }, ({ data }) => {
        return onOnboardingSessionAttended(data);
      })
      .otherwise(() => {
        throw new Error(`Unknown job type: ${job.name}`);
      });
  }
);
