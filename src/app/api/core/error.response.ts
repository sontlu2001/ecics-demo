import { NextResponse } from 'next/server';
import { STATUS_CODE } from './status.code';

type BaseResponse = {
  message: string;
};

export function ErrFromISPRes({ message = 'Error' }: { message?: string }) {
  const res: BaseResponse = {
    message,
  };
  return NextResponse.json(res, { status: STATUS_CODE.BAD_REQUEST });
}


export function ErrBadRequest({message = 'Error' }: { message?: string }) {
  const res: BaseResponse = {
    message,
  };
  return NextResponse.json(res, { status: STATUS_CODE.BAD_REQUEST });
}

export function ErrNotFound({ message = 'Error' }: { message?: string }) {
  const res: BaseResponse = {
    message,
  };
  return NextResponse.json(res, { status: STATUS_CODE.NOT_FOUND });
}

