import { match } from 'ts-pattern';

import { registerWorker } from '@/infrastructure/bull';
import { sendProfileViewsNotification } from './use-cases/send-profile-views-notification';

export const profileWorker = registerWorker('profile', async (job) => {
  return match(job)
    .with({ name: 'profile.views.notification.monthly' }, ({ data }) => {
      return sendProfileViewsNotification(data);
    })
    .otherwise(() => {
      throw new Error(`Unknown job type: ${job.name}`);
    });
});
