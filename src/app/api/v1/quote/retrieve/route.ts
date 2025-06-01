import { requestHandler } from '@/app/api/middleware/requestHandler';
import { NextRequest } from 'next/server';
import { retrieveQuoteDTOSchema } from './retrieve-quote.dto';
import { successRes } from '@/app/api/core/success.response';
import { retrieveQuote } from './retrieve-quote.service';

export const POST = requestHandler(async (req: NextRequest) => {
  const body = await req.json();
  const data = retrieveQuoteDTOSchema.parse(body);
  const result = await retrieveQuote(data);

  return successRes(result);
});
