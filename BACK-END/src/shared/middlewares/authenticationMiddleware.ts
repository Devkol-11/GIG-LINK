// middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import { jwtLibary } from "@src/contexts/Auth/infrastructure/JwtService.js";
import { logger } from "@core/logging/winston.js";

export const Authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid token" });
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwtLibary.verifyAccessToken(token);

  if (!decoded) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  console.log(`decoded payoad : ${JSON.stringify(decoded, null, 2)}`);

  Object.defineProperty(req, "user", {
    value: decoded,
    writable: false,
    enumerable: true,
  });

  next();
};
