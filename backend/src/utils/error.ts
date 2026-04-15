import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode = 500,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function errorHandler(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      error: true,
      message: error.issues.map((issue) => issue.message).join(", "),
      statusCode: 400,
    });
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      error: true,
      message: error.message,
      statusCode: error.statusCode,
    });
  }

  return res.status(500).json({
    error: true,
    message: "Internal server error",
    statusCode: 500,
  });
}
