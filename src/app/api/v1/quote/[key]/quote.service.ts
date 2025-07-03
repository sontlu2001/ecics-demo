import { PrismaClient } from '@prisma/client';
import logger from '@/app/api/libs/logger';

const prisma = new PrismaClient();

export async function getQuoteByKey(key: string) {
  try {
    const quote = await prisma.quote.findFirst({
      where: {
        key,
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

    if (!quote) {
      logger.info(`Quote with key ${key} not found`);
      return {
        message: 'Quote not found',
        data: null,
      };
    }

    logger.info(`Quote with key ${key} found: ${JSON.stringify(quote)}`);

    // Remove quoteResFromISP in response before returning to the client
    if (
      quote?.data &&
      typeof quote.data === 'object' &&
      'quoteResFromISP' in quote.data
    ) {
      delete quote.data.quoteResFromISP;
    }

    if (quote.product_type && quote.product_type.documents) {
      if (
        !quote.is_electric_model &&
        Array.isArray(quote.product_type.documents)
      ) {
        quote.product_type.documents = quote.product_type.documents.filter(
          (doc: any) => doc.isEVModel === false,
        );
      }
    }

    return {
      message: 'Quote found',
      data: quote,
    };
  } catch (error) {
    logger.error(`Error occurred while getting quote by key: ${error}`);
    return {
      message: 'Internal server error',
      data: null,
    };
  }
}
