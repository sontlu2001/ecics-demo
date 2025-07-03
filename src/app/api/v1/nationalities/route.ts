import { NextRequest } from 'next/server';
import { successRes } from '../../core/success.response';
import { ErrBadRequest } from '../../core/error.response';
import { prisma } from '../../libs/prisma';
import logger from '../../libs/logger';

export const GET = async (req: NextRequest) => {
  const groupName = req.nextUrl.searchParams.get('group_name') || undefined;

  const results = await prisma.countryNationality.findMany({
    where: {
      group_name: groupName,
    },
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      id: 'asc',
    },
  });

  return successRes({
    data: results,
    message: 'Get national successfully',
  });
};
