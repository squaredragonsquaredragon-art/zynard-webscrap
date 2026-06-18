import { Worker } from 'bullmq';
import { redisConnection } from '../configs/redis';
import { processJob } from './processors';
import type { AnyJobPayload } from '../queue/queue';

// ─── BullMQ Worker ─────────────────────────────────────────────────────────
// Listens to 'webinar-queue' (must match Queue name in queue.ts)
// and dispatches each job to the right processor.

export function createWorker() {
  const worker = new Worker<AnyJobPayload>('webinar-queue', processJob, {
    connection: redisConnection,
    concurrency: 5, // process up to 5 jobs in parallel
  });

  worker.on('completed', (job) => {
    console.log(`[Worker] ✓ Job completed: "${job.name}" id=${job.id}`);
  });

  worker.on('failed', (job, err) => {
    console.error(`[Worker] ✗ Job failed: "${job?.name}" id=${job?.id}`, err.message);
  });

  worker.on('error', (err) => {
    console.error('[Worker] Worker error:', err);
  });

  console.log('[Worker] BullMQ worker started → listening on "webinar-queue"');
  return worker;
}
