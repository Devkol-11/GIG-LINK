import { Request, Response, NextFunction } from "express";

import { createGigSchema } from "./create-gig.schema.js";

export const validateCreateGig = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = createGigSchema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      status: "error",
      message: "Validation failed",
      errors: error.details.map((err) => err.message),
    });
  }

  next();
};
