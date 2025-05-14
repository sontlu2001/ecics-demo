import logger from '@/app/api/libs/logger';
import { generateQuoteDTO } from './get-quote.dto';
import { PRODUCT_ID, PRODUCT_NAME } from '@/app/api/constants/product';
import apiServer from '@/app/api/configs/api.config';
import { successRes } from '@/app/api/core/success.response';
import { formatCarQuoteInfo } from './format-car-quote-data';
import { ErrBadRequest, ErrFromISPRes } from '@/app/api/core/error.response';
import { prisma } from '@/app/api/libs/prisma';
import { CAR_INSURANCE } from '@/app/api/constants/car.insurance';

export async function getQuoteForCar(data: generateQuoteDTO) {
  try {
    logger.info(`Generating quote for car with data: ${JSON.stringify(data)}`);

    let promoCodeData = null;
    // Check if promo code is valid
    if (data.promo_code) {
      promoCodeData = await prisma.promocode.findUnique({
        where: {
          code: data.promo_code,
        },
      });
      if (!promoCodeData) {
        return ErrBadRequest('Promo code not found');
      }
    }

    const payloadData = {
      product_id: PRODUCT_ID.CAR,
      quick_quote_make: data.vehicle_info_selected.vehicle_make,
      quick_quote_model: data.vehicle_info_selected.vehicle_model,
      quick_quote_reg_yyyy: data.vehicle_info_selected.first_registered_year,
      quick_quote_owner_dob: data.personal_info.date_of_birth,
      quick_quote_owner_drv_exp:
        data.personal_info.driving_experience.toString(),
      quick_quote_owner_ncd: `${data.insurance_additional_info.no_claim_discount.toString()}%`,
      quick_quote_owner_no_of_claims:
        data.insurance_additional_info.no_of_claim.toString(),
      quick_proposal_start_date: data.insurance_additional_info.start_date,
      quick_proposal_end_date: data.insurance_additional_info.end_date,
      quick_quote_mobile: data.personal_info.phone,
      quick_quote_email: data.personal_info.email,
      quick_proposal_promo_code: data.promo_code || '',
      partner_code: data.partner_code || '',
    };
    logger.info(`Payload for generate quote: ${JSON.stringify(payloadData)}`);

    // Call the API to generate quote
    const response = await apiServer.post(
      `${CAR_INSURANCE.PREFIX_ENDPOINT}/quote`,
      payloadData,
    );
    logger.info(
      `Response from generate quote: ${JSON.stringify(response.data)}`,
    );

    if (response.data.status === 0) {
      const quoteResInfo = response.data.data;
      const planData = await formatCarQuoteInfo(quoteResInfo, data);

      logger.info(`Formatted quote data: ${JSON.stringify(planData)}`);

      const quoteFound = await prisma.quote.findFirst({
        where: {
          key: data.key,
        },
      });

      let quoteInfo = null;
      const quoteData = {
        quote_id: quoteResInfo.quote_id,
        quote_no: quoteResInfo.quote_no,
        policy_id: quoteResInfo.policy_id,
        product_id: quoteResInfo.product_id,
        proposal_id: quoteResInfo.proposal_id,
        phone: data.personal_info.phone,
        email: data.personal_info.email,
        name: data.personal_info.name,
        quote_res_from_ISP: quoteResInfo,
        data: {
          ...(quoteFound?.data && typeof quoteFound.data === 'object'
            ? quoteFound.data
            : {}),
          plans: planData,
          personal_info: data.personal_info,
          vehicle_info_selected: data.vehicle_info_selected,
          insurance_additional_info: data.insurance_additional_info,
        },
        partner_code: data?.partner_code || '',
        expiration_date: new Date(quoteResInfo.quote_expiry_date),
        key: data.key,
        promo_code_id: promoCodeData?.id || null,
        company_id: data?.company_id || null,
      };

      if (quoteFound) {
        quoteInfo = await prisma.quote.update({
          where: { id: quoteFound.id },
          data: quoteData,
          omit: {
            quote_res_from_ISP: true,
          },
        });
      } else {
        quoteInfo = await prisma.quote.create({
          data: quoteData,
          omit: {
            quote_res_from_ISP: true,
          },
        });
      }

      return successRes({
        data: quoteInfo,
        message: 'Quote generated successfully',
      });
    }

    return ErrFromISPRes(response?.data?.txt || 'Error generating quote');
  } catch (error) {
    logger.error(`Error generate quote: ${error}`);
    throw new Error('Error generate quote');
  }
}
