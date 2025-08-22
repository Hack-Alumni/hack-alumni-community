import { match } from 'ts-pattern';

import { registerWorker } from '@/infrastructure/bull';
import { onEmailAdded } from './events/member-email-added';
import { onPrimaryEmailChanged } from './events/member-primary-email-changed';

export const memberEmailWorker = registerWorker('member_email', async (job) => {
  return match(job)
    .with({ name: 'member_email.added' }, ({ data }) => {
      return onEmailAdded(data);
    })
    .with({ name: 'member_email.primary.changed' }, ({ data }) => {
      return onPrimaryEmailChanged(data);
    })
    .otherwise(() => {
      throw new Error(`Unknown job type: ${job.name}`);
    });
});
