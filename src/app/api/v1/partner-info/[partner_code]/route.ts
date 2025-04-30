import { NextRequest } from 'next/server';
import { successRes } from '@/app/api/core/success.response';
import logger from '@/app/api/libs/logger';
import { ErrBadRequest, ErrNotFound } from '@/app/api/core/error.response';
import { getInfoPartnerName } from './partner-info.service';

export const GET = async (
  req: NextRequest,
  context: { params: { partner_code: string } },
) => {
  const partnerCode = context.params.partner_code;

  logger.info(
    `Received request to get partner info for partner code: ${partnerCode}`,
  );

  if (!partnerCode) {
    return ErrBadRequest('Partner code is required');
  }

  const result = await getInfoPartnerName(partnerCode);
  logger.info(`Successfully fetched partner info: ${JSON.stringify(result)}`);

  if (!result) {
    return ErrNotFound('Partner code not found');
  }

  return successRes({
    data: {
      partner_code: partnerCode,
      partner_name: result.partner_name,
    },
    message: 'Get partner info successfully',
  });
};
