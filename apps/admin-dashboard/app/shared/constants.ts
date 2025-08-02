const ROUTES = [
  '/',
  '/admins',
  '/admins/add',
  '/admins/:id/remove',
  '/feature-flags',
  '/feature-flags/create',
  '/feature-flags/:id/delete',
  '/feature-flags/:id/edit',
  '/gamification/activities',
  '/gamification/activities/add',
  '/gamification/activities/:id/archive',
  '/gamification/activities/:id/edit',
  '/login',
  '/login/otp/send',
  '/login/otp/verify',
  '/onboarding-sessions',
  '/onboarding-sessions/upload',
  '/onboarding-sessions/:id/add-attendees',
  '/schools',
  '/schools/create',
  '/schools/:id/chapter/create',
  '/schools/:id/edit',
  '/students',
  '/students/:id/activate',
  '/students/:id/email',
  '/students/:id/gift',
  '/students/:id/points/grant',
  '/students/:id/remove',
] as const;

export type Route = (typeof ROUTES)[number];

type RouteMap = {
  [Key in Route]: Key;
};

export const Route = ROUTES.reduce((result, route) => {
  Object.assign(result, { [route]: route });

  return result;
}, {} as RouteMap);
