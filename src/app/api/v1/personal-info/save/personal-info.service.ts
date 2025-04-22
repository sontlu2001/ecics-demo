import { prisma } from "@/app/api/libs/prisma";
import { savePersonalInfoDTO } from "./personal-info.dto";
import logger from "@/app/api/libs/logger";
import { sendMail } from "@/app/api/libs/mailer";
import { generateQuoteEmail } from "@/app/api/libs/mailer/templates";

export async function savePersonalInfo(data: savePersonalInfoDTO) {
  try {
    const existingQuoteInfo = await prisma.quote.findFirst({
      where: {
        key: data.key,
      },
    });

    if (existingQuoteInfo) {
      console.log(`Quote info with key ${data.key} already exists`);
      return {
        message: "Quote info already exists.",
        data: null,
      };
    }

    const newPersonalInfo = await prisma.personalInfo.create({
      data: {
        email: data.email,
        phone: data.phone,
        name: data.name,
        nric: data.nric,
        gender: data.gender,
        maritalStatus: data.maritalStatus,
        dateOfBirth: data.dateOfBirth,
        address: data.address,
        vehicleMake: data.vehicleMake,
        vehicleModel: data.vehicleModel,
        yearOfRegistration: data.yearOfRegistration,
        vehicles: data.vehicles ?? [],
      },
    });
    console.log(`Creating a new personal info: ${JSON.stringify(newPersonalInfo)}`);

    const newQuote = await prisma.quote.create({
      data: {
        key: data.key,
        personalInfoId: newPersonalInfo.id,
      }
     });
     console.log(`Creating a new quote info: ${JSON.stringify(newQuote)}`);

    const retrieveQuoteHTML = generateQuoteEmail({
      name: newPersonalInfo.name ?? "",
      quote_key: newQuote.key ?? "",
    });

    sendMail({
      to: newPersonalInfo.email ?? "",
      subject: `ECICS Limited |`,
      html: retrieveQuoteHTML
    });

    return {
      message: "Personal info created successfully.",
      data: {
        ...newPersonalInfo,
        key: newQuote.key,
      },
    };
  } catch (error) {
    logger.error(`Error saving personal info: ${error}`);
    throw new Error("Failed to save personal info.");
  }
}
