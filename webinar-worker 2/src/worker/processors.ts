import { Job } from 'bullmq';
import { JOBS, JobName } from '../queue/jobs';
import type {
  WebinarRegistrationPayload,
  WebinarReminderPayload,
  WebinarCancelPayload,
  AnyJobPayload,
} from '../queue/queue';

// ─── Individual processors ─────────────────────────────────────────────────

async function handleWebinarRegistration(job: Job<WebinarRegistrationPayload>) {
  const { name, email, webinarId } = job.data;
  console.log(`[Processor] WEBINAR_REGISTRATION → sending confirmation to ${email}`);

  // TODO: call your email/notification service here
  // await emailService.sendConfirmation({ to: email, name, webinarId });

  console.log(`[Processor] ✓ Confirmation sent to ${name} <${email}> for webinar ${webinarId}`);
}

async function handleWebinarReminder(job: Job<WebinarReminderPayload>) {
  const { email, webinarTitle, scheduledAt } = job.data;
  console.log(`[Processor] WEBINAR_REMINDER → sending reminder to ${email}`);

  // TODO: await emailService.sendReminder({ to: email, webinarTitle, scheduledAt });

  console.log(`[Processor] ✓ Reminder sent for "${webinarTitle}" at ${scheduledAt}`);
}

async function handleWebinarCancelled(job: Job<WebinarCancelPayload>) {
  const { webinarId, reason } = job.data;
  console.log(`[Processor] WEBINAR_CANCELLED → notifying all attendees of ${webinarId}`);

  // TODO: fetch attendees from DB, batch-send cancellation emails

  console.log(`[Processor] ✓ Cancellation broadcast for ${webinarId}. Reason: ${reason ?? 'N/A'}`);
}

// ─── Main dispatcher ───────────────────────────────────────────────────────

export async function processJob(job: Job<AnyJobPayload>) {
  const name = job.name as JobName;

  console.log(`[Worker] Processing job "${name}" id=${job.id} attempt=${job.attemptsMade + 1}`);

  switch (name) {
    case JOBS.WEBINAR_REGISTRATION:
      return handleWebinarRegistration(job as Job<WebinarRegistrationPayload>);

    case JOBS.WEBINAR_REMINDER:
      return handleWebinarReminder(job as Job<WebinarReminderPayload>);

    case JOBS.WEBINAR_CANCELLED:
      return handleWebinarCancelled(job as Job<WebinarCancelPayload>);

    default:
      throw new Error(`[Worker] Unknown job name: ${name}`);
  }
}
