import { verifySignature } from '@upstash/qstash/nextjs';

import { processImmediateJob } from '@hackcommunity/core/hybrid-job-queue';

export async function action(request: Request) {
  try {
    // Verify the QStash signature
    await verifySignature(request);

    const { name, data } = await request.json();

    if (!name || !data) {
      return new Response(JSON.stringify({ error: 'Invalid job data' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const result = await processImmediateJob({ name, data });

    return new Response(JSON.stringify({ success: true, result }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Immediate job processing failed:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

// Handle GET requests for testing
export async function loader() {
  return new Response('Immediate job processing endpoint', {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
