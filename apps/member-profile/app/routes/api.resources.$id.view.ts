import { type ActionFunctionArgs, json } from '@remix-run/node';

import { viewResource } from '@hackcommunity/core/resources/server';

import { ensureUserAuthenticated, user } from '@/shared/session.server';

export async function action({ params, request }: ActionFunctionArgs) {
  const session = await ensureUserAuthenticated(request);

  await viewResource(params.id as string, {
    memberId: user(session),
  });

  // TODO: Re-implement tracking after analytics setup
  // track({
  //   event: 'Resource Viewed',
  //   properties: undefined,
  //   request,
  //   user: user(session),
  // });

  return json({});
}
