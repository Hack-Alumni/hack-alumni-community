import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import { Dashboard, ProfilePicture, Text } from '@oyster/ui';

import { ensureUserAuthenticated, user } from '@/shared/session.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await ensureUserAuthenticated(request);
  const memberId = user(session);

  return json({
    memberId,
  });
}

// Page

export default function Developers() {
  // This will throw if the user is not authenticated
  useLoaderData<typeof loader>();

  return (
    <>
      <Dashboard.Header>
        <Dashboard.Title>Meet the Developers</Dashboard.Title>
      </Dashboard.Header>

      <div className="h-4" />
      <Text className="-mt-3 w-3/5" color="black" variant="md">
        We’re a team of four passionate Hack.Diversity alumni, united by a
        shared mission to carry forward the vision of Hack.Diversity that shaped
        us. Drawing on our diverse backgrounds and experiences, we built this
        platform as a way to give back—creating a space where our community can
        connect, grow, and thrive together. What started as a shared commitment
        has evolved into a tool for collective impact.
      </Text>

      <div className="flex flex-wrap items-center gap-2"></div>

      <div className="mb-6 grid grid-cols-1 gap-4 @[800px]:grid-cols-2 @[1200px]:grid-cols-4">
        {[
          {
            name: 'Josue (JV) Villanueva',
            role: 'Software Engineer',
            image: '/images/eliana.jpg',
            description:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
          },
          {
            name: 'Eliana Lopez',
            role: 'Software Engineer',
            image: '/images/alex.jpg',
            description:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
          },
          {
            name: 'Denilson Lopez',
            role: 'Software Engineer',
            image: '/images/priya.jpg',
            description:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
          },
          {
            name: 'Giancarlos Marte',
            role: 'Software Engineer',
            image: '/images/jordan.jpg',
            description:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
          },
        ].map((dev) => (
          <div
            key={dev.name}
            className="flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <div className="mb-3">
              <ProfilePicture
                size="64"
                src={dev.image}
                initials={dev.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()}
              />
            </div>
            <Text weight="600" variant="md" className="mb-1 text-center">
              {dev.name}
            </Text>
            <Text color="gray-500" variant="sm" className="text-center">
              {dev.role}
            </Text>
            <Text color="gray-500" variant="sm" className="mt-2 text-center">
              {dev.description}
            </Text>
          </div>
        ))}
      </div>
    </>
  );
}
