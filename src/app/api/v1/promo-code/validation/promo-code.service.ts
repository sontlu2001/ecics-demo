import { geInfoPromocodeDTO } from "./promo-code.dto";
import { prisma } from "@/app/api/libs/prisma";
import { PROMO_CODE_MESSAGES } from "./promo-code.constants";
import logger from "@/app/api/libs/logger";

export async function getInfoPromocode(data: geInfoPromocodeDTO) {
  const { promo_code, product_type } = data;

  const promoCode = await prisma.promocode.findUnique({
    select: {
      code: true,
      discount: true,
      startTime: true,
      endTime: true,
      description: true,
      products: true,
      isPublic: true,
      isShowCountdown: true,
    },
    where: {
      code: promo_code,
    }
  });
  logger.info(`Promo code ${promo_code} found with detail: ${JSON.stringify(promoCode)}`);

  if (!promoCode) {
    logger.info(`Promo code ${promo_code} not found`);
    return {
      message: PROMO_CODE_MESSAGES.NOT_FOUND,
      data: null,
    }
  }
  const currentTime = new Date();

  if (!promoCode.products.includes(product_type)) {
    logger.info(`Promo code ${promo_code} not valid for product type ${product_type}`);
    return createResponse(PROMO_CODE_MESSAGES.NOT_VALID_FOR_PRODUCT, promoCode, false);
  }

  if (!promoCode.isPublic) {
    logger.info(`Promo code ${promo_code} is not public`);
    return createResponse(PROMO_CODE_MESSAGES.NOT_VALID, promoCode, false);
  }

  if (promoCode.startTime > currentTime) {
    logger.info(`Promo code ${promo_code} not valid`);
    return createResponse(PROMO_CODE_MESSAGES.NOT_VALID, promoCode, false);
  }

  if (promoCode.endTime < currentTime) {
    logger.info(`Promo code ${promo_code} expired with end time ${promoCode.endTime} and current time ${currentTime}`);
    return createResponse(PROMO_CODE_MESSAGES.EXPIRED, promoCode, false);
  }

  logger.info(`Promo code ${promo_code} is valid with promo code detail: ${JSON.stringify(promoCode)}`);
  return createResponse(PROMO_CODE_MESSAGES.VALID, promoCode, true);
}

function createResponse(message: string, promoCode: any, isValid: boolean) {
  logger.info(`Creating response with message: ${message} and promo code: ${JSON.stringify(promoCode)}`);

  return {
    message,
    data: {
      ...promoCode,
      is_valid: isValid,
    },
  };
}
