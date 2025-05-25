import { NextRequest } from "next/server";
import { successRes } from "@/app/api/core/success.response";
import logger from "@/app/api/libs/logger";
import { getCustomerInfoDTO } from "./customer-info.dto";
import { getCustomerInfo } from "./customer-info.service";

export const GET = async (
  req: NextRequest,
  context: { params: { vehicle_registration_number: string }}
) => {
  const validatedParams = getCustomerInfoDTO.parse(context.params);
  const vehicleNumber = validatedParams.vehicle_registration_number;
  const result = await getCustomerInfo({ vehicle_registration_number: vehicleNumber });
  logger.info(`Received request to get customer info for vehicle number: ${vehicleNumber}`);

  return successRes(result);
}

