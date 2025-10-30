import { Request, Response, NextFunction } from "express";
import { logger } from "@core/logging/winston.js";
import { sendError } from "../helpers/sendError.js";
import { HttpError } from "../errors/httpError.js";

export const globalErrorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error(err);

  if (err.isBusinessError || (err.statusCode && err.statusCode < 500)) {
    const statusCode = err.statusCode || 400;
    return sendError(res, statusCode, {
      message: err.message,
      err: {
        statusCode: err.statusCode,
        name: err.name,
      },
    });
  }

  if (err instanceof HttpError) {
    sendError(res, err.statusCode, {
      message: err.message,
      err: {
        statusCode: err.statusCode,
        name: err.name,
      },
    });
  }

  return sendError(res, 500, {
    message: "Internal Server Error",
    err: err,
  });
};
