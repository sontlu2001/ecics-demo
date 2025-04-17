import { NextRequest, NextResponse } from "next/server";
import { getInfoPromocode } from "./promo-code.service";
import { getInfoPromoCodeSchema } from "./promo-code.dto";
import { requestHandler } from "@/app/api/middlewares/requestHandler";

export const POST = requestHandler(async (req: NextRequest) => {
  const body = await req.json();
  const data = getInfoPromoCodeSchema.parse(body);
  const result = await getInfoPromocode(data);

  return NextResponse.json({ success: true, data: result });
});
