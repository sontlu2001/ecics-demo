import logger from '@/app/api/libs/logger';
import { prisma } from '@/app/api/libs/prisma';

export async function handleDetectIPAdress(
  ipAddress: string,
  productType: string,
) {
  try {
    logger.info(
      `Request log ipAddress: ${ipAddress} for productType: ${productType}`,
    );

    const requestLogData = await prisma.requestLog.create({
      data: {
        ip: ipAddress,
        product_type: productType,
      },
    });

    logger.info(
      `Request log created successfully with data: ${requestLogData}`,
    );
  } catch (error) {
    logger.error(`Error occurred while getting quote by key: ${error}`);
    return {
      message: 'Internal server error',
      data: null,
    };
  }
}
