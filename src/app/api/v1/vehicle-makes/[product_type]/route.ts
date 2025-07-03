import { NextRequest } from 'next/server';
import { successRes } from '@/app/api/core/success.response';
import logger from '@/app/api/libs/logger';
import { ErrBadRequest } from '@/app/api/core/error.response';
import { getVehicleMakesByProductName } from './vehicle-make.service';

export const GET = async (
  req: NextRequest,
  context: { params: { product_type: string } },
) => {
  const productTypeName = context.params.product_type;

  logger.info(
    `Received request to get all makes by product type: ${productTypeName}`,
  );

  if (!productTypeName) {
    return ErrBadRequest('Product type is required');
  }

  const results = await getVehicleMakesByProductName(productTypeName);
  logger.info(`Successfully fetched vehicle makes: ${JSON.stringify(results)}`);

  return successRes({
    data: results,
    message: 'Get vehicle makes successfully',
  });
};
