import cron from 'node-cron';
import logger from '@/configs/logger.configs';
import User from '@/modules/user/user.models';
import Profile from '@/modules/profile/profile.models';
import { startSession } from 'mongoose';

cron.schedule('0 0 * * *', async () => {
  const session = await startSession();
  session.startTransaction();
  try {
    const now = new Date();
    const thresholdDate = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);
    const users = await User.find(
      {
        isVerified: false,
        createdAt: { $lte: thresholdDate },
      },
      '_id',
      { session }
    );
    const userIds = users.map((user) => user._id);
    if (userIds.length > 0) {
      const { deletedCount } = await User.deleteMany(
        {
          _id: { $in: userIds },
        },
        { session }
      );
      await Profile.deleteMany({ user: { $in: userIds } }, { session });
      logger.info(
        `[unverified user cleanup] Deleted ${deletedCount} users and their profiles`
      );
    } else {
      logger.info(`[unverified user cleanup] No unverified users to delete.`);
    }
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();

    if (error instanceof Error) {
      logger.error('[unverified user cleanup] Job failed:', error.message);
    } else {
      logger.error(
        '[unverified user cleanup] Job failed: Due to unknown error'
      );
    }
  } finally {
    session.endSession();
  }
});
