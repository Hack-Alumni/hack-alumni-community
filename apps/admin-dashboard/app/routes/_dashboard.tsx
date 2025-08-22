import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';
import {
  BookOpen,
  Calendar,
  Gift,
  Layers,
  MapPin,
  Target,
  ToggleRight,
  User,
  Video,
} from 'react-feather';

import { getAdmin } from '@hackcommunity/core/admins';
import { AdminRole } from '@hackcommunity/core/admins/types';
import { countPendingApplications } from '@hackcommunity/core/applications';
import { Dashboard, Divider } from '@hackcommunity/ui';

import { Route } from '@/shared/constants';
import { getSession, user } from '@/shared/session.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request);

  const [pendingApplications, admin] = await Promise.all([
    countPendingApplications(),

    getAdmin({
      select: ['admins.role'],
      where: { id: user(session) },
    }),
  ]);

  return json({
    pendingApplications,
    role: admin?.role, // This is tied to the "useRole" hook!
  });
}

export default function DashboardLayout() {
  const { pendingApplications, role } = useLoaderData<typeof loader>();

  return (
    <Dashboard>
      <Dashboard.Sidebar>
        <div className="mb-8 flex w-full items-center justify-between">
          <Dashboard.ColorStackLogo />
          <Dashboard.CloseMenuButton />
        </div>

        <Dashboard.Navigation>
          <Dashboard.NavigationList>
            {role === AdminRole.AMBASSADOR ? (
              <>
                <Dashboard.NavigationLink
                  icon={<Video />}
                  label="Onboarding"
                  pathname={Route['/onboarding-sessions']}
                />
              </>
            ) : (
              <>
                <Dashboard.NavigationLink
                  icon={<User />}
                  label="Members"
                  pathname={Route['/students']}
                />
                <Dashboard.NavigationLink
                  icon={<User />}
                  label="Admins"
                  pathname={Route['/admins']}
                />
                <Dashboard.NavigationLink
                  icon={<MapPin />}
                  label="Schools"
                  pathname={Route['/schools']}
                />

                {role === AdminRole.OWNER && (
                  <>
                    <Divider my="2" />

                    <Dashboard.NavigationLink
                      icon={<ToggleRight />}
                      label="Feature Flags"
                      pathname={Route['/feature-flags']}
                    />
                  </>
                )}
              </>
            )}
          </Dashboard.NavigationList>
        </Dashboard.Navigation>

        <Dashboard.LogoutForm />
      </Dashboard.Sidebar>

      <Dashboard.Page>
        <Dashboard.MenuButton />
        <Outlet />
      </Dashboard.Page>
    </Dashboard>
  );
}
