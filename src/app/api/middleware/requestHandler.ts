import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';

import { logRequest } from './requestLogger';
import { HttpError } from '../core/error.response';
import logger from '../libs/logger';

export const requestHandler = (
  handler: (req: NextRequest) => Promise<NextResponse>,
) => {
  return async (req: NextRequest) => {
    await logRequest(req);
    try {
      return await handler(req);
    } catch (err) {
      logger.error('Caught error:', err);

      // Handle Zod validation error
      if (err instanceof ZodError) {
        return NextResponse.json(
          {
            error: 'Validation Error',
            details: err.errors.map((e) => ({
              path: e.path.join('.'),
              message: e.message,
            })),
          },
          { status: 400 },
        );
      }

      if (err instanceof HttpError) {
        return NextResponse.json(
          {
            error: err.message,
          },
          {
            status: err.statusCode,
          },
        );
      }

      // Fallback error
      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 },
      );
    }
  };
};
