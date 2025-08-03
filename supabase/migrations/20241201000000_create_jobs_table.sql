-- Create jobs table for background job processing
CREATE TABLE IF NOT EXISTS jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  data JSONB NOT NULL,
  queue_name TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  priority INTEGER DEFAULT 0,
  scheduled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE,
  error TEXT
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_jobs_status_scheduled_at ON jobs(status, scheduled_at);
CREATE INDEX IF NOT EXISTS idx_jobs_queue_name ON jobs(queue_name);
CREATE INDEX IF NOT EXISTS idx_jobs_priority ON jobs(priority DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at);

-- Create function to get next job (with row locking to prevent race conditions)
CREATE OR REPLACE FUNCTION get_next_job()
RETURNS TABLE (
  id UUID,
  name TEXT,
  data JSONB,
  queue_name TEXT,
  attempts INTEGER,
  max_attempts INTEGER
) AS $$
BEGIN
  RETURN QUERY
  UPDATE jobs
  SET
    status = 'processing',
    attempts = attempts + 1,
    processed_at = NOW()
  WHERE id = (
    SELECT j.id
    FROM jobs j
    WHERE j.status = 'pending'
    AND j.scheduled_at <= NOW()
    AND j.attempts < j.max_attempts
    ORDER BY j.priority DESC, j.created_at ASC
    LIMIT 1
    FOR UPDATE SKIP LOCKED
  )
  RETURNING jobs.id, jobs.name, jobs.data, jobs.queue_name, jobs.attempts, jobs.max_attempts;
END;
$$ LANGUAGE plpgsql;

-- Create function to cleanup old jobs
CREATE OR REPLACE FUNCTION cleanup_old_jobs(days_to_keep INTEGER DEFAULT 7)
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM jobs
  WHERE status IN ('completed', 'failed')
  AND created_at < NOW() - INTERVAL '1 day' * days_to_keep;

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Create function to get job statistics
CREATE OR REPLACE FUNCTION get_job_stats()
RETURNS TABLE (
  total_jobs BIGINT,
  pending_jobs BIGINT,
  processing_jobs BIGINT,
  completed_jobs BIGINT,
  failed_jobs BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*) as total_jobs,
    COUNT(*) FILTER (WHERE status = 'pending') as pending_jobs,
    COUNT(*) FILTER (WHERE status = 'processing') as processing_jobs,
    COUNT(*) FILTER (WHERE status = 'completed') as completed_jobs,
    COUNT(*) FILTER (WHERE status = 'failed') as failed_jobs
  FROM jobs;
END;
$$ LANGUAGE plpgsql;
