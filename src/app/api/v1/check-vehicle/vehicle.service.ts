import logger from '@/app/api/libs/logger';
import { prisma } from '@/app/api/libs/prisma';

export async function checkVehicleMakeAndModel(
  vehicle_make: string,
  vehicle_model: string,
) {
  try {
    const modelInfo = await prisma.vehicleModel.findFirst({
      select: {
        id: true,
        name: true,
        vehicle_make: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      where: {
        vehicle_make: {
          name: vehicle_make,
        },
        name: vehicle_model,
      },
    });
    return modelInfo;
  } catch (error) {
    logger.error(
      `Error occurred while checking vehicle make and model: ${error}`,
    );
    return {
      message: 'Internal server error',
      data: null,
    };
  }
}
