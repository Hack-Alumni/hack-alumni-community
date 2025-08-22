import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get pending jobs that are ready to process
    // Get pending jobs that are ready to process
    const { data: jobs, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('status', 'pending')
      .lte('scheduled_at', new Date().toISOString())
      .order('priority', { ascending: false })
      .order('created_at', { ascending: true })
      .limit(10);

    // Filter jobs that haven't exceeded max attempts
    const jobsToProcess =
      jobs?.filter((job) => job.attempts < job.max_attempts) || [];

    if (error) {
      console.error('Error fetching jobs:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!jobs || jobs.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No jobs to process', processed: 0 }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    let processed = 0;
    const results = [];

    // Process each job
    for (const job of jobsToProcess) {
      try {
        // Mark job as processing
        await supabase
          .from('jobs')
          .update({
            status: 'processing',
            attempts: job.attempts + 1,
            processed_at: new Date().toISOString(),
          })
          .eq('id', job.id);

        // Process the job based on its name
        const result = await processJob(job, supabase);

        // Mark as completed
        await supabase
          .from('jobs')
          .update({ status: 'completed' })
          .eq('id', job.id);

        processed++;
        results.push({
          id: job.id,
          name: job.name,
          status: 'completed',
          result,
        });
      } catch (error) {
        console.error(`Job ${job.name} failed:`, error);

        // Mark as failed or retry
        const newStatus =
          job.attempts + 1 >= job.max_attempts ? 'failed' : 'pending';
        await supabase
          .from('jobs')
          .update({
            status: newStatus,
            error: error instanceof Error ? error.message : String(error),
          })
          .eq('id', job.id);

        results.push({
          id: job.id,
          name: job.name,
          status: newStatus,
          error: error.message,
        });
      }
    }

    return new Response(
      JSON.stringify({
        message: `Processed ${processed} jobs`,
        processed,
        results,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Function error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Job processing logic
async function processJob(job: any, supabase: any) {
  const { name, data, queue_name } = job;

  // Simple job processing based on job name
  switch (name) {
    case 'slack.message.add':
      // Process Slack message
      console.log('Processing Slack message:', data);
      return { message: 'Slack message processed' };

    case 'notification.email.send':
      // Process email notification
      console.log('Processing email notification:', data);
      return { message: 'Email notification processed' };

    case 'airtable.record.update':
      // Process Airtable update
      console.log('Processing Airtable update:', data);
      return { message: 'Airtable record updated' };

    case 'student.birthdate.daily':
      // Process birthday notifications
      console.log('Processing birthday notifications:', data);
      return { message: 'Birthday notifications processed' };

    default:
      console.log(`Processing job: ${name}`, data);
      return { message: `Job ${name} processed` };
  }
}
