import { NextRequest } from 'next/server';
import logger from '../libs/logger/index';

export const logRequest = async (req: NextRequest) => {
  const { method, url } = req;
  const headers = Object.fromEntries(req.headers.entries());

  let body = null;

  if (method === 'POST' || method === 'PUT') {
    try {
      body = await req.clone().json();
    } catch {
      body = 'Unable to parse body';
    }
  }

  logger.info(`${method}:: ${url} \n header: ${JSON.stringify(headers)} \n body: ${JSON.stringify(body)}`);
};
