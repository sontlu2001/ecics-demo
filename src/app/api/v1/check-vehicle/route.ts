import { NextRequest } from 'next/server';
import { successRes } from '@/app/api/core/success.response';
import { checkVehicleDTOSchema } from './check-vechicle.dto';
import logger from '../../libs/logger';
import { checkVehicleMakeAndModel } from './vehicle.service';
import { ErrNotFound } from '../../core/error.response';

export const POST = async (
  req: NextRequest,
  context: { params: { product_type: string } },
) => {
  const body = await req.json();
  logger.info(`Received request to check vehicle: ${JSON.stringify(body)}`);
  const data = checkVehicleDTOSchema.parse(body);

  const results = await checkVehicleMakeAndModel(
    data.vehicle_make,
    data.vehicle_model,
  );
  logger.info(`Successfully checked vehicle: ${JSON.stringify(results)}`);

  if (!results) {
    return ErrNotFound('Vehicle make or model not found');
  }

  return successRes({
    data: results,
    message: 'Check vehicle successfully',
  });
};
