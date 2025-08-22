import { match } from 'ts-pattern';

import { registerWorker } from '@/infrastructure/bull';
import { sendSMS } from '@/modules/notifications/twilio';
import { sendEphemeralSlackNotification } from '@/modules/notifications/use-cases/send-ephemeral-slack-notification';
import { sendEmail } from './use-cases/send-email';
import { sendSlackNotification } from './use-cases/send-slack-notification';

export const notificationWorker = registerWorker(
  'notification',
  async (job) => {
    return match(job)
      .with({ name: 'notification.email.send' }, async ({ data }) => {
        return sendEmail(data);
      })
      .with({ name: 'notification.slack.ephemeral.send' }, async ({ data }) => {
        return sendEphemeralSlackNotification(data);
      })
      .with({ name: 'notification.slack.send' }, async ({ data }) => {
        return sendSlackNotification(data);
      })
      .with({ name: 'notification.sms.send' }, ({ data }) => {
        return sendSMS(data);
      })
      .otherwise(() => {
        throw new Error(`Unknown job type: ${job.name}`);
      });
  }
);
