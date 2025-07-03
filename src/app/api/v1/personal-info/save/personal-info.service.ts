import { prisma } from '@/app/api/libs/prisma';
import { savePersonalInfoDTO } from './personal-info.dto';
import logger from '@/app/api/libs/logger';
import { sendMail } from '@/app/api/libs/mailer';
import { generateQuoteEmail } from '@/app/api/libs/mailer/templates';
import { ErrBadRequest } from '@/app/api/core/error.response';
import { capitalizeFirstLetter } from '@/app/api/utils/text.helpers';

export async function savePersonalInfo(data: savePersonalInfoDTO) {
  try {
    const existingQuoteInfo = await prisma.quote.findFirst({
      where: {
        key: data.key,
      },
    });

    if (existingQuoteInfo) {
      logger.info(`Quote info with key ${data.key} already exists`);
      return {
        message: 'Quote info already exists.',
        data: null,
      };
    }

    const newQuoteInfo: any = {
      key: data.key,
      data: {
        personal_info: data.personal_info,
        vehicle_info_selected: data?.vehicle_info_selected || null,
        vehicles: data?.vehicles || null,
        data_from_singpass: data.data_from_singpass,
        current_step: 0,
      },
      is_sending_email: data.is_sending_email ? true : false,
      partner_code: data.partner_code || '',
    };

    const [product_type, promoCodeInfo] = await Promise.all([
      prisma.productType.findFirst({
        where: { name: data.product_type },
      }),
      prisma.promocode.findFirst({
        where: {
          code: data?.promo_code || '',
          products: {
            has: data.product_type,
          },
        },
      }),
    ]);

    const newQuote = await prisma.quote.create({
      data: {
        key: data.key,
        phone: data.personal_info.phone,
        email: data.personal_info.email,
        name: data.personal_info?.name || '',
        data: {
          personal_info: data.personal_info,
          vehicle_info_selected: data?.vehicle_info_selected,
          vehicles: data?.vehicles,
          data_from_singpass: data.data_from_singpass,
          current_step: 0,
        },
        is_sending_email: data.is_sending_email ? true : false,
        partner_code: data.partner_code || '',
        promo_code: promoCodeInfo
          ? {
              connect: { id: promoCodeInfo.id },
            }
          : undefined,
        product_type: product_type
          ? {
              connect: { id: product_type.id },
            }
          : undefined,
      },
      include: {
        promo_code: true,
        product_type: true,
      },
    });
    logger.info(`Creating a new quote info: ${JSON.stringify(newQuote)}`);

    if (data.is_sending_email) {
      const retrieveQuoteHTML = generateQuoteEmail({
        quote_key: newQuote.key ?? '',
        product_name: newQuote?.product_type?.name ?? '',
      });

      sendMail({
        to: data.personal_info.email ?? '',
        subject: `ECICS Limited | Your ${capitalizeFirstLetter(newQuote?.product_type?.name || '')} Insurance Purchase Journey`,
        html: retrieveQuoteHTML,
      });
    }

    return {
      message: 'Personal info saved successfully.',
      data: {
        ...data,
        key: newQuote.key,
      },
    };
  } catch (error) {
    logger.error(`Error saving personal info: ${error}`);
    throw new Error('Failed to save personal info.');
  }
}
