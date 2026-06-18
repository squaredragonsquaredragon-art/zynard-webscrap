import { Queue } from 'bullmq';
import { redisConnection } from '../configs/redis';
import type { JobName } from './jobs';
import type {
  WebinarRegistrationPayload,
  WebinarReminderPayload,
  WebinarCancelPayload,
} from '../types';

// Union of all possible payloads
export type AnyJobPayload =
  | WebinarRegistrationPayload
  | WebinarReminderPayload
  | WebinarCancelPayload;

// ─── Queue singleton ───────────────────────────────────────────────────────

export const webinarQueue = new Queue<AnyJobPayload>('webinar-queue', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000, // 2s → 4s → 8s
    },
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 500 },
  },
});

// ─── Typed helper ─────────────────────────────────────────────────────────

export async function enqueueJob(
  jobName: JobName,
  payload: AnyJobPayload,
  opts?: { delay?: number; priority?: number }
) {
  const job = await webinarQueue.add(jobName, payload, {
    delay: opts?.delay,
    priority: opts?.priority,
  });

  console.log(`[Queue] Enqueued job "${jobName}" → id=${job.id}`);
  return job;
}
