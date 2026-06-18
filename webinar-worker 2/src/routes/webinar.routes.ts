import { Router, Request, Response } from 'express';
import { registerForWebinar } from '../services/webinar.service';
import { enqueueJob } from '../queue/queue';
import { JOBS } from '../queue/jobs';
import type { RegisterWebinarBody } from '../types';

export const webinarRouter = Router();

// ─── POST /webinar/register ────────────────────────────────────────────────
// Full transactional outbox flow:
//   → save registration + outbox event (atomic)
//   → return 201; outbox worker enqueues to BullMQ in background

webinarRouter.post(
  '/register',
  async (req: Request<{}, {}, RegisterWebinarBody>, res: Response) => {
    const { webinarId, userId, name, email } = req.body;

    if (!webinarId || !userId || !name || !email) {
      res.status(400).json({ message: 'webinarId, userId, name, email are required' });
      return;
    }

    try {
      const { eventId } = await registerForWebinar({ webinarId, userId, name, email });
      res.status(201).json({ message: 'Registered successfully', eventId });
    } catch (err) {
      console.error('[Route] /webinar/register error:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

// ─── POST /webinar/job (manual enqueue — dev/testing shortcut) ────────────

webinarRouter.post('/job', async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const job = await enqueueJob(JOBS.WEBINAR_REGISTRATION, {
      webinarId: 'test-webinar',
      userId: 'test-user',
      name: name ?? 'Test User',
      email: 'test@example.com',
      registeredAt: new Date().toISOString(),
    });
    res.json({ message: 'Job added', jobId: job.id });
  } catch (err) {
    console.error('[Route] /webinar/job error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});
