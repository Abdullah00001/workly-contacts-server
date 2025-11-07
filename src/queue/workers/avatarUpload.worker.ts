import CloudinaryConfigs from '@/configs/cloudinary.configs';
import logger from '@/configs/logger.configs';
import redisClient from '@/configs/redis.configs';
import User from '@/modules/user/user.models';
import { TAvatarUploadJob } from '@/queue/jobs/avatarUpload.jobs';
import { Job, Worker } from 'bullmq';

const { uploadAvatar } = CloudinaryConfigs;

const worker = new Worker(
  'avatar-upload-queue',
  async (job: Job) => {
    const { name, data, id } = job;
    try {
      if (name === 'profile-avatar-upload') {
        const { url, userId } = data as TAvatarUploadJob;
        const avatar = await uploadAvatar(url);
        await User.findByIdAndUpdate(userId, {
          $set: {
            avatar,
          },
        });
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
