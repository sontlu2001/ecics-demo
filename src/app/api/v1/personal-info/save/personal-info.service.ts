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
        email: data.email,
        phone: data.phone,
        name: data.name,
        nric: data.nric,
        gender: data.gender,
        marital_status: data.marital_status,
        date_of_birth: data.date_of_birth,
        address: data.address,
        vehicle_make: data.vehicle_make,
        vehicle_model: data.vehicle_model,
        year_of_registration: data.year_of_registration,
        vehicles: data.vehicles ?? [],
      },
    });
    logger.info(
      `Creating a new personal info: ${JSON.stringify(newPersonalInfo)}`,
    );

    const newQuote = await prisma.quote.create({
      data: {
        key: data.key,
        personal_info_id: newPersonalInfo.id,
      },
    });
    logger.info(`Creating a new quote info: ${JSON.stringify(newQuote)}`);

    const retrieveQuoteHTML = generateQuoteEmail({
      name: newPersonalInfo.name ?? '',
      quote_key: newQuote.key ?? '',
    });

    sendMail({
      to: newPersonalInfo.email ?? '',
      subject: `ECICS Limited |`,
      html: retrieveQuoteHTML,
    });

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
