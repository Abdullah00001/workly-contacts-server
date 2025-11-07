import { Redis } from 'ioredis';
import { env } from '../env';

const redisClient = new Redis({
  host: env.REDIS_HOST,
  password: env.REDIS_PASSWORD,
  port: Number(env.REDIS_PORT) || 6379,
  maxRetriesPerRequest: null,
  lazyConnect: false,
});

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
});

export default redisClient;
