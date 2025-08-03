import { triggerJobCleanup } from '@hackcommunity/core/hybrid-job-queue';

export async function loader(request: Request) {
  // Check for CRON_SECRET authorization
  const authHeader = request.headers.get('Authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const result = await triggerJobCleanup();
    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Job cleanup failed:', error);
    return new Response(JSON.stringify({ error: 'Job cleanup failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
