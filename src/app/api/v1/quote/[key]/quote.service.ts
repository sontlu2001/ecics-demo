import { PrismaClient } from "@prisma/client";
import logger from "@/app/api/libs/logger";

const prisma = new PrismaClient();

export async function getQuoteByKey(key: string) {
  try {
    const quote = await prisma.quote.findFirst({
      where: {
        key,
      },
      include: {
        promoCode: {
          select: {
            code: true,
            discount: true,
            startTime: true,
            endTime: true,
            description: true,
            products: true,
            isPublic: true,
            isShowCountdown: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        personalInfo: {
          select: {
            id: true,
            phone: true,
            email: true,
            name: true,
            gender: true,
            nric: true,
            maritalStatus: true,
            dateOfBirth: true,
            address: true,
            vehicleMake: true,
            vehicleModel: true,
            yearOfRegistration: true,
            vehicles: true,
          },
        },
        countryNationality: {
          select: {
            id: true,
            name: true,
          },
        },
        productType: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!quote) {
      logger.info(`Quote with key ${key} not found`);
      return {
        message: "Quote not found",
        data: null,
      };
    }

    logger.info(`Quote with key ${key} found: ${JSON.stringify(quote)}`);
    return {
      message: "Quote found",
      data: quote,
    };
  } catch (error) {
    logger.error(`Error occurred while getting quote by key: ${error}`);
    return {
      message: "Internal server error",
      data: null,
    };
  }
}
