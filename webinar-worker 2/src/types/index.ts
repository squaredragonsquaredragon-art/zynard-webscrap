// ─── Job Payloads ──────────────────────────────────────────────────────────

export interface WebinarRegistrationPayload {
  webinarId: string;
  userId: string;
  name: string;
  email: string;
  registeredAt: string;
}

export interface WebinarReminderPayload {
  webinarId: string;
  userId: string;
  email: string;
  webinarTitle: string;
  scheduledAt: string;
}

export interface WebinarCancelPayload {
  webinarId: string;
  reason?: string;
  notifyAll: boolean;
}

// ─── Outbox ────────────────────────────────────────────────────────────────

export type OutboxStatus = 'PENDING' | 'PROCESSING' | 'DONE' | 'FAILED';

export interface OutboxEvent {
  id: string;
  eventType: string;
  payload: Record<string, unknown>;
  status: OutboxStatus;
  createdAt: Date;
  processedAt?: Date;
}

// ─── API ───────────────────────────────────────────────────────────────────

export interface RegisterWebinarBody {
  webinarId: string;
  userId: string;
  name: string;
  email: string;
}
