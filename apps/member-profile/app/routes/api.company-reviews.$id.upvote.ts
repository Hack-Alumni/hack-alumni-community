import { type ActionFunctionArgs, json } from '@remix-run/node';

import { upvoteCompanyReview } from '@hackcommunity/core/employment/server';

import { ensureUserAuthenticated, user } from '@/shared/session.server';

export async function action({ params, request }: ActionFunctionArgs) {
  const session = await ensureUserAuthenticated(request);

  await upvoteCompanyReview(params.id as string, {
    memberId: user(session),
  });

  return json({});
}
