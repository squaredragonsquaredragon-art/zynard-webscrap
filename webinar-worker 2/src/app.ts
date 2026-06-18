import express from 'express';
import { envs } from './configs';
import { webinarRouter } from './routes/webinar.routes';

export const app: express.Express = express();

// ─── Middleware ────────────────────────────────────────────────────────────
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.send(`Hello from ${envs.server.serviceName}`);
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: envs.server.serviceName });
});

app.use('/webinar', webinarRouter);
// → POST /webinar/register  (transactional outbox flow)
// → POST /webinar/job       (manual enqueue for dev/testing)
