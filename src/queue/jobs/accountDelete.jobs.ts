import { IAccountDeletionJobPayload } from '@/modules/user/user.interfaces';
import { AccountDeleteQueue } from '@/queue/queues';
import ExtractMetaData from '@/utils/metaData.utils';

const { setAccountDeletionMetaData } = ExtractMetaData;

const AccountDeleteQueueJobs = {
  scheduleAccountDeletion: async ({
    scheduleAt,
    userId,
    deleteAt,
  }: IAccountDeletionJobPayload) => {
    const delay = new Date(deleteAt).getTime() - Date.now();
    const job = await AccountDeleteQueue.add(
      'schedule-account-deletion',
      { scheduleAt, userId, deleteAt } as IAccountDeletionJobPayload,
      {
        attempts: 3,
        removeOnComplete: true,
        backoff: { type: 'exponential', delay: 3000 },
        delay,
      }
    );
    await setAccountDeletionMetaData({
      deleteAt,
      jobId: job?.id as string,
      scheduleAt,
      userId,
    });
  },
};

export default AccountDeleteQueueJobs;
