import { NextResponse } from 'next/server';

type BaseResponse<T = any> = {
  message: string;
  data: T;
};

export function successRes<T = any>({ data, message = 'Success' }: { data: T; message?: string }) {
  const res: BaseResponse<T> = {
    message,
    data,
  };
  return NextResponse.json(res, { status: 200 });
}

