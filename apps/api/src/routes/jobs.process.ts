import { triggerScheduledJobProcessing } from '@hackcommunity/core/hybrid-job-queue';

export async function loader(request: Request) {
  // Check for CRON_SECRET authorization
  const authHeader = request.headers.get('Authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    // Trigger scheduled job processing via Supabase Edge Function
    const result = await triggerScheduledJobProcessing();

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Scheduled job processing failed:', error);

    return new Response(
      JSON.stringify({ error: 'Scheduled job processing failed' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
