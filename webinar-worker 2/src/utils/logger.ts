import { envs } from '../configs/env';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

function log(level: LogLevel, message: string, meta?: unknown) {
  const ts = new Date().toISOString();
  const prefix = `[${ts}] [${level.toUpperCase()}]`;

  if (meta !== undefined) {
    console[level === 'debug' ? 'log' : level](`${prefix} ${message}`, meta);
  } else {
    console[level === 'debug' ? 'log' : level](`${prefix} ${message}`);
  }
}

export const logger = {
  info:  (msg: string, meta?: unknown) => log('info',  msg, meta),
  warn:  (msg: string, meta?: unknown) => log('warn',  msg, meta),
  error: (msg: string, meta?: unknown) => log('error', msg, meta),
  debug: (msg: string, meta?: unknown) => {
    if (envs.server.nodeEnv === 'development') log('debug', msg, meta);
  },
};
