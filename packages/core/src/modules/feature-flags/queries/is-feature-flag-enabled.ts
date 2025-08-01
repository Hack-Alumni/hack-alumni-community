import { db } from '@hackcommunity/db';

import { type FeatureFlagName } from '../feature-flags.types';

export async function isFeatureFlagEnabled(name: FeatureFlagName) {
  const enabledFlag = await db
    .selectFrom('featureFlags')
    .select('enabled')
    .where('name', '=', name)
    .executeTakeFirst();

  return !!enabledFlag?.enabled;
}
