import { Request, Response, NextFunction } from "express";
import { logger } from "@core/logging/winston";
import { BusinessError } from "@src/contexts/Auth/domain/errors/DomainErrors";
import { sendError } from "../helpers/sendError";
import { HttpError } from "../errors/httpError";

export const globalErrorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error(err);

  if (err instanceof BusinessError) {
    return sendError(res, err.statusCode, {
      message: err.message,
      err,
    });
  }

  if (err instanceof HttpError) {
    return sendError(res, err.statusCode, err.message);
  }

  return sendError(res, 500, {
    message: "Internal Server Error",
    err: err,
  });
};
