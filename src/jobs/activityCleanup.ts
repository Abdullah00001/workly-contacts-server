import logger from '@/configs/logger.configs';
import { Activity } from '@/modules/user/user.models';
import cron from 'node-cron';

cron.schedule('0 0 * * *', async () => {
  try {
    const now = new Date();
    const thresholdDate = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000);
    const { deletedCount } = await Activity.deleteMany({
      createdAt: { $lte: thresholdDate },
    });
    logger.info(`[activityCleanup] Deleted ${deletedCount} old activities.`);
  } catch (error) {
    if (error instanceof Error) {
      logger.error('[activityCleanup] Job failed:', error.message);
    }
    logger.error('[activityCleanup] Job failed: Due to unknown error');
  }
});
