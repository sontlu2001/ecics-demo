import cron from 'node-cron';

import logger from '../logger';

export const schedule = (cronTime: string, task: () => void) => {
  try {
    cron.schedule(cronTime, task, {
      scheduled: true,
    });
    logger.info(`✅ Scheduled task at ${cronTime}`);
  } catch (error) {
    logger.error('❌ Error scheduling task:', error);
  }
};
