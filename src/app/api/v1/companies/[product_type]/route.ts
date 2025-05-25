import { NextRequest } from 'next/server';
import { getAllCompanies } from './company.service';
import logger from '../../../libs/logger';
import { successRes } from '../../../core/success.response';
import { ErrBadRequest } from '../../../core/error.response';

export const GET = async (
  req: NextRequest,
  context: { params: { product_type: string } },
) => {
  const productTypeName = context.params.product_type;
  logger.info(
    `Received request to get all companies for product type: ${productTypeName}`,
  );

  if (!productTypeName) {
    return ErrBadRequest('Product type is required');
  }

  const result = await getAllCompanies(productTypeName);

  return successRes({
    data: result,
    message: 'Companies fetched successfully',
  });
};
