import { NextRequest } from 'next/server';
import logger from '../../libs/logger';
import { schedule } from 'node-cron';
import { handleQuoteReminder } from './quote-reminder.service';
import { successRes } from '../../core/success.response';

export const POST = async (req: NextRequest) => {
  schedule(process.env.QUOTE_REMINDER_CRON || '', async () => {
    await handleQuoteReminder();
  });

  logger.info('Quote reminder job scheduled successfully');
  return successRes({
    data: '',
    message: 'Job initialized successfully',
  });
};
