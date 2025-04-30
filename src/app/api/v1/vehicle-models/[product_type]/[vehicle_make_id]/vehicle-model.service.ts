import logger from '@/app/api/libs/logger';
import { prisma } from '@/app/api/libs/prisma';

export async function getVehicleModelsByProductName(
  productTypeName: string,
  vehicleMakeId: string,
) {
  try {
    const listModels = await prisma.vehicleModel.findMany({
      select: {
        id: true,
        name: true,
      },
      where: {
        vehicleMake: {
          id: Number(vehicleMakeId),
        },
        productType: {
          name: productTypeName,
        },
      },
    });
    return listModels;
  } catch (error) {
    logger.error(`Error occurred while getting vehicle models: ${error}`);
    return {
      message: 'Internal server error',
      data: null,
    };
  }
}
