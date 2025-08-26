import { IActivityPayload } from '@/modules/user/user.interfaces';
import { ActivityQueue } from '@/queue/queues';

const ActivityQueueJobs = {
  loginFailedActivitySavedInDb: async (data: IActivityPayload) => {
    await ActivityQueue.add('save-activity-to-db', data, {
      attempts: 3,
      removeOnComplete: true,
      backoff: { type: 'exponential', delay: 3000 },
    });
  },
  loginSuccessActivitySavedInDb: async () => {},
  signupSuccessActivitySavedInDb: async (data: IActivityPayload) => {
    await ActivityQueue.add('save-signup-activity-to-db', data, {
      attempts: 3,
      removeOnComplete: true,
      backoff: { type: 'exponential', delay: 3000 },
    });
  },
};

export default ActivityQueueJobs;
