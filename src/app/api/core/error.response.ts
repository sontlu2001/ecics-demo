import { NextResponse } from 'next/server';

import { STATUS_CODE } from './status.code';

type BaseResponse = {
  message: string;
};

export class HttpError extends Error {
  public readonly statusCode: number;
  public readonly data: any;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class NotFoundError extends HttpError {
  constructor(message: string) {
    super(message, STATUS_CODE.NOT_FOUND);
  }
}

export class BadRequestError extends HttpError {
  constructor(message: string) {
    super(message, STATUS_CODE.BAD_REQUEST);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message: string) {
    super(message, STATUS_CODE.UNAUTHORIZED);
  }
}

export class ForbiddenError extends HttpError {
  constructor(message: string) {
    super(message, STATUS_CODE.FORBIDDEN);
  }
}

export class ConflictError extends HttpError {
  constructor(message: string) {
    super(message, STATUS_CODE.CONFLICT);
  }
}

export function ErrFromISPRes(message: string) {
  const res: BaseResponse = {
    message,
  };
  return NextResponse.json(res, { status: STATUS_CODE.BAD_REQUEST });
}

export function ErrBadRequest(message: string) {
  const res: BaseResponse = {
    message,
  };
  return NextResponse.json(res, { status: STATUS_CODE.BAD_REQUEST });
}

export function ErrNotFound(message: string) {
  const res: BaseResponse = {
    message,
  };
  return NextResponse.json(res, { status: STATUS_CODE.NOT_FOUND });
}
