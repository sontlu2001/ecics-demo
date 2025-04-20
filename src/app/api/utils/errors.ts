export class BadRequestError extends Error {
  statusCode = 400;
  constructor(message: string) {
    super(message);
    this.name = 'BadRequestError';
  }
}

export class InternalServerError extends Error {
  statusCode = 500;
  constructor(message = 'Internal Server Error') {
    super(message);
    this.name = 'InternalServerError';
  }
}