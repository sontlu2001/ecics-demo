import logger from '@/app/api/libs/logger';
import { generateQuoteDTO } from './get-quote.dto';
import { PRODUCT_ID, PRODUCT_NAME } from '@/app/api/constants/product';
import apiServer from '@/app/api/configs/api.config';
import { successRes } from '@/app/api/core/success.response';
import { formatCarQuoteInfo } from './format-car-quote-data';

export async function getQuoteForCar(data: generateQuoteDTO) {
  try {
    const payloadData = {
      product_id: PRODUCT_ID.CAR,
      quick_quote_make: data.vehicle_basic_details.make,
      quick_quote_model: data.vehicle_basic_details.model,
      quick_quote_reg_yyyy: data.vehicle_basic_details.first_registered_year,
      quick_quote_owner_dob: data.personal_info.date_of_birth,
      quick_quote_owner_drv_exp:
        data.personal_info.driving_experience.toString(),
      quick_quote_owner_ncd: `${data.insurance_additional_info.no_claim_discount.toString()}%`,
      quick_quote_owner_no_of_claims:
        data.insurance_additional_info.no_of_claim.toString(),
      quick_proposal_start_date: data.insurance_additional_info.start_date,
      quick_proposal_end_date: data.insurance_additional_info.end_date,
      quick_quote_mobile: data.personal_info.phone_number,
      quick_quote_email: data.personal_info.email,
      quick_proposal_promo_code: data.promo_code || '',
      partner_code: data.partner_code || '',
    };
    logger.info(`Payload for generate quote: ${JSON.stringify(payloadData)}`);
    const response = await apiServer.post('/b2c/quote', payloadData);
    logger.info(
      `Response from generate quote: ${JSON.stringify(response.data)}`,
    );

    if (response.data.status === 0) {
      const quoteResInfo = response.data.data;
      const responseData = formatCarQuoteInfo(quoteResInfo, data);
      return successRes({
        data: responseData,
        message: 'Quote generated successfully',
      });
    }

    return successRes({
      data: null,
      message: response?.data?.txt || 'Error generating quote',
    });
  } catch (error) {
    logger.error(`Error generate quote: ${error}`);
    throw new Error('Error generate quote');
  }
}
