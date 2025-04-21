import { PrismaClient } from "@prisma/client";
import { saveQuoteDTO } from "./quote.dto";
import logger from "@/app/api/_libs/logger";
import { generateQuoteEmail } from "@/app/api/libs/mailer/templates";
import { sendMail } from "@/app/api/libs/mailer";

const prisma = new PrismaClient();

export async function saveQuote(data: saveQuoteDTO) {
  const existingQuote = await prisma.quote.findFirst({
    where: {
      OR: [{ quoteId: data.quoteId ?? undefined }, { key: data.key }],
    },
  });

  if (existingQuote) {
    logger.info(
      `Quote with ID ${existingQuote.id} found. Updating with new data: ${JSON.stringify(data)}`
    );
    const updatedQuote = await prisma.quote.update({
      where: { id: existingQuote.id },
      data: {
        quoteNo: data.quoteNo,
        policyId: data.policyId,
        phone: data.phone,
        email: data.email,
        name: data.name,
        data: data.data,
        partnerCode: data.partnerCode,
        isFinalized: data.isFinalized ?? false,
        isPaid: data.isPaid ?? false,
        expirationDate: data.expirationDate ? new Date(data.expirationDate) : undefined,
        key: data.key,
        ipAddress: data.ipAddress,
        country: data.country,
        city: data.city,
        personalInfoId: data.personalInfoId,
        companyId: data.companyId,
        paymentResultId: data.paymentResultId,
        countryNationalityId: data.countryNationalityId,
        productTypeId: data.productTypeId,
        promoCodeId: data.promoCodeId,
        updatedAt: new Date(),
      },
      include: {
        promoCode: {
          select: {
            code: true,
            discount: true,
            start_time: true,
            end_time: true,
            description: true,
            products: true,
            is_public: true,
            is_show_countdown: true,
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
            chassisNumber: true,
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

    return {
      message: "Quote updated successfully.",
      data: updatedQuote,
    };
  } else {
    logger.info(`Quote not found. Creating a new quote with data: ${JSON.stringify(data)}`);
    const newQuote = await prisma.quote.create({
      data: {
        quoteId: data.quoteId,
        quoteNo: data.quoteNo,
        policyId: data.policyId,
        phone: data.phone,
        email: data.email,
        name: data.name,
        data: data.data,
        partnerCode: data.partnerCode,
        isFinalized: data.isFinalized ?? false,
        isPaid: data.isPaid ?? false,
        expirationDate: data.expirationDate ? new Date(data.expirationDate) : undefined,
        key: data.key,
        ipAddress: data.ipAddress,
        country: data.country,
        city: data.city,
        personalInfoId: data.personalInfoId,
        companyId: data.companyId,
        paymentResultId: data.paymentResultId,
        countryNationalityId: data.countryNationalityId,
        productTypeId: data.productTypeId,
        promoCodeId: data.promoCodeId,
      },
    });

    const retrieveQuoteHTML = generateQuoteEmail('test');
    sendMail({
      to: "kric@example.com",
      subject: "Welcome to ECICS",
      html: retrieveQuoteHTML
    });

    return {
      message: "Quote created successfully.",
      data: newQuote,
    };
  }
}

export async function getQuoteByKey(key: string) {
  const quote = await prisma.quote.findFirst({
    where: {
      key,
    },
    include: {
      promoCode: {
        select: {
          code: true,
          discount: true,
          start_time: true,
          end_time: true,
          description: true,
          products: true,
          is_public: true,
          is_show_countdown: true,
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
          chassisNumber: true,
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
}
