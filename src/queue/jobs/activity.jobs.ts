import { IActivityPayload } from '@/modules/user/user.interfaces';
import { ActivityQueue } from '@/queue/queues';

const ActivityQueueJobs = {
  loginFailedActivitySavedInDb: async (data: IActivityPayload) => {
    await ActivityQueue.add('save-login-failed-activity-to-db', data, {
      attempts: 3,
      removeOnComplete: true,
      backoff: { type: 'exponential', delay: 3000 },
    });
  },
  loginSuccessActivitySavedInDb: async (data: IActivityPayload) => {
    await ActivityQueue.add('save-login-activity-to-db', data, {
      attempts: 3,
      removeOnComplete: true,
      backoff: { type: 'exponential', delay: 3000 },
    });
  },
  signupSuccessActivitySavedInDb: async (data: IActivityPayload) => {
    await ActivityQueue.add('save-signup-activity-to-db', data, {
      attempts: 3,
      removeOnComplete: true,
      backoff: { type: 'exponential', delay: 3000 },
    });
  },
  accountLockActivitySavedInDb: async (data: IActivityPayload) => {
    await ActivityQueue.add('save-account-lock-activity-to-db', data, {
      attempts: 3,
      removeOnComplete: true,
      backoff: { type: 'exponential', delay: 3000 },
    });
  },
  accountUnlockActivitySavedInDb: async (data: IActivityPayload) => {
    await ActivityQueue.add('save-account-unlock-activity-to-db', data, {
      attempts: 3,
      removeOnComplete: true,
      backoff: { type: 'exponential', delay: 3000 },
    });
  },
  passwordResetActivitySavedInDb: async (data: IActivityPayload) => {
    await ActivityQueue.add(
      'save-account-password-reset-activity-to-db',
      data,
      {
        attempts: 3,
        removeOnComplete: true,
        backoff: { type: 'exponential', delay: 3000 },
      }
    );
  },
};

export default ActivityQueueJobs;
