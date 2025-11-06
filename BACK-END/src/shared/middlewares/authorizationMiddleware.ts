import { Request, Response, NextFunction } from "express";
import { sendResponse } from "../helpers/sendResponse.js";
import { httpStatus } from "../constants/httpStatusCode.js";

export const Authorize = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendResponse(res, httpStatus.Forbidden, "Not Authenticated");
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendResponse(res, httpStatus.Unauthorized, "Not allowed");
    }

    next();
  };
};
