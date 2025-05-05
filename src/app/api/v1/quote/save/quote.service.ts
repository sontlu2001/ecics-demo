import { PrismaClient } from '@prisma/client';
import { saveQuoteDTO } from './quote.dto';
import logger from '@/app/api/libs/logger';
import { generateQuoteEmail } from '@/app/api/libs/mailer/templates';
import { sendMail } from '@/app/api/libs/mailer';

const prisma = new PrismaClient();

export async function saveQuote(data: saveQuoteDTO) {
  const existingQuote = await prisma.quote.findFirst({
    where: {
      key: data.key,
    },
  });

  if (existingQuote) {
    logger.info(
      `Quote with ID ${existingQuote.id} found. Updating with new data: ${JSON.stringify(data)}`,
    );
    const updatedQuote = await prisma.quote.update({
      where: { id: existingQuote.id },
      data: {
        quote_no: data.quote_no,
        policy_id: data.policy_id,
        phone: data.phone,
        email: data.email,
        name: data.name,
        data: data.data,
        partner_code: data.partner_code,
        is_finalized: data.is_finalized ?? false,
        is_paid: data.is_paid ?? false,
        expiration_date: data.expiration_date
          ? new Date(data.expiration_date)
          : undefined,
        key: data.key,
        personal_info_id: data.personal_info_id,
        company_id: data.company_id,
        payment_result_id: data.payment_result_id,
        country_nationality_id: data.country_nationality_id,
        product_type_id: data.product_type_id,
        promo_code_id: data.promo_code_id,
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
        personal_info: {
          select: {
            id: true,
            phone: true,
            email: true,
            name: true,
            gender: true,
            nric: true,
            marital_status: true,
            date_of_birth: true,
            address: true,
            vehicle_make: true,
            vehicle_model: true,
            year_of_registration: true,
            vehicles: true,
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
          },
        },
      },
    });

    return {
      message: 'Quote updated successfully.',
      data: updatedQuote,
    };
  }

  // If the quote does not exist, create a new one
  logger.info(
    `Quote not found. Creating a new quote with data: ${JSON.stringify(data)}`,
  );
  const newQuote = await prisma.quote.create({
    data: {
      quote_id: data.quote_id,
      quote_no: data.quote_no,
      policy_id: data.policy_id,
      product_id: data.product_id,
      proposal_id: data.proposal_id,
      phone: data.phone,
      email: data.email,
      name: data.name,
      data: data.data,
      partner_code: data.partner_code,
      is_finalized: data.is_finalized ?? false,
      is_paid: data.is_paid ?? false,
      expiration_date: data.expiration_date
        ? new Date(data.expiration_date)
        : undefined,
      key: data.key,
      personal_info_id: data.personal_info_id,
      company_id: data.company_id,
      payment_result_id: data.payment_result_id,
      country_nationality_id: data.country_nationality_id,
      product_type_id: data.product_type_id,
      promo_code_id: data.promo_code_id,
    },
  });

  const retrieveQuoteHTML = generateQuoteEmail({
    quote_key: newQuote.key ?? '',
    name: newQuote.name ?? '',
  });
  sendMail({
    to: newQuote.email ?? '',
    subject: `ECICS Limited | Your Car Insurance Quotation <${newQuote.quote_no}>`,
    html: retrieveQuoteHTML,
  });

  return {
    message: 'Quote created successfully.',
    data: newQuote,
  };
}
