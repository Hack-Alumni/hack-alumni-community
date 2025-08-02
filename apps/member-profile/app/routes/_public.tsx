import { Outlet } from '@remix-run/react';

import { Public } from '@hackcommunity/ui';

export default function PublicLayout() {
  return (
    <Public.Layout>
      <Outlet />
    </Public.Layout>
  );
}
