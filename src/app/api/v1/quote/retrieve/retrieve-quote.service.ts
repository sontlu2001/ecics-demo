import { prisma } from '@/app/api/libs/prisma';
import { retrieveQuoteDTO } from './retrieve-quote.dto';
import logger from '@/app/api/libs/logger';

export async function retrieveQuote(data: retrieveQuoteDTO) {
  logger.info(`Quote retrieved with key ${data.key} and phone ${data.phone}`);

  const quoteInfo = await prisma.quote.findFirst({
    where: {
      key: data.key,
      phone: data.phone,
    },
    include: {
      promo_code: {
        select: {
          code: true,
          discount: true,
          start_time: true,
          end_time: true,
          description: true,
          products: true,
          is_public: true,
          is_show_count_down: true,
        },
      },
      company: {
        select: {
          id: true,
          name: true,
        },
      },
      country_nationality: {
        select: {
          id: true,
          name: true,
        },
      },
      product_type: {
        select: {
          id: true,
          name: true,
          documents: true,
        },
      },
    },
    omit: {
      quote_res_from_ISP: true,
      quote_finalize_from_ISP: true,
    },
  });
  logger.info(`Quote info retrieved: ${JSON.stringify(quoteInfo)}`);

  if (!quoteInfo) {
    return {
      message: 'Quote info invalid',
      data: null,
    };
  }

  if (quoteInfo.expiration_date) {
    const now = new Date();
    (quoteInfo as any).is_expired = quoteInfo.expiration_date < now;
  }

  return {
    message: 'Quote retrieved successfully',
    data: quoteInfo,
  };
}
