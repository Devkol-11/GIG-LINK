import { Request, Response, NextFunction } from "express";
import { logger } from "@core/logging/winston";
import { DomainException } from "@src/contexts/Auth/domain/exceptions/DomainException";
import { sendResponse } from "../helpers/ResponseHelpers";
import { HttpError } from "../errors/appError";

export const globalErrorHandler = (
  err: any,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(err);

  if (err instanceof DomainException) {
    return sendResponse(res, err.statusCode, {
      err,
      message: err.message,
    });
  }

  if (err instanceof HttpError) {
    return sendResponse(res, err.statusCode, err.message);
  }

  return sendResponse(res, 500, "Internal Server Error");
};
