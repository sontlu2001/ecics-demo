import { paymentDTO } from './payment.dto';
import { handleApiCallToISP } from '../../configs/api.config';
import { CAR_INSURANCE } from '../../constants/car.insurance';
import { ErrFromISPRes, ErrNotFound } from '../../core/error.response';
import logger from '../../libs/logger';
import { prisma } from '../../libs/prisma';

export async function handlePayment(data: paymentDTO) {
  try {
    const { key } = data;
    const quoteInfo = await prisma.quote.findFirst({
      where: {
        key: key,
      },
      select: {
        quote_id: true,
        payment_id: true,
        email: true,
        id: true,
      },
    });

    if (!quoteInfo) {
      return ErrNotFound('Quote not found');
    }

    const payloadData = {
      payment_id: quoteInfo.payment_id,
      email: quoteInfo.email,
      redirect_url: `${process.env.NEXT_PUBLIC_REDIRECT_PAYMENT_WEBSITE}?key=${key}`,
      return_baseurl: process.env.NEXT_PUBLIC_CALLBACK_PAYMENT_URL,
    };

    const resPayment = await handleApiCallToISP(
      `/${CAR_INSURANCE.PREFIX_ENDPOINT}/payment`,
      payloadData,
    );
    logger.info(`Response from payment: ${JSON.stringify(resPayment)}`);

    if (resPayment.status !== 0) {
      logger.error(
        `Error from ISP while handling payment: ${JSON.stringify(resPayment)}`,
      );
      return ErrFromISPRes(resPayment);
    }

    return resPayment.data;
  } catch (error) {
    logger.error(`Error while handling payment: ${error}`);
    throw new Error('Error while handling payment');
  }
}
