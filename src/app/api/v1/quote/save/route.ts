import { NextRequest, NextResponse } from "next/server";

import { requestHandler } from "@/app/api/middleware/requestHandler";
import { successRes } from "@/app/api/core/success.response";
import { saveQuoteDTOSchema } from "./quote.dto";
import { getQuoteByKey, saveQuote } from "./quote.service";
import { QUOTE_MESSAGES } from "./quote.contants";

export const POST = requestHandler(async (req: NextRequest) => {
  const body = await req.json();
  const data = saveQuoteDTOSchema.parse(body);
  const result = await saveQuote(data);

  return successRes(result);
});

export const GET = requestHandler(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");

  console.log("key", key);
  if (!key) {
    return NextResponse.json({ message: QUOTE_MESSAGES.QUOTE_KEY_REQUIRED }, { status: 400 });
  }

  const result = await getQuoteByKey(key);

  return successRes(result);
});
