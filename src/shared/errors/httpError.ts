export class HttpError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly message: string;

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);

    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.message = message;

    Error.captureStackTrace(this);
  }
}
