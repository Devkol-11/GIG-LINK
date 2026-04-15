import type { ROLE_USER } from "../prisma/generated/prisma/enums.js";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: ROLE_USER;
      };
    }
  }
}

export {};
