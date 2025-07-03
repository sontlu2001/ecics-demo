import apiServer from '@/app/api/configs/api.config';
import logger from '@/app/api/libs/logger';

export async function getInfoPartnerName(partnerCode: string) {
  try {
    // Call the API from ISP to get partner info
    const response = await apiServer.post('/getInfo/partner', {
      partner_code: partnerCode,
    });
    logger.info(`Response from ISP: ${JSON.stringify(response.data)}`);

    if (response.data.status === 0) {
      return response.data.data;
    }

    return null;
  } catch (error) {
    logger.error(`Error fetching partner info: ${error}`);
    throw new Error('Error fetching partner info');
  }
}
