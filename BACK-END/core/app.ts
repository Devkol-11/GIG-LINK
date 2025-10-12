import Express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { authRoutes } from "@src/contexts/Auth/http/routes/AuthRoutes";
import { logger } from "./logging/winston";

import { globalErrorHandler } from "@src/shared/middlewares/globalErrorHandler";

logger.info("request entered Express");

const createExpressApplication = (
  authRoutes: Express.Router
): Express.Application => {
  const ExpressApplication = Express();

  ExpressApplication.use(Express.json());
  ExpressApplication.use(morgan("dev"));
  ExpressApplication.use(helmet());

  ExpressApplication.use("/api/auth", authRoutes);

  ExpressApplication.use(globalErrorHandler);

  return ExpressApplication;
};

export const ExpressApplication = createExpressApplication(authRoutes);
