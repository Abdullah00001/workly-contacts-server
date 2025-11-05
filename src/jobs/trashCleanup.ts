import logger from '@/configs/logger.configs';
import Contacts from '@/modules/contacts/contacts.models';
import cron from 'node-cron';

cron.schedule('0 0 * * *', async () => {
  try {
    const now = new Date();
    const thresholdDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const { deletedCount } = await Contacts.deleteMany({
      isTrashed: true,
      trashedAt: { $lte: thresholdDate },
    });
    logger.info(`[trashCleanup] Deleted ${deletedCount} old trashed contacts.`);
  } catch (error) {
    if (error instanceof Error) {
      logger.error('[trashCleanup] Job failed:', error.message);
    }
    logger.error('[trashCleanup] Job failed: Due to unknown error');
  }
});
