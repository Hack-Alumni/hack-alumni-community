import express from 'express';

import {
  triggerJobCleanup,
  triggerScheduledJobProcessing,
} from '@hackcommunity/core/hybrid-job-queue';

const router = express.Router();

// Process scheduled jobs
router.post('/jobs/process', async (req, res) => {
  // Check for CRON_SECRET authorization
  const authHeader = req.headers.authorization;
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const result = await triggerScheduledJobProcessing();

    res.json(result);
  } catch (error) {
    console.error('Scheduled job processing failed:', error);
    res.status(500).json({ error: 'Scheduled job processing failed' });
  }
});

// Cleanup old jobs
router.post('/cron/cleanup-old-jobs', async (req, res) => {
  // Check for CRON_SECRET authorization
  const authHeader = req.headers.authorization;
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const result = await triggerJobCleanup();

    res.json(result);
  } catch (error) {
    console.error('Job cleanup failed:', error);
    res.status(500).json({ error: 'Job cleanup failed' });
  }
});

// Process immediate jobs (for QStash webhook)
router.post('/jobs/process-immediate', async (req, res) => {
  try {
    const { name, data } = req.body;

    if (!name || !data) {
      return res.status(400).json({ error: 'Invalid job data' });
    }

    // Import the function dynamically to avoid circular dependencies
    const { processImmediateJob } = await import(
      '@hackcommunity/core/hybrid-job-queue'
    );
    const result = await processImmediateJob({ name, data });

    res.json({ success: true, result });
  } catch (error) {
    console.error('Immediate job processing failed:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export { router as jobsRouter };
