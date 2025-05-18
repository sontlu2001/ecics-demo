import { NextRequest } from 'next/server';
import { successRes } from '../../core/success.response';
import logger from '../../libs/logger';

export async function POST(req: NextRequest) {
  logger.info('Processing payment result...');
  const rawBody = await req.text();

  const params = new URLSearchParams(rawBody);
  logger.info(`Received payment result params: ${params.toString()}`);


  return successRes({
    message: 'Payment result processed successfully',
    data: params,
  });
}
