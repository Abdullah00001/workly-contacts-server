import { Job, Worker } from 'bullmq';
import logger from '@/configs/logger.configs';
import { Activity } from '@/modules/user/user.models';
import { IActivityPayload } from '@/modules/user/user.interfaces';
import redisClient from '@/configs/redis.configs';

const worker = new Worker(
  'activity-queue',
  async (job: Job) => {
    const { name, data, id } = job;
    try {
      if (name === 'save-activity-to-db') {
        const newActivity = new Activity(data as IActivityPayload);
        await newActivity.save();
        return;
      }
      if (name === 'save-signup-activity-to-db') {
        const newActivity = new Activity(data as IActivityPayload);
        await newActivity.save();
        return;
      }
      if (name === 'save-login-activity-to-db') {
        const newActivity = new Activity(data as IActivityPayload);
        await newActivity.save();
        return;
      }
    } catch (error) {
      logger.error('Worker job failed', { jobName: name, jobId: id, error });
      throw error;
    }
  },
  { connection: redisClient }
);

worker.on('completed', (job: Job) => {
  logger.info(`Job Name : ${job.name} Job Id : ${job.id} Completed`);
});

worker.on('failed', (job: Job | undefined, error: Error) => {
  if (!job) {
    logger.error(
      `A job failed but the job data is undefined.\nError:\n${error}`
    );
    return;
  }
  logger.error(
    `Job Name : ${job.name} Job Id : ${job.id} Failed\nError:\n${error}`
  );
});
