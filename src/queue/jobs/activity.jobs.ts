import { IActivityPayload } from '@/modules/user/user.interfaces';
import { EmailQueue } from '@/queue/queues';

const ActivityQueueJobs = {
  loginFailedActivitySavedInDb: async (data: IActivityPayload) => {
    await EmailQueue.add('save-activity-to-db', data, {
      attempts: 3,
      removeOnComplete: true,
      backoff: { type: 'exponential', delay: 3000 },
    });
  },
};

export default ActivityQueueJobs;
