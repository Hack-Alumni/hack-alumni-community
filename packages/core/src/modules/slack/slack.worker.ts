import { match } from 'ts-pattern';

import { registerJobProcessor } from '@/infrastructure/hybrid-job-queue';
import { addSlackMessage } from './use-cases/add-slack-message';
// import { answerChatbotQuestion } from './use-cases/answer-chatbot-question';
// import { answerPublicQuestion } from './use-cases/answer-public-question';
import { archiveSlackChannel } from './use-cases/archive-slack-channel';
import { changeSlackMessage } from './use-cases/change-slack-message';
import { createSlackChannel } from './use-cases/create-slack-channel';
import { deactivateSlackUser } from './use-cases/deactivate-slack-user';
import { deleteSlackChannel } from './use-cases/delete-slack-channel';
import { inviteToSlackWorkspace } from './use-cases/invite-to-slack-workspace';
// import { onSlackEmojiAdded } from './use-cases/on-slack-emoji-added';
// import { onSlackUserInvited } from './use-cases/on-slack-user-invited';
// import { onSlackWorkspaceJoined } from './use-cases/on-slack-workspace-joined';
import { renameSlackChannel } from './use-cases/rename-slack-channel';
import { sendSecuredTheBagReminder } from './use-cases/send-secured-the-bag-reminder';
import { unarchiveSlackChannel } from './use-cases/unarchive-slack-channel';
import { updateBirthdatesFromSlack } from './use-cases/update-birthdates-from-slack';

// Register the slack job processor
registerJobProcessor('slack', async (job) => {
  return (
    match(job)
      .with({ name: 'slack.birthdates.update' }, async () => {
        return updateBirthdatesFromSlack();
      })
      .with({ name: 'slack.channel.archive' }, async ({ data }) => {
        return archiveSlackChannel(data);
      })
      .with({ name: 'slack.channel.create' }, async ({ data }) => {
        return createSlackChannel(data);
      })
      .with({ name: 'slack.channel.delete' }, async ({ data }) => {
        return deleteSlackChannel(data);
      })
      .with({ name: 'slack.channel.rename' }, async ({ data }) => {
        return renameSlackChannel(data);
      })
      .with({ name: 'slack.channel.unarchive' }, async ({ data }) => {
        return unarchiveSlackChannel(data);
      })
      // .with({ name: 'slack.chatbot.message' }, async ({ data }) => {
      //   return answerChatbotQuestion(data);
      // })
      .with({ name: 'slack.deactivate' }, async ({ data }) => {
        return deactivateSlackUser(data);
      })
      // .with({ name: 'slack.emoji.changed' }, async ({ data }) => {
      //   if (data.subtype === 'add') {
      //     return onSlackEmojiAdded(data);
      //   }
      // })
      .with({ name: 'slack.invite' }, async ({ data }) => {
        return inviteToSlackWorkspace(data);
      })
      // .with({ name: 'slack.invited' }, async ({ data }) => {
      //   return onSlackUserInvited(data);
      // })
      // .with({ name: 'slack.joined' }, async ({ data }) => {
      //   return onSlackWorkspaceJoined(data);
      // })
      .with({ name: 'slack.message.add' }, async ({ data }) => {
        return addSlackMessage(data);
      })
      // .with({ name: 'slack.message.answer' }, async ({ data }) => {
      //   const result = await answerPublicQuestion(data);

      //   if (!result.ok) {
      //     throw new Error(result.error);
      //   }

      //   return result.data;
      // })
      .with({ name: 'slack.message.change' }, async ({ data }) => {
        return changeSlackMessage(data);
      })
      .with({ name: 'slack.secured_the_bag.reminder' }, async ({ data }) => {
        return sendSecuredTheBagReminder(data);
      })
      .otherwise(() => {
        throw new Error(`Unknown job type: ${job.name}`);
      })
  );
});

// Export for compatibility
export const slackWorker = {
  process: async (job: { name: string; data: any }) => {
    return (
      match(job)
        .with({ name: 'slack.birthdates.update' }, async () => {
          return updateBirthdatesFromSlack();
        })
        .with({ name: 'slack.channel.archive' }, async ({ data }) => {
          return archiveSlackChannel(data);
        })
        .with({ name: 'slack.channel.create' }, async ({ data }) => {
          return createSlackChannel(data);
        })
        .with({ name: 'slack.channel.delete' }, async ({ data }) => {
          return deleteSlackChannel(data);
        })
        .with({ name: 'slack.channel.rename' }, async ({ data }) => {
          return renameSlackChannel(data);
        })
        .with({ name: 'slack.channel.unarchive' }, async ({ data }) => {
          return unarchiveSlackChannel(data);
        })
        // .with({ name: 'slack.chatbot.message' }, async ({ data }) => {
        //   return answerChatbotQuestion(data);
        // })
        .with({ name: 'slack.deactivate' }, async ({ data }) => {
          return deactivateSlackUser(data);
        })
        // .with({ name: 'slack.emoji.changed' }, async ({ data }) => {
        //   if (data.subtype === 'add') {
        //     return onSlackEmojiAdded(data);
        //   }
        // })
        .with({ name: 'slack.invite' }, async ({ data }) => {
          return inviteToSlackWorkspace(data);
        })
        // .with({ name: 'slack.invited' }, async ({ data }) => {
        //   return onSlackUserInvited(data);
        // })
        // .with({ name: 'slack.joined' }, async ({ data }) => {
        //   return onSlackWorkspaceJoined(data);
        // })
        .with({ name: 'slack.message.add' }, async ({ data }) => {
          return addSlackMessage(data);
        })
        // .with({ name: 'slack.message.answer' }, async ({ data }) => {
        //   const result = await answerPublicQuestion(data);

        //   if (!result.ok) {
        //     throw new Error(result.error);
        //   }

        //   return result.data;
        // })
        .with({ name: 'slack.message.change' }, async ({ data }) => {
          return changeSlackMessage(data);
        })
        .with({ name: 'slack.secured_the_bag.reminder' }, async ({ data }) => {
          return sendSecuredTheBagReminder(data);
        })
        .otherwise(() => {
          throw new Error(`Unknown job type: ${job.name}`);
        })
    );
  },
};
