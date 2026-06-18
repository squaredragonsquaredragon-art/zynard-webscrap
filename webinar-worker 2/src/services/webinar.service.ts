/**
 * WebinarService
 *
 * Handles the "register" use-case using the Transactional Outbox pattern:
 *   1. Save registration   ┐
 *   2. Save outbox event   ┘  in ONE Postgres transaction
 *
 * The outbox worker (worker/outbox.worker.ts) picks up PENDING events
 * and enqueues them into BullMQ — completely decoupled from the HTTP request.
 *
 * NOTE: Replace the stub DB calls with your actual Postgres client (pg / prisma / drizzle).
 */

import { randomUUID } from 'crypto';
import type { RegisterWebinarBody, OutboxEvent } from '../types';

// ─── Stub: swap these with your real DB client later ──────────────────────

async function saveRegistrationTx(data: RegisterWebinarBody, txClient: unknown) {
  // e.g. await txClient.query(
  //   'INSERT INTO registrations (id, webinar_id, user_id, name, email) VALUES ($1,$2,$3,$4,$5)',
  //   [randomUUID(), data.webinarId, data.userId, data.name, data.email]
  // );
  console.log('[DB] Saving registration (stub)', data);
}

async function saveOutboxEventTx(
  eventType: string,
  payload: Record<string, unknown>,
  txClient: unknown
): Promise<OutboxEvent> {
  const event: OutboxEvent = {
    id: randomUUID(),
    eventType,
    payload,
    status: 'PENDING',
    createdAt: new Date(),
  };

  // e.g. await txClient.query(
  //   'INSERT INTO outbox_events (id, event_type, payload, status, created_at) VALUES ($1,$2,$3,$4,$5)',
  //   [event.id, event.eventType, JSON.stringify(event.payload), event.status, event.createdAt]
  // );
  console.log('[DB] Saving outbox event (stub)', event);
  return event;
}

// ─── Public service method ─────────────────────────────────────────────────

export async function registerForWebinar(body: RegisterWebinarBody): Promise<{ eventId: string }> {
  // TODO: wrap in real transaction:
  // const client = await pool.connect();
  // await client.query('BEGIN');
  // try {
  //   await saveRegistrationTx(body, client);
  //   const event = await saveOutboxEventTx('WEBINAR_REGISTRATION', { ...body, registeredAt: new Date().toISOString() }, client);
  //   await client.query('COMMIT');
  //   return { eventId: event.id };
  // } catch (err) {
  //   await client.query('ROLLBACK');
  //   throw err;
  // } finally {
  //   client.release();
  // }

  // ── Stub (no real DB yet) ──
  const txClient = null; // placeholder
  await saveRegistrationTx(body, txClient);
  const event = await saveOutboxEventTx('WEBINAR_REGISTRATION', {
    ...body,
    registeredAt: new Date().toISOString(),
  }, txClient);

  return { eventId: event.id };
}
