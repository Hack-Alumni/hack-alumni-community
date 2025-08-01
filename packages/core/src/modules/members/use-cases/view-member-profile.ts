import { db } from '@hackcommunity/db';
import { id } from '@hackcommunity/utils';

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
