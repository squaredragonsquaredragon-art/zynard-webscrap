import dotenv from 'dotenv';
dotenv.config();

export const envs = {
  server: {
    port: process.env.PORT || 3000,
    serviceName: process.env.SERVICE_NAME || 'webinar-worker',
    nodeEnv: process.env.NODE_ENV || 'development',
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
  },
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    name: process.env.DB_NAME || 'webinar_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
  },
};
