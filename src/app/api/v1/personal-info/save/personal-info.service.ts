import { prisma } from '@/app/api/libs/prisma';
import { savePersonalInfoDTO } from './personal-info.dto';
import logger from '@/app/api/libs/logger';
import { sendMail } from '@/app/api/libs/mailer';
import { generateQuoteEmail } from '@/app/api/libs/mailer/templates';

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

    const newPersonalInfo = await prisma.personalInfo.create({
      data: {
        email: data.personal_info.email,
        phone: data.personal_info.phone,
        name: data.personal_info.name,
        nric: data.personal_info.nric,
        gender: data.personal_info.gender,
        marital_status: data.personal_info.marital_status,
        date_of_birth: data.personal_info.date_of_birth,
        address: data.personal_info.address,
        year_of_registration: data.vehicle_info_selected.year_of_registration,
        vehicles: data.vehicles ?? [],
      },
    });
    logger.info(
      `Creating a new personal info: ${JSON.stringify(newPersonalInfo)}`,
    );

    const newQuoteInfo: any = {
      key: data.key,
      data: {
        personal_info: data.personal_info,
        vehicle_info_selected: data.vehicle_info_selected,
        vehicles: data.vehicles,
        current_step: 0,
      },
      is_sending_email: data.is_sending_email ? true : false,
      partner_code: data.partner_code || '',
    };

    if (data.promo_code) {
      newQuoteInfo.promo_code = {
        connect: {
          code: data.promo_code,
        },
      };
    }

    const newQuote = await prisma.quote.create({ data: newQuoteInfo });
    logger.info(`Creating a new quote info: ${JSON.stringify(newQuote)}`);

    if (data.is_sending_email) {
      const retrieveQuoteHTML = generateQuoteEmail({
        quote_key: newQuote.key ?? '',
      });

      sendMail({
        to: newPersonalInfo.email ?? '',
        subject: `ECICS Limited | Your Car Insurance Purchase Journey`,
        html: retrieveQuoteHTML,
      });
    }

    return {
      message: 'Personal info created successfully.',
      data: {
        ...newPersonalInfo,
        key: newQuote.key,
      },
    };
  } catch (error) {
    logger.error(`Error saving personal info: ${error}`);
    throw new Error('Failed to save personal info.');
  }
}
