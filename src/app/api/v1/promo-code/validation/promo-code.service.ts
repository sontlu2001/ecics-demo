import { geInfoPromocodeDTO } from "./promo-code.dto";
import { prisma } from "@/app/api/libs/prisma";
import { NotFoundError } from "@/app/api/core/error.response";

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

  if(!promoCode) {
    throw new NotFoundError('Promo code not found');
  }

  if (!promoCode.products.includes(product_type)) {
    return {
      ...promoCode,
      is_valid: false,
    }
  }


  return promoCode;
}
