import { schedule } from 'node-cron';
import logger from '../libs/logger';
import { sendMail } from '../libs/mailer';
import { quoteReminderHTML } from '../libs/mailer/templates';
import { prisma } from '../libs/prisma';

schedule(process.env.QUOTE_REMINDER_CRON || '', async () => {
  const quotes = await prisma.quote.findMany({
    where: {
      expirationDate: {
        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Get the date 7 days ago
        lt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Get the date 7 days from now
      },
      isPaid: false,
    },
    select: {
      quoteId: true,
      quoteNo: true,
      productType: {
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
      quote.quoteId,
      quote.quoteNo,
      quote.productType,
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
