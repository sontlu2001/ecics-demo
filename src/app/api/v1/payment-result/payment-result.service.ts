import { paymentDTO } from './payment-result.dto';
import logger from '../../libs/logger';
import { sendMail } from '../../libs/mailer';
import { teslaFractionalEmail } from '../../libs/mailer/templates';
import { prisma } from '../../libs/prisma';

export async function handlePaymentResult(data: paymentDTO) {
  logger.info(`Handling payment result with data: ${JSON.stringify(data)}`);

  try {
    const { policy_id, policy_no } = data;
    logger.info(
      `Processing payment for policy_id: ${policy_id}, policy_no: ${policy_no}`,
    );

    const result = await prisma.paymentResult.create({
      data: { policy_id, policy_no },
    });
    logger.info(`Payment result saved: ${JSON.stringify(result)}`);

    const quoteInfo = await prisma.quote.findFirst({
      where: { policy_id },
      select: {
        id: true,
        is_electric_model: true,
        email: true,
        name: true,
      },
    });

    if (!quoteInfo) {
      logger.warn(`Quote not found for policy_id: ${policy_id}`);
      return result;
    }

    await prisma.quote.update({
      where: { id: quoteInfo.id },
      data: {
        is_paid: true,
        payment_result_id: result.id,
      },
    });

    logger.info(`Quote updated to paid: ${JSON.stringify(quoteInfo)}`);

    if (quoteInfo.is_electric_model && quoteInfo.email && quoteInfo.name) {
      sendMail({
        to: quoteInfo.email,
        subject:
          'Tesla Motor Insurance Fractional Shares Campaign (FSPROMO) Details Inside',
        html: teslaFractionalEmail(quoteInfo.email, quoteInfo.name),
      });
      logger.info(
        `Tesla promo email sent to: ${quoteInfo.email}, name: ${quoteInfo.name}`,
      );
    }

    return result;
  } catch (error) {
    logger.error(`Payment result handling failed: ${error}`);
    throw new Error('Error while handling payment result');
  }
}
