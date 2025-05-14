import { handleApiCallToISP } from '@/app/api/configs/api.config';
import { CAR_INSURANCE } from '@/app/api/constants/car.insurance';
import { ErrFromISPRes, ErrNotFound } from '@/app/api/core/error.response';
import { successRes } from '@/app/api/core/success.response';
import logger from '@/app/api/libs/logger';
import { prisma } from '@/app/api/libs/prisma';

export async function saveProposalFinalizeForCar(data: { key: string }) {
  const { key } = data;
  const quoteInfo = await prisma.quote.findFirst({
    where: {
      key: key,
    },
    select: {
      quote_id: true,
      proposal_id: true,
      id: true,
      is_finalized: true,
      payment_id: true,
    },
  });

  if (!quoteInfo) {
    return ErrNotFound('Quote not found');
  }

  const { quote_id, proposal_id } = quoteInfo;

  logger.info(
    `Saving proposal for car with quote_id: ${quote_id}, proposal_id: ${proposal_id}`,
  );

  const resSaveProposalFinalize = await handleApiCallToISP(
    `/${CAR_INSURANCE.PREFIX_ENDPOINT}/proposal`,
    {
      proposal_id,
      quote_id,
      __finalize: 1,
    },
  );

  if (resSaveProposalFinalize.status !== 0) {
    logger.error(
      `Error from ISP while saving proposal: ${JSON.stringify(resSaveProposalFinalize)}`,
    );
    return ErrFromISPRes(resSaveProposalFinalize);
  }

  await prisma.quote.update({
    where: {
      id: quoteInfo.id,
    },
    data: {
      is_finalized: true,
      payment_id: resSaveProposalFinalize.data?.payment_id || '',
    },
  });

  return successRes({
    message: 'Proposal saved successfully',
    data: resSaveProposalFinalize.data,
  });
}
