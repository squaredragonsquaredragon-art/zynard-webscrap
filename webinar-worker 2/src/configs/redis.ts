import { ConnectionOptions } from 'bullmq';
import { envs } from './env';

export const redisConnection: ConnectionOptions = {
  host: envs.redis.host,
  port: envs.redis.port,
  password: envs.redis.password,
};
