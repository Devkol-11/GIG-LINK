import Express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler } from "../shared/middlewares/errorHandler";

export const ExpressApplication = Express();

ExpressApplication.use(helmet);
ExpressApplication.use(Express.json());
ExpressApplication.use(morgan("dev"));

ExpressApplication.use(errorHandler);
