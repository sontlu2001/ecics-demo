import { NextRequest } from 'next/server';

import { successRes } from '@/app/api/core/success.response';
import { requestHandler } from '@/app/api/middleware/requestHandler';

import { savePersonalInfoDTOSchema } from './personal-info.dto';
import { savePersonalInfo } from './personal-info.service';

export const POST = requestHandler(async (req: NextRequest) => {
  const body = await req.json();
  const data = savePersonalInfoDTOSchema.parse(body);
  const result = await savePersonalInfo(data);

  return successRes(result);
});
