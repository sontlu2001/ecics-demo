import logger from "../../libs/logger";
import { prisma } from "../../libs/prisma";

export async function getAllCompanies(productTypeName: string) {
  try {
    return await prisma.company.findMany({
      select: {
        id: true,
        name: true,
        type: true,
      },
      where: {
        productType: {
          name: productTypeName,
        },
      },
    });
  } catch (error) {
    logger.error(`Error fetching companies: ${error}`);
    throw new Error("Error fetching companies");
  }
}
