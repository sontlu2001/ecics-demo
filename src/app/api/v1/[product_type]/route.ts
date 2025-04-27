import { NextRequest } from 'next/server';
import { successRes } from '@/app/api/core/success.response';
import { handleDetectIPAdress } from './quote.service';
import logger from '@/app/api/libs/logger';

export const GET = async (
  req: NextRequest,
  context: { params: { product_type: string } },
) => {
  const forwardedIP = req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip') || req.headers.get('x-real-ip') || "";
  logger.info(`Received request to get IP address: ${forwardedIP}`);

  await handleDetectIPAdress(forwardedIP, context.params.product_type);
  return successRes({
      data:null,
      message: 'Request logged successfully',
    });
};
