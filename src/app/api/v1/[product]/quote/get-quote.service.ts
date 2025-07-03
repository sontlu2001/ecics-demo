import apiServer, { handleApiCallToISP } from '@/app/api/configs/api.config';
import { CAR_INSURANCE } from '@/app/api/constants/car.insurance';
import { MAID_INSURANCE } from '@/app/api/constants/maid.insurance';
import { PRODUCT_NAME } from '@/app/api/constants/product';
import { ErrBadRequest, ErrFromISPRes } from '@/app/api/core/error.response';
import { successRes } from '@/app/api/core/success.response';
import logger from '@/app/api/libs/logger';
import { prisma } from '@/app/api/libs/prisma';
import { convertDate } from '@/app/api/utils/date.helper';

import { formatCarQuoteInfo } from './format-car-quote-data';
import { formatMaidQuoteInfo } from './format-maid-quote.data';
import { generateQuoteDTO, generateQuoteForMaidDTO } from './get-quote.dto';

export async function getQuoteForCar(data: generateQuoteDTO) {
  try {
    logger.info(`Generating quote for car with data: ${JSON.stringify(data)}`);

    let promoCodeData = null;
    // Check if promo code is valid
    if (data.promo_code) {
      promoCodeData = await prisma.promocode.findFirst({
        where: {
          code: data.promo_code,
          products: {
            has: PRODUCT_NAME.CAR,
          },
        },
      });
      if (!promoCodeData) {
        return ErrBadRequest('Promo code not found');
      }
    }

    const productType = await prisma.productType.findFirst({
      where: { name: 'car' },
    });

    const payloadData = {
      product_id: process.env.PRODUCT_CAR_ID || '',
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
          personal_info: {
            ...(typeof quoteFound?.data === 'object' &&
            quoteFound?.data !== null &&
            'personal_info' in quoteFound.data
              ? (quoteFound.data as { personal_info?: any }).personal_info
              : {}),
            ...data.personal_info,
          },
          vehicle_info_selected: data.vehicle_info_selected,
          insurance_additional_info: data.insurance_additional_info,
        },
        partner_code: data?.partner_code || '',
        expiration_date: new Date(quoteResInfo.quote_expiry_date),
        key: data.key,
        promo_code_id: promoCodeData?.id || null,
        company_id: data?.company_id || null,
        company_name_other: data?.company_name_other || null,
        is_electric_model: quoteResInfo?.ev_model === 'YES' ? true : false,
        product_type_id: productType?.id || null,
        is_finalized: false,
      };

      if (quoteFound) {
        quoteInfo = await prisma.quote.update({
          where: { id: quoteFound.id },
          data: quoteData,
          omit: {
            quote_res_from_ISP: true,
            quote_finalize_from_ISP: true,
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
                name: true,
              },
            },
          },
        });
      } else {
        quoteInfo = await prisma.quote.create({
          data: quoteData,
          omit: {
            quote_res_from_ISP: true,
            quote_finalize_from_ISP: true,
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
                name: true,
              },
            },
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

export async function getQuouteForMaid(data: generateQuoteForMaidDTO) {
  try {
    logger.info(`Generating quote for maid with data: ${JSON.stringify(data)}`);

    const [quote_start_day, quote_start_month, quote_start_year] = convertDate(
      data.start_date,
    );

    const [quote_maid_dob_day, quote_maid_dob_month, quote_maid_dob_year] =
      convertDate(data.maid_info.date_of_birth);

    const payloadData = {
      product_id: process.env.PRODUCT_MAID_ID || '',
      quote_maid_type: data.maid_type,
      quote_plan_period: data.plan_period,
      quote_start_day: quote_start_day,
      quote_start_month: quote_start_month,
      quote_start_year: quote_start_year,
      quote_maid_dob_day: quote_maid_dob_day,
      quote_maid_dob_month: quote_maid_dob_month,
      quote_maid_dob_year: quote_maid_dob_year,
      quote_maid_nationality: data.maid_info.nationality,
      quote_email: data.personal_info.email,
      quote_contact_no: data.personal_info.phone,
      quote_promo_code: data.promo_code || '',
      partner_code: data.partner_code || '',
    };

    const getQuoteRes = await handleApiCallToISP(
      `${MAID_INSURANCE.PREFIX_ENDPOINT}/quote`,
      payloadData,
    );
    logger.info(
      `Response from generate quote for maid: ${JSON.stringify(getQuoteRes)}`,
    );

    if (getQuoteRes.status === 0) {
      const quoteInfoRes = getQuoteRes.data;
      const planMaidData = await formatMaidQuoteInfo(quoteInfoRes, data);
      logger.info(`Formatted quote data: ${JSON.stringify(planMaidData)}`);

      const [productType, quoteFound, promoCodeInfo] = await Promise.all([
        prisma.productType.findFirst({
          where: { name: PRODUCT_NAME.MAID },
        }),
        prisma.quote.findFirst({
          where: {
            key: data.key,
          },
        }),
        prisma.promocode.findFirst({
          where: {
            code: data.promo_code,
            products: {
              has: PRODUCT_NAME.MAID,
            },
          },
        }),
      ]);

      logger.info(`Product info: ${JSON.stringify(productType)}`);
      logger.info(`Quote info: ${JSON.stringify(quoteFound)}`);
      logger.info(`Promo code info: ${JSON.stringify(promoCodeInfo)}`);

      let quoteInfo = null;
      const quoteData = {
        quote_id: quoteInfoRes.quote.quote_id,
        quote_no: quoteInfoRes.quote.quote_no,
        policy_id: quoteInfoRes.quote.policy_id,
        product_id: quoteInfoRes.quote.product_id,
        proposal_id: quoteInfoRes.quote.proposal_id,
        phone: data.personal_info.phone,
        email: data.personal_info.email,
        name: data.personal_info?.name || '',
        quote_res_from_ISP: getQuoteRes,
        data: {
          plans: planMaidData,
          personal_info: {
            ...(typeof quoteFound?.data === 'object' &&
            quoteFound?.data !== null &&
            'personal_info' in quoteFound.data
              ? (quoteFound.data as { personal_info?: any }).personal_info
              : {}),
            ...data.personal_info,
          },
          maid_info: {
            ...data.maid_info,
          },
          insurance_other_info: {
            maid_type: data.maid_type,
            plan_period: data.plan_period,
            start_date: data.start_date,
            end_date: data.end_date,
          },
        },
        partner_code: data?.partner_code || '',
        expiration_date: new Date(quoteInfoRes.quote.quote_expiry_date),
        key: data.key,
        promo_code_id: promoCodeInfo?.id || null,
        product_type_id: productType?.id || null,
        is_finalized: false,
      };

      if (quoteFound) {
        quoteInfo = await prisma.quote.update({
          where: { id: quoteFound.id },
          data: quoteData,
          omit: {
            quote_res_from_ISP: true,
            quote_finalize_from_ISP: true,
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
          },
        });
      } else {
        quoteInfo = await prisma.quote.create({
          data: quoteData,
          omit: {
            quote_res_from_ISP: true,
            quote_finalize_from_ISP: true,
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
          },
        });
      }

      logger.info(`Quote generated successfully: ${JSON.stringify(quoteInfo)}`);
      return successRes({
        data: quoteInfo,
        message: 'Quote generated successfully',
      });
    }

    return ErrFromISPRes(getQuoteRes?.txt || 'Error generate quote for maid');
  } catch (error) {
    logger.error(`Error generate quote for maid: ${error}`);
    throw new Error('Error generate quote for maid');
  }
}
