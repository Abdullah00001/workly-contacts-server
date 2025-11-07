import { AvatarUploadQueue } from '@/queue/queues';
import { Types } from 'mongoose';

export type TAvatarUploadJob = {
  userId: Types.ObjectId;
  url: string;
};

const AvatarUploadQueueJob = async (data: TAvatarUploadJob) => {
  await AvatarUploadQueue.add('profile-avatar-upload', data, {
    attempts: 3,
    removeOnComplete: true,
    backoff: { type: 'exponential', delay: 3000 },
  });
};

export default AvatarUploadQueueJob;
