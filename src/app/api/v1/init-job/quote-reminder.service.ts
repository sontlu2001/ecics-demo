import logger from '../../libs/logger';
import { sendMail } from '../../libs/mailer';
import { quoteReminderHTML } from '../../libs/mailer/templates';
import { prisma } from '../../libs/prisma';
import { capitalizeFirstLetter } from '../../utils/text.helpers';

export async function handleQuoteReminder() {
  try {
    const quotes = await prisma.$queryRaw`
    SELECT q.key, q.quote_no, pt.name AS product_type, q.name, q.email
    FROM quote q
    JOIN product_type pt ON q.product_type_id = pt.id
    WHERE q.expiration_date::date - q.created_at::date > 7
      AND q.expiration_date::date - CURRENT_DATE = 7
      AND q.is_paid = false
    `;

    logger.info(`Quotes to be sent: ${JSON.stringify(quotes)}`);

    for (const quote of quotes as any[]) {
      logger.info(
        `Send mail quote reminder by cron tasks with quote data: ${JSON.stringify(quote)}`,
      );
      await sendMail({
        to: quote.email ?? '',
        subject: `ECICS Limited | Your ${capitalizeFirstLetter(quote.product_type)} Insurance Quotation <${quote.quote_no}>`,
        html: quoteReminderHTML(
          quote.key,
          quote.quote_no,
          quote.product_type,
          quote.name,
        ),
      });
    }
  } catch (error) {
    logger.error(`Failed to initialize job: ${error}`);
    throw new Error(`Failed to initialize job: ${error}`);
  }
}
