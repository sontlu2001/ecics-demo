import { NextRequest } from 'next/server';
import { successRes } from '../../core/success.response';
import { paymentResultDTOSchema } from './payment-result.dto';
import { handlePaymentResult } from './payment-result.service';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const data = paymentResultDTOSchema.parse(body);
  const result = await handlePaymentResult(data);

  return successRes({
    message: 'Payment result processed successfully',
    data: result,
  });
}
