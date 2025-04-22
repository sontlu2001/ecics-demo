import { NextRequest, NextResponse } from "next/server";

import { requestHandler } from "@/app/api/middleware/requestHandler";
import { successRes } from "@/app/api/core/success.response";
import { saveQuoteDTOSchema } from "./quote.dto";
import { saveQuote } from "./quote.service";

export const POST = requestHandler(async (req: NextRequest) => {
  const body = await req.json();
  const data = saveQuoteDTOSchema.parse(body);
  const result = await saveQuote(data);

  return successRes(result);
});