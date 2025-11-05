import logger from '@/configs/logger.configs';
import mailTransporter from '@/configs/nodemailer.configs';
import redisClient from '@/configs/redis.configs';
import mailOption from '@/utils/mailOption.utils';
import { Job, Worker } from 'bullmq';
import Handlebars from 'handlebars';
import Label from '@/modules/label/label.models';
import { IAccountDeletionJobPayload } from '@/modules/user/user.interfaces';
import Contacts from '@/modules/contacts/contacts.models';
import Profile from '@/modules/profile/profile.models';
import User, { Activity } from '@/modules/user/user.models';
import accountDeletionConfirmationEmailTemplate from '@/templates/accountDeletionConfirmationEmailTemplate';

const worker = new Worker(
  'account-deletion-queue',
  async (job: Job) => {
    const { name, data, id } = job;
    try {
      if (name === 'schedule-account-deletion') {
        const { deleteAt, scheduleAt, userId } =
          data as IAccountDeletionJobPayload;
        await redisClient.del(`user:${userId}:delete-meta`);
        const user = await User.findById(userId);
        await Label.deleteMany({ createdBy: userId });
        await Contacts.deleteMany({ userId });
        await Activity.deleteMany({ user: userId });
        await Profile.deleteOne({ user: userId });
        await User.deleteOne({ _id: userId });
        const email = user?.email as string;
        const templateData = {
          name,
          deleteAt,
          scheduleAt,
          email,
          currentYear: 2025,
        };
        const template = Handlebars.compile(
          accountDeletionConfirmationEmailTemplate
        );
        const personalizedTemplate = template(templateData);
        await mailTransporter.sendMail(
          mailOption(
            email,
            'Your Workly Contacts Account Has Been Permanently Deleted',
            personalizedTemplate
          )
        );
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
