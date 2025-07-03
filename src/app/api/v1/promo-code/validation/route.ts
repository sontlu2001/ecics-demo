import { NextRequest } from 'next/server';

import { successRes } from '@/app/api/core/success.response';
import { requestHandler } from '@/app/api/middleware/requestHandler';

import { getInfoPromoCodeSchema } from './promo-code.dto';
import { getInfoPromocode } from './promo-code.service';

export const POST = requestHandler(async (req: NextRequest) => {
  const body = await req.json();
  const data = getInfoPromoCodeSchema.parse(body);
  const result = await getInfoPromocode(data);

  return successRes(result);
});
