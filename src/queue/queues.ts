import redisClient from '@/configs/redis.configs';
import { Queue } from 'bullmq';

export const EmailQueue = new Queue('email-queue', { connection: redisClient });
export const ActivityQueue = new Queue('activity-queue', {
  connection: redisClient,
});
export const AccountDeleteQueue = new Queue('account-deletion-queue', {
  connection: redisClient,
});
