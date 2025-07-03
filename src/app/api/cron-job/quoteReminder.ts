import { schedule } from 'node-cron';
import logger from '../libs/logger';
import { sendMail } from '../libs/mailer';
import { quoteReminderHTML } from '../libs/mailer/templates';
import { prisma } from '../libs/prisma';

schedule(process.env.QUOTE_REMINDER_CRON || '', async () => {
  const quotes = await prisma.quote.findMany({
    where: {
      expiration_date: {
        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Get the date 7 days ago
        lt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Get the date 7 days from now
      },
      is_paid: false,
    },
    select: {
      quote_id: true,
      quote_no: true,
      product_type: {
        select: {
          name: true,
        },
      },
      name: true,
      email: true,
    },
  });

  logger.info(`Quotes to be sent: ${JSON.stringify(quotes)}`);

  // sending email to each quote
  for (const quote of quotes) {
    logger.info(
      `Send mail by cron tasks with quote data: ${JSON.stringify(quote)}`,
    );
    await sendingQuoteReminder(
      quote.quote_id,
      quote.quote_no,
      quote.product_type,
      quote.name,
      quote.email,
    );
  }
});

function sendingQuoteReminder(
  quoteId: any,
  quoteNo: any,
  productType: any,
  name: any,
  email: any,
) {
  sendMail({
    to: email ?? '',
    subject: `ECICS Limited | Your ${productType} Insurance Quotation <${quoteNo}>`,
    html: quoteReminderHTML(quoteId, quoteNo, productType, name, email),
  });
}
