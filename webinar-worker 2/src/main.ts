import { app } from './app';
import { envs } from './configs';
import { createWorker } from './worker/worker';
import { startOutboxWorker, stopOutboxWorker } from './worker/outbox.worker';

async function bootstrap() {
  // 1. Start BullMQ consumer (processes jobs from Redis)
  const bullWorker = createWorker();

  // 2. Start Outbox poller (Postgres → BullMQ bridge)
  const outboxTimer = startOutboxWorker();

  // 3. Start HTTP server
  const server = app.listen(envs.server.port, () => {
    console.log(
      `[Main] ${envs.server.serviceName} running on port ${envs.server.port} [${envs.server.nodeEnv}]`
    );
  });

  // ─── Graceful shutdown ───────────────────────────────────────────────────
  const shutdown = async (signal: string) => {
    console.log(`\n[Main] ${signal} received — shutting down gracefully...`);

    stopOutboxWorker(outboxTimer);

    await bullWorker.close();
    console.log('[Main] BullMQ worker closed');

    server.close(() => {
      console.log('[Main] HTTP server closed');
      process.exit(0);
    });

    // Force exit after 10s
    setTimeout(() => process.exit(1), 10_000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT',  () => shutdown('SIGINT'));
}

bootstrap().catch((err) => {
  console.error('[Main] Fatal startup error:', err);
  process.exit(1);
});
