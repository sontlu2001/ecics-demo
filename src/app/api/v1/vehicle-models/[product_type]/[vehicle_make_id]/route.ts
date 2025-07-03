import { NextRequest } from 'next/server';
import { successRes } from '@/app/api/core/success.response';
import logger from '@/app/api/libs/logger';
import { ErrBadRequest } from '@/app/api/core/error.response';
import { getVehicleModelsByProductName } from './vehicle-model.service';

export const GET = async (
  req: NextRequest,
  context: { params: { product_type: string; vehicle_make_id: string } },
) => {
  const productTypeName = context.params.product_type;
  const vehicleMakeId = context.params.vehicle_make_id;

  logger.info(
    `Received request to get all models by product type: ${productTypeName}, vehicle make id: ${context.params.vehicle_make_id}`,
  );

  if (!productTypeName) {
    return ErrBadRequest('Product type is required');
  }

  if (!vehicleMakeId) {
    return ErrBadRequest('Vehicle make id is required');
  }

  const results = await getVehicleModelsByProductName(
    productTypeName,
    vehicleMakeId,
  );
  logger.info(
    `Successfully fetched vehicle models: ${JSON.stringify(results)}`,
  );

  return successRes({
    data: results,
    message: 'Get vehicle models successfully',
  });
};
