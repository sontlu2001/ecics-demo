import logger from '../../libs/logger';
import { prisma } from '../../libs/prisma';
import { paymentDTO } from './payment-result.dto';

export async function handlePaymentResult(data: paymentDTO) {
  try {
    const { policy_id, policy_no } = data;
    logger.info(
      `Payment result for policy_id: ${policy_id}, policy_no: ${policy_no}`,
    );

    const result = await prisma.paymentResult.create({
      data: {
        policy_id,
        policy_no,
      },
    });
    logger.info(`Payment result saved successfully: ${JSON.stringify(result)}`);

    return result;
  } catch (error) {
    logger.error(`Error while handling payment result: ${error}`);
    throw new Error('Error while handling payment result');
  }
}
