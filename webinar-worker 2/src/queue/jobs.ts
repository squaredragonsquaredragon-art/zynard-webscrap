// ─── Job Name Constants ────────────────────────────────────────────────────
// Used as the first argument to Queue.add() and matched in the Worker processor.

export const JOBS = {
  /** Fired after a user registers for a webinar */
  WEBINAR_REGISTRATION: 'WEBINAR_REGISTRATION',

  /** Reminder sent N minutes before the webinar starts */
  WEBINAR_REMINDER: 'WEBINAR_REMINDER',

  /** Broadcast when a webinar is cancelled */
  WEBINAR_CANCELLED: 'WEBINAR_CANCELLED',
} as const;

export type JobName = (typeof JOBS)[keyof typeof JOBS];
