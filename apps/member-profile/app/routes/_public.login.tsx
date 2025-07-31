import { json } from '@remix-run/node';
import { Outlet } from '@remix-run/react';

import { Login, Public } from '@hack-alumni/ui';

export async function loader() {
  return json({});
}

export default function LoginLayout() {
  return (
    <Public.Content>
      <Login.Title>Hack.Diversity Profile</Login.Title>
      <Outlet />
    </Public.Content>
  );
}
