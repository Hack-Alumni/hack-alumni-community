import { json } from '@remix-run/node';
import type { LoaderFunctionArgs } from '@remix-run/node';

export async function loader({ request }: LoaderFunctionArgs) {
  return json(
    { status: 'ok', timestamp: new Date().toISOString() },
    { status: 200 }
  );
}
