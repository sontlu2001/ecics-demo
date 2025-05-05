import { PRODUCT_NAME } from '@/app/api/constants/product';
import { NextRequest, NextResponse } from 'next/server';
import logger from '@/app/api/libs/logger';
import { saveProposalForCar } from './save-proposal.service';

export async function POST(
  req: NextRequest,
  context: { params: { product: string } },
) {
  const body = await req.json();
  const productName = context.params.product;

  logger.info(
    `Received request to save proposal: ${productName} with body: ${JSON.stringify(body)}`,
  );

  switch (productName) {
    case PRODUCT_NAME.CAR:
      return saveProposalForCar(body);
    default:
      return NextResponse.json(
        { error: 'Unsupported product' },
        { status: 400 },
      );
  }
}
