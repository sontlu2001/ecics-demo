import { NextRequest, NextResponse } from 'next/server';

import { PRODUCT_NAME } from '@/app/api/constants/product';
import logger from '@/app/api/libs/logger';

import { getQuoteForCar, getQuouteForMaid } from './get-quote.service';

export async function POST(
  req: NextRequest,
  context: { params: { product: string } },
) {
  const body = await req.json();
  const productName = context.params.product;
  logger.info(
    `Received request generate quote: ${productName} with body: ${JSON.stringify(body)}`,
  );

  switch (productName) {
    case PRODUCT_NAME.CAR:
      return getQuoteForCar(body);
    case PRODUCT_NAME.MAID:
      return getQuouteForMaid(body);
    default:
      return NextResponse.json(
        { error: 'Unsupported product' },
        { status: 400 },
      );
  }
}
