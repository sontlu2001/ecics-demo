import logger from '@/app/api/libs/logger';
import { prisma } from '@/app/api/libs/prisma';

export async function getVehicleMakesByProductName(productTypeName: string) {
  try {
    const listMakes = await prisma.vehicleMake.findMany({
      select: {
        id: true,
        name: true,
        groupName: true,
      },
      where: {
        productType: {
          name: productTypeName,
        },
      },
    });
    return listMakes;
  } catch (error) {
    logger.error(`Error occurred while getting vehicle makes: ${error}`);
    return {
      message: 'Internal server error',
      data: null,
    };
  }
}
