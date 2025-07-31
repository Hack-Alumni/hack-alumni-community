import { type ActionFunctionArgs, json } from '@remix-run/node';

import { track } from '@hack-alumni/core/mixpanel';
import { upvoteResource } from '@hack-alumni/core/resources/server';

import { ensureUserAuthenticated, user } from '@/shared/session.server';

export async function action({ params, request }: ActionFunctionArgs) {
  const session = await ensureUserAuthenticated(request);

  await upvoteResource(params.id as string, {
    memberId: user(session),
  });

  track({
    event: 'Resource Upvoted',
    properties: undefined,
    request,
    user: user(session),
  });

  return json({});
}
