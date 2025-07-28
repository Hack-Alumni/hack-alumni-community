import { db } from '@hack-alumni/db';
import { id } from '@hack-alumni/utils';

import { type GetBullJobData } from '@/infrastructure/bull.types';

export async function viewMemberProfile({
  profileViewedId,
  viewerId,
}: GetBullJobData<'student.profile.viewed'>) {
  await db
    .insertInto('profileViews')
    .values({
      id: id(),
      profileViewedId,
      viewerId,
    })
    .execute();
}
