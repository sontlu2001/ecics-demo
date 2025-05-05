import { prisma } from '@/app/api/libs/prisma';
import { getCustomerInfoDTO } from './customer-info.dto';
import logger from '@/app/api/libs/logger';

export async function getCustomerInfo(data: getCustomerInfoDTO) {
  const { vehicle_registration_number } = data;

  const cusstomerInfo = await prisma.cusstomerInfo.findUnique({
    select: {
      name: true,
      vehicle_registration_number: true,
      sex: true,
      country: true,
      source: true,
      is_allowed_new_biz: true,
      is_allowed_renewal: true,
      national_identity_no: true,
    },
    where: {
      vehicle_registration_number: vehicle_registration_number,
    },
  });

  if (!cusstomerInfo) {
    logger.info(
      `Customer info not found for vehicle registration number: ${vehicle_registration_number}`,
    );
    return {
      message: 'Customer info not found',
      data: null,
    };
  }

  logger.info(
    `Details of customer info retrieved: ${JSON.stringify(cusstomerInfo)} for vehicle registration number: ${vehicle_registration_number}`,
  );
  return {
    message: 'Customer info retrieved successfully',
    data: cusstomerInfo,
  };
}
