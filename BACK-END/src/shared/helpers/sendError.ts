import { Response } from "express";

export const sendError = (res: Response, statusCode: number, data: any) => {
  (res as Response).status(statusCode).json({
    ...data,
  });
};
