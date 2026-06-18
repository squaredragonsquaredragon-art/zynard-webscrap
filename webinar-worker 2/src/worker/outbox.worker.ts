/**
 * Outbox Worker
 *
 * Runs as a background setInterval loop.
 * Polls the `outbox_events` table for PENDING events,
 * enqueues them into BullMQ, then marks them DONE.
 *
 * This is the bridge between Postgres and Redis:
 *   Postgres (outbox_events) → BullMQ (webinar-queue)
 *
 * NOTE: Replace stub DB calls with your real client once DB is set up.
 */

import { enqueueJob } from '../queue/queue';
import type { JobName } from '../queue/jobs';
import type { OutboxEvent } from '../types';

const POLL_INTERVAL_MS = 2000; // poll every 2 seconds

// ─── Stub DB helpers (replace with real Postgres queries later) ────────────

async function fetchPendingEvents(): Promise<OutboxEvent[]> {
  // TODO:
  // return pool.query<OutboxEvent>(
  //   `SELECT * FROM outbox_events WHERE status = 'PENDING' ORDER BY created_at LIMIT 10 FOR UPDATE SKIP LOCKED`
  // ).then(r => r.rows);
  return []; // stub — returns empty until DB is wired
}

async function markProcessing(id: string): Promise<void> {
  // TODO:
  // await pool.query(`UPDATE outbox_events SET status = 'PROCESSING' WHERE id = $1`, [id]);
  console.log(`[OutboxWorker] Marking PROCESSING: ${id}`);
}

async function markDone(id: string): Promise<void> {
  // TODO:
  // await pool.query(
  //   `UPDATE outbox_events SET status = 'DONE', processed_at = NOW() WHERE id = $1`, [id]
  // );
  console.log(`[OutboxWorker] Marking DONE: ${id}`);
}

async function markFailed(id: string): Promise<void> {
  // TODO:
  // await pool.query(`UPDATE outbox_events SET status = 'FAILED' WHERE id = $1`, [id]);
  console.warn(`[OutboxWorker] Marking FAILED: ${id}`);
}

// ─── Core poll loop ────────────────────────────────────────────────────────

async function pollAndEnqueue(): Promise<void> {
  const events = await fetchPendingEvents();
  if (events.length === 0) return;

  console.log(`[OutboxWorker] Found ${events.length} pending event(s)`);

  for (const event of events) {
    try {
      await markProcessing(event.id);

      await enqueueJob(
        event.eventType as JobName,
        event.payload as any
      );

      await markDone(event.id);
    } catch (err) {
      console.error(`[OutboxWorker] Failed to process event ${event.id}:`, err);
      await markFailed(event.id);
    }
  }
}

// ─── Start / Stop ─────────────────────────────────────────────────────────

export function startOutboxWorker(): NodeJS.Timeout {
  console.log(`[OutboxWorker] Started — polling every ${POLL_INTERVAL_MS}ms`);

  const timer = setInterval(async () => {
    try {
      await pollAndEnqueue();
    } catch (err) {
      console.error('[OutboxWorker] Poll error:', err);
    }
  }, POLL_INTERVAL_MS);

  return timer;
}

export function stopOutboxWorker(timer: NodeJS.Timeout): void {
  clearInterval(timer);
  console.log('[OutboxWorker] Stopped');
}
