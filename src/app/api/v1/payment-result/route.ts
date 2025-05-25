import { NextRequest } from 'next/server';
import { successRes } from '../../core/success.response';
import { paymentResultDTOSchema } from './payment-result.dto';
import { handlePaymentResult } from './payment-result.service';
import logger from '../../libs/logger';

export async function POST(req: NextRequest) {
  logger.info('Callback payment result...');
  const rawBody = await req.text();

  const params = new URLSearchParams(rawBody);
  logger.info(`Received payment result params: ${params.toString()}`);

  const body: Record<string, string> = {};
  params.forEach((value, key) => {
    body[key] = value;
  });

  logger.info(`Parsed payment result body: ${JSON.stringify(body)}`);

  const data = paymentResultDTOSchema.parse(body);
  const result = await handlePaymentResult(data);

  return successRes({
    message: 'Payment result processed successfully',
    data: result,
  });
}
