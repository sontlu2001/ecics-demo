import { NextRequest } from 'next/server';
import { getAllCompanies } from './company.service';
import logger from '../../libs/logger';
import { successRes } from '../../core/success.response';

export const GET = async (
  req: NextRequest,
  context: { params: { product_type: string }}
) => {
  const productTypeName = context.params.product_type;

  if (!productTypeName) {
    return new Response('Product type is required', { status: 400 });
  }

  const result = await getAllCompanies(productTypeName);
  logger.info(`Received data to get all companies for product type: ${productTypeName}`);

  return successRes({
    data: result,
    message: 'Companies fetched successfully',
  });
}
