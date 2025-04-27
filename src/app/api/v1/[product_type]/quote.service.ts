import geoip from 'geoip-lite';
import logger from '@/app/api/libs/logger';
import countries from 'i18n-iso-countries';
import { prisma } from '@/app/api/libs/prisma';

export async function handleDetectIPAdress(ipAddress: string, productType: string) {
  try {
    logger.info(`Request log ipAddress: ${ipAddress} for productType: ${productType}`);
    const geo = geoip.lookup(ipAddress);
    let countryName = '';
    let city = '';

    if (geo) {
      const countryCode = geo.country;
      logger.info('Request log country code', { countryName, city });
      countryName = countries.getName(countryCode, 'en') || '';
      city = geo.city;

      const requestLogData = await prisma.requestLog.create({
        data: {
          country: countryName,
          city: city,
          ip: ipAddress,
          productType: productType,
        },
      })
      logger.info('Request log data', { requestLogData });
    }
  } catch (error) {
    logger.error(`Error occurred while getting quote by key: ${error}`);
    return {
      message: 'Internal server error',
      data: null,
    };
  }
}
