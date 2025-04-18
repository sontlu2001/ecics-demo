import { geInfoPromocodeDTO } from "./promo-code.dto";
import { prisma } from "@/app/api/libs/prisma";
import { NotFoundError } from "@/app/api/core/error.response";
import { PROMO_CODE_MESSAGES } from "./promo-code.constants";
import { PromoCode } from "../../../../../../interfaces/promo-code";

export async function getInfoPromocode(data: geInfoPromocodeDTO) {
  const { promo_code, product_type } = data;

  const promoCode = await prisma.promocode.findUnique({
    select: {
      code: true,
      discount: true,
      start_time: true,
      end_time: true,
      description: true,
      products: true,
      is_public: true,
      is_show_countdown: true,
    },
    where: {
      code: promo_code,
    }
  });

  if (!promoCode) {
    return {
      message: PROMO_CODE_MESSAGES.NOT_FOUND,
      data: null,
    }
  }
  const currentTime = new Date();

  if (!promoCode.products.includes(product_type)) {
    return createResponse(PROMO_CODE_MESSAGES.NOT_VALID_FOR_PRODUCT, promoCode, false);
  }

  if (!promoCode.is_public) {
    return createResponse(PROMO_CODE_MESSAGES.NOT_VALID, promoCode, false);
  }

  if (promoCode.start_time > currentTime) {
    return createResponse(PROMO_CODE_MESSAGES.NOT_VALID, promoCode, false);
  }

  if (promoCode.end_time < currentTime) {
    return createResponse(PROMO_CODE_MESSAGES.EXPIRED, promoCode, false);
  }

  return createResponse(PROMO_CODE_MESSAGES.VALID, promoCode, true);
}


function createResponse(message: string, promoCode: any, isValid: boolean) {
  return {
    message,
    data: {
      ...promoCode,
      is_valid: isValid,
    },
  };
}
