import { log } from 'console';
import logger from '../../../libs/logger';
import { prisma } from '../../../libs/prisma';

export async function getAllCompanies(productTypeName: string) {
  try {
    const resCompanies = await prisma.company.findMany({
      select: {
        id: true,
        name: true,
      },
      where: {
        product_type: {
          name: productTypeName,
        },
      },
    });
    return resCompanies;
  } catch (error) {
    logger.error(`Error fetching companies: ${error}`);
    throw new Error('Error fetching companies');
  }
}
